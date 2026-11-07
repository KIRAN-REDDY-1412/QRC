import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Restaurant, 
  MenuCategory, 
  MenuItem, 
  MenuTemplate, 
  RestaurantTemplateSettings,
  RestaurantTable
} from '@/types';
import { 
  getStoredRestaurants, 
  saveStoredRestaurants, 
  getStoredCategories, 
  getAllStoredCategories,
  saveStoredCategories, 
  getStoredItems, 
  getAllStoredItems,
  saveStoredItems, 
  getStoredSettings, 
  saveStoredSettings,
  ALL_TEMPLATES, 
  isLiveSupabase, 
  supabase, 
  generateId 
} from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface RestaurantContextType {
  restaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  categories: MenuCategory[];
  items: MenuItem[];
  templateSettings: RestaurantTemplateSettings;
  templates: MenuTemplate[];
  tables: RestaurantTable[];
  setCurrentRestaurant: (restaurant: Restaurant) => void;
  updateRestaurantProfile: (updates: Partial<Restaurant>) => void;
  // Super Admin & Multi-restaurant operations
  updateRestaurantById: (restaurantId: string, updates: Partial<Restaurant>) => void;
  toggleRestaurantActive: (restaurantId: string) => void;
  addRestaurant: (restaurantData: Omit<Restaurant, 'id' | 'created_at' | 'updated_at' | 'owner_id'> & { owner_id?: string }) => Restaurant;
  getRestaurantCategories: (restaurantId: string) => MenuCategory[];
  getRestaurantItems: (restaurantId: string) => MenuItem[];
  getRestaurantSettings: (restaurantId: string) => RestaurantTemplateSettings;
  addRestaurantCategory: (restaurantId: string, name: string, description?: string, icon?: string) => MenuCategory;
  updateRestaurantCategory: (restaurantId: string, categoryId: string, updates: Partial<MenuCategory>) => void;
  deleteRestaurantCategory: (restaurantId: string, categoryId: string) => void;
  addRestaurantItem: (restaurantId: string, itemData: Omit<MenuItem, 'id' | 'restaurant_id' | 'order_index'>) => MenuItem;
  updateRestaurantItem: (restaurantId: string, itemId: string, updates: Partial<MenuItem>) => void;
  deleteRestaurantItem: (restaurantId: string, itemId: string) => void;
  toggleRestaurantItemAvailability: (restaurantId: string, itemId: string) => void;
  updateRestaurantTemplateSettings: (restaurantId: string, updates: Partial<RestaurantTemplateSettings>) => void;
  // Categories CRUD
  addCategory: (name: string, description?: string, icon?: string) => MenuCategory;
  updateCategory: (id: string, updates: Partial<MenuCategory>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (orderedIds: string[]) => void;
  // Items CRUD
  addItem: (item: Omit<MenuItem, 'id' | 'restaurant_id' | 'order_index'>) => void;
  updateItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteItem: (id: string) => void;
  toggleItemAvailability: (id: string) => void;
  // Template settings
  updateTemplateSettings: (updates: Partial<RestaurantTemplateSettings>) => void;
  selectTemplate: (templateId: string) => void;
  // Image handling
  uploadImage: (file: File) => Promise<string>;
  // Tables
  addTable: (tableNumber: string, section?: string, capacity?: number) => void;
  deleteTable: (tableId: string) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>(() => getStoredRestaurants());

  // Determine if active user is super admin
  const isSuperAdmin = user?.role === 'super_admin';

  // Strict Owner Isolation:
  // - Super Admin sees ALL restaurants across the SaaS platform
  // - Restaurant Owner sees ONLY their own restaurant(s)
  const visibleRestaurants = useMemo(() => {
    if (!user) return [];
    if (isSuperAdmin) return allRestaurants;
    return allRestaurants.filter(r => 
      (r.owner_id && r.owner_id === user.id) || 
      (r.email && user.email && r.email.toLowerCase() === user.email.toLowerCase())
    );
  }, [allRestaurants, user, isSuperAdmin]);

  const [currentRestaurant, setCurrentRestaurantState] = useState<Restaurant | null>(() => {
    const stored = getStoredRestaurants();
    if (!stored || stored.length === 0) return null;
    return stored[0];
  });

  // Sync restaurants from Supabase when user logs in or mounts
  const fetchRestaurantsFromSupabase = useCallback(async () => {
    if (!isLiveSupabase || !user) return;
    try {
      let query = supabase.from('restaurants').select('*');
      if (!isSuperAdmin) {
        query = query.or(`owner_id.eq.${user.id},email.eq.${user.email.toLowerCase()}`);
      }
      const { data, error } = await query;

      if (!error && data) {
        setAllRestaurants(data as Restaurant[]);
        saveStoredRestaurants(data as Restaurant[]);
        if (data.length > 0) {
          setCurrentRestaurantState(prev => {
            if (prev && data.some(r => r.id === prev.id)) return prev;
            return data[0] as Restaurant;
          });
        } else {
          setCurrentRestaurantState(null);
        }
      }
    } catch (err) {
      console.warn('Supabase restaurant fetch notice:', err);
    }
  }, [user, isSuperAdmin]);

  useEffect(() => {
    fetchRestaurantsFromSupabase();
  }, [fetchRestaurantsFromSupabase]);

  // Keep currentRestaurant synchronized with visible restaurants
  useEffect(() => {
    if (!user) return;
    if (visibleRestaurants.length > 0) {
      if (!currentRestaurant || !visibleRestaurants.some(r => r.id === currentRestaurant.id)) {
        setCurrentRestaurantState(visibleRestaurants[0]);
      }
    } else if (!isSuperAdmin) {
      setCurrentRestaurantState(null);
    }
  }, [visibleRestaurants, user, isSuperAdmin]);

  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [templateSettings, setTemplateSettings] = useState<RestaurantTemplateSettings>(() => {
    const restId = currentRestaurant?.id || '';
    return getStoredSettings(restId);
  });
  const [templates] = useState<MenuTemplate[]>(ALL_TEMPLATES);
  const [tables, setTables] = useState<RestaurantTable[]>([]);

  // Fetch real categories, items, tables & settings for current restaurant
  const loadRestaurantData = useCallback(async (restaurantId: string) => {
    if (!restaurantId) {
      setCategories([]);
      setItems([]);
      setTables([]);
      return;
    }

    // 1. Initial local load
    setCategories(getStoredCategories(restaurantId));
    setItems(getStoredItems(restaurantId));
    setTemplateSettings(getStoredSettings(restaurantId));

    // 2. Live Supabase fetch
    if (isLiveSupabase) {
      try {
        const [catsRes, itemsRes, tablesRes, settingsRes] = await Promise.all([
          supabase.from('menu_categories').select('*').eq('restaurant_id', restaurantId).order('order_index'),
          supabase.from('menu_items').select('*').eq('restaurant_id', restaurantId).order('order_index'),
          supabase.from('restaurant_tables').select('*').eq('restaurant_id', restaurantId).order('table_number'),
          supabase.from('restaurant_template_settings').select('*').eq('restaurant_id', restaurantId).maybeSingle()
        ]);

        if (!catsRes.error && catsRes.data) {
          setCategories(catsRes.data as MenuCategory[]);
          // Update stored categories for this restaurant
          const otherCats = getAllStoredCategories().filter(c => c.restaurant_id !== restaurantId);
          saveStoredCategories([...otherCats, ...(catsRes.data as MenuCategory[])]);
        }

        if (!itemsRes.error && itemsRes.data) {
          setItems(itemsRes.data as MenuItem[]);
          const otherItems = getAllStoredItems().filter(i => i.restaurant_id !== restaurantId);
          saveStoredItems([...otherItems, ...(itemsRes.data as MenuItem[])]);
        }

        if (!tablesRes.error && tablesRes.data) {
          setTables(tablesRes.data as RestaurantTable[]);
        }

        if (!settingsRes.error && settingsRes.data) {
          setTemplateSettings(settingsRes.data as RestaurantTemplateSettings);
          saveStoredSettings(settingsRes.data as RestaurantTemplateSettings);
        }
      } catch (err) {
        console.warn('Supabase restaurant data load error:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (currentRestaurant?.id) {
      loadRestaurantData(currentRestaurant.id);
    } else {
      setCategories([]);
      setItems([]);
      setTables([]);
    }
  }, [currentRestaurant?.id, loadRestaurantData]);

  const setCurrentRestaurant = (restaurant: Restaurant) => {
    setCurrentRestaurantState(restaurant);
  };

  const updateRestaurantProfile = async (updates: Partial<Restaurant>) => {
    if (!currentRestaurant) return;
    const updated: Restaurant = { ...currentRestaurant, ...updates, updated_at: new Date().toISOString() };
    setCurrentRestaurantState(updated);
    const all = allRestaurants.map(r => r.id === updated.id ? updated : r);
    setAllRestaurants(all);
    saveStoredRestaurants(all);

    if (isLiveSupabase) {
      try {
        const { error } = await supabase.from('restaurants').update(updates).eq('id', updated.id);
        if (error) console.error('Supabase restaurant update error:', error.message);
      } catch (err) {
        console.error('Supabase updateRestaurantProfile notice:', err);
      }
    }
  };

  // Super Admin & Multi-restaurant operations
  const updateRestaurantById = async (restaurantId: string, updates: Partial<Restaurant>) => {
    const all = allRestaurants.map(r => r.id === restaurantId ? { ...r, ...updates, updated_at: new Date().toISOString() } : r);
    setAllRestaurants(all);
    saveStoredRestaurants(all);
    if (currentRestaurant?.id === restaurantId) {
      setCurrentRestaurantState(prev => prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : null);
    }
    if (isLiveSupabase) {
      try {
        const { error } = await supabase.from('restaurants').update(updates).eq('id', restaurantId);
        if (error) console.error('Supabase updateById error:', error.message);
      } catch (err) {
        console.error('Supabase updateRestaurantById notice:', err);
      }
    }
  };

  const toggleRestaurantActive = (restaurantId: string) => {
    const target = allRestaurants.find(r => r.id === restaurantId);
    if (!target) return;
    updateRestaurantById(restaurantId, { is_active: !target.is_active });
  };

  const addRestaurant = (restaurantData: Omit<Restaurant, 'id' | 'created_at' | 'updated_at' | 'owner_id'> & { owner_id?: string }): Restaurant => {
    const newRest: Restaurant = {
      ...restaurantData,
      id: generateId(),
      owner_id: restaurantData.owner_id || user?.id || generateId(),
      email: restaurantData.email || user?.email || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const all = [newRest, ...allRestaurants];
    setAllRestaurants(all);
    saveStoredRestaurants(all);
    setCurrentRestaurantState(newRest);

    // Wipe any stale local items for this new restaurant
    setCategories([]);
    setItems([]);
    setTables([]);

    if (isLiveSupabase) {
      supabase.from('restaurants').insert(newRest).then(({ error }) => {
        if (error) {
          console.error('Supabase addRestaurant error (run supabase_master_setup.sql in Supabase):', error.message);
        }
      });
    }

    return newRest;
  };

  const getRestaurantCategories = (restaurantId: string): MenuCategory[] => {
    return getStoredCategories(restaurantId);
  };

  const getRestaurantItems = (restaurantId: string): MenuItem[] => {
    return getStoredItems(restaurantId);
  };

  const getRestaurantSettings = (restaurantId: string): RestaurantTemplateSettings => {
    return getStoredSettings(restaurantId);
  };

  const addRestaurantCategory = (restaurantId: string, name: string, description?: string, icon?: string): MenuCategory => {
    const newCat: MenuCategory = {
      id: generateId(),
      restaurant_id: restaurantId,
      name,
      description,
      icon: icon || 'Utensils',
      order_index: getStoredCategories(restaurantId).length + 1,
      is_active: true,
      created_at: new Date().toISOString()
    };
    const allCats = getAllStoredCategories();
    const updated = [...allCats, newCat];
    saveStoredCategories(updated);
    if (currentRestaurant?.id === restaurantId) {
      setCategories(prev => [...prev, newCat]);
    }
    if (isLiveSupabase) {
      supabase.from('menu_categories').insert(newCat).then(({ error }) => {
        if (error) console.error('Supabase addRestaurantCategory error:', error.message);
      });
    }
    return newCat;
  };

  const updateRestaurantCategory = (restaurantId: string, categoryId: string, updates: Partial<MenuCategory>) => {
    const allCats = getAllStoredCategories();
    const updated = allCats.map(c => c.id === categoryId ? { ...c, ...updates } : c);
    saveStoredCategories(updated);
    if (currentRestaurant?.id === restaurantId) {
      setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, ...updates } : c));
    }
    if (isLiveSupabase) {
      supabase.from('menu_categories').update(updates).eq('id', categoryId).then(({ error }) => {
        if (error) console.error('Supabase updateRestaurantCategory error:', error.message);
      });
    }
  };

  const deleteRestaurantCategory = (restaurantId: string, categoryId: string) => {
    const allCats = getAllStoredCategories().filter(c => c.id !== categoryId);
    saveStoredCategories(allCats);
    const allItems = getAllStoredItems().filter(i => i.category_id !== categoryId);
    saveStoredItems(allItems);

    if (currentRestaurant?.id === restaurantId) {
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      setItems(prev => prev.filter(i => i.category_id !== categoryId));
    }
    if (isLiveSupabase) {
      supabase.from('menu_categories').delete().eq('id', categoryId).then(({ error }) => {
        if (error) console.error('Supabase deleteRestaurantCategory error:', error.message);
      });
    }
  };

  const addRestaurantItem = (restaurantId: string, itemData: Omit<MenuItem, 'id' | 'restaurant_id' | 'order_index'>): MenuItem => {
    const newItem: MenuItem = {
      ...itemData,
      id: generateId(),
      restaurant_id: restaurantId,
      order_index: getStoredItems(restaurantId).length + 1,
      created_at: new Date().toISOString()
    };
    const allItems = getAllStoredItems();
    saveStoredItems([...allItems, newItem]);
    if (currentRestaurant?.id === restaurantId) {
      setItems(prev => [...prev, newItem]);
    }
    if (isLiveSupabase) {
      supabase.from('menu_items').insert(newItem).then(({ error }) => {
        if (error) console.error('Supabase addRestaurantItem error:', error.message);
      });
    }
    return newItem;
  };

  const updateRestaurantItem = (restaurantId: string, itemId: string, updates: Partial<MenuItem>) => {
    const allItems = getAllStoredItems();
    const updated = allItems.map(i => i.id === itemId ? { ...i, ...updates } : i);
    saveStoredItems(updated);
    if (currentRestaurant?.id === restaurantId) {
      setItems(prev => prev.map(i => i.id === itemId ? { ...i, ...updates } : i));
    }
    if (isLiveSupabase) {
      supabase.from('menu_items').update(updates).eq('id', itemId).then(({ error }) => {
        if (error) console.error('Supabase updateRestaurantItem error:', error.message);
      });
    }
  };

  const deleteRestaurantItem = (restaurantId: string, itemId: string) => {
    const allItems = getAllStoredItems().filter(i => i.id !== itemId);
    saveStoredItems(allItems);
    if (currentRestaurant?.id === restaurantId) {
      setItems(prev => prev.filter(i => i.id !== itemId));
    }
    if (isLiveSupabase) {
      supabase.from('menu_items').delete().eq('id', itemId).then(({ error }) => {
        if (error) console.error('Supabase deleteRestaurantItem error:', error.message);
      });
    }
  };

  const toggleRestaurantItemAvailability = (restaurantId: string, itemId: string) => {
    const allItems = getAllStoredItems();
    const target = allItems.find(i => i.id === itemId);
    if (!target) return;
    updateRestaurantItem(restaurantId, itemId, { is_available: !target.is_available });
  };

  const updateRestaurantTemplateSettings = (restaurantId: string, updates: Partial<RestaurantTemplateSettings>) => {
    const existing = getStoredSettings(restaurantId);
    const updated: RestaurantTemplateSettings = {
      ...existing,
      ...updates,
      restaurant_id: restaurantId
    };
    saveStoredSettings(updated);
    if (currentRestaurant?.id === restaurantId) {
      setTemplateSettings(updated);
    }
    if (isLiveSupabase) {
      supabase.from('restaurant_template_settings').upsert(updated).then(({ error }) => {
        if (error) console.error('Supabase template settings update error:', error.message);
      });
    }
  };

  // Categories CRUD
  const addCategory = (name: string, description?: string, icon?: string): MenuCategory => {
    if (!currentRestaurant) throw new Error('No active restaurant');
    const newCat: MenuCategory = {
      id: generateId(),
      restaurant_id: currentRestaurant.id,
      name,
      description,
      icon: icon || 'Utensils',
      order_index: categories.length + 1,
      is_active: true,
      created_at: new Date().toISOString()
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    const otherCats = getAllStoredCategories().filter(c => c.restaurant_id !== currentRestaurant.id);
    saveStoredCategories([...otherCats, ...updated]);

    if (isLiveSupabase) {
      supabase.from('menu_categories').insert(newCat).then(({ error }) => {
        if (error) console.error('Supabase menu_categories insert error:', error.message);
      });
    }
    return newCat;
  };

  const updateCategory = (id: string, updates: Partial<MenuCategory>) => {
    if (!currentRestaurant) return;
    const updated = categories.map(c => c.id === id ? { ...c, ...updates } : c);
    setCategories(updated);
    const otherCats = getAllStoredCategories().filter(c => c.restaurant_id !== currentRestaurant.id);
    saveStoredCategories([...otherCats, ...updated]);

    if (isLiveSupabase) {
      supabase.from('menu_categories').update(updates).eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase menu_categories update error:', error.message);
      });
    }
  };

  const deleteCategory = (id: string) => {
    if (!currentRestaurant) return;
    const updated = categories.filter(c => c.id !== id);
    const updatedItems = items.filter(i => i.category_id !== id);
    setCategories(updated);
    setItems(updatedItems);

    const otherCats = getAllStoredCategories().filter(c => c.restaurant_id !== currentRestaurant.id);
    saveStoredCategories([...otherCats, ...updated]);
    const otherItems = getAllStoredItems().filter(i => i.restaurant_id !== currentRestaurant.id);
    saveStoredItems([...otherItems, ...updatedItems]);

    if (isLiveSupabase) {
      supabase.from('menu_categories').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase menu_categories delete error:', error.message);
      });
    }
  };

  const reorderCategories = (orderedIds: string[]) => {
    if (!currentRestaurant) return;
    const updated = orderedIds.map((id, index) => {
      const match = categories.find(c => c.id === id);
      return match ? { ...match, order_index: index + 1 } : null;
    }).filter(Boolean) as MenuCategory[];

    setCategories(updated);
    const otherCats = getAllStoredCategories().filter(c => c.restaurant_id !== currentRestaurant.id);
    saveStoredCategories([...otherCats, ...updated]);

    if (isLiveSupabase) {
      updated.forEach(cat => {
        supabase.from('menu_categories').update({ order_index: cat.order_index }).eq('id', cat.id);
      });
    }
  };

  // Items CRUD
  const addItem = (itemData: Omit<MenuItem, 'id' | 'restaurant_id' | 'order_index'>) => {
    if (!currentRestaurant) return;
    const newItem: MenuItem = {
      ...itemData,
      id: generateId(),
      restaurant_id: currentRestaurant.id,
      order_index: items.length + 1,
      created_at: new Date().toISOString()
    };
    const updated = [...items, newItem];
    setItems(updated);
    const otherItems = getAllStoredItems().filter(i => i.restaurant_id !== currentRestaurant.id);
    saveStoredItems([...otherItems, ...updated]);

    if (isLiveSupabase) {
      supabase.from('menu_items').insert(newItem).then(({ error }) => {
        if (error) console.error('Supabase menu_items insert error:', error.message);
      });
    }
  };

  const updateItem = (id: string, updates: Partial<MenuItem>) => {
    if (!currentRestaurant) return;
    const updated = items.map(i => i.id === id ? { ...i, ...updates } : i);
    setItems(updated);
    const otherItems = getAllStoredItems().filter(i => i.restaurant_id !== currentRestaurant.id);
    saveStoredItems([...otherItems, ...updated]);

    if (isLiveSupabase) {
      supabase.from('menu_items').update(updates).eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase menu_items update error:', error.message);
      });
    }
  };

  const deleteItem = (id: string) => {
    if (!currentRestaurant) return;
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    const otherItems = getAllStoredItems().filter(i => i.restaurant_id !== currentRestaurant.id);
    saveStoredItems([...otherItems, ...updated]);

    if (isLiveSupabase) {
      supabase.from('menu_items').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase menu_items delete error:', error.message);
      });
    }
  };

  const toggleItemAvailability = (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    updateItem(id, { is_available: !item.is_available });
  };

  // Template settings
  const updateTemplateSettings = (updates: Partial<RestaurantTemplateSettings>) => {
    if (!currentRestaurant) return;
    const updated: RestaurantTemplateSettings = {
      ...templateSettings,
      ...updates,
      restaurant_id: currentRestaurant.id
    };
    setTemplateSettings(updated);
    saveStoredSettings(updated);

    if (isLiveSupabase) {
      supabase.from('restaurant_template_settings').upsert(updated).then(({ error }) => {
        if (error) console.error('Supabase template settings update error:', error.message);
      });
    }
  };

  const selectTemplate = (templateId: string) => {
    updateTemplateSettings({ template_id: templateId });
  };

  // Image Upload helper
  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Tables CRUD
  const addTable = (tableNumber: string, section?: string, capacity: number = 4) => {
    if (!currentRestaurant) return;
    const newTable: RestaurantTable = {
      id: generateId(),
      restaurant_id: currentRestaurant.id,
      table_number: tableNumber,
      section_name: section || 'Main Dining',
      capacity
    };
    const updated = [...tables, newTable];
    setTables(updated);

    if (isLiveSupabase) {
      supabase.from('restaurant_tables').insert(newTable).then(({ error }) => {
        if (error) console.error('Supabase table insert error:', error.message);
      });
    }
  };

  const deleteTable = (tableId: string) => {
    if (!currentRestaurant) return;
    const updated = tables.filter(t => t.id !== tableId);
    setTables(updated);

    if (isLiveSupabase) {
      supabase.from('restaurant_tables').delete().eq('id', tableId).then(({ error }) => {
        if (error) console.error('Supabase table delete error:', error.message);
      });
    }
  };

  return (
    <RestaurantContext.Provider
      value={{
        restaurants: visibleRestaurants,
        currentRestaurant,
        categories,
        items,
        templateSettings,
        templates,
        tables,
        setCurrentRestaurant,
        updateRestaurantProfile,
        updateRestaurantById,
        toggleRestaurantActive,
        addRestaurant,
        getRestaurantCategories,
        getRestaurantItems,
        getRestaurantSettings,
        addRestaurantCategory,
        updateRestaurantCategory,
        deleteRestaurantCategory,
        addRestaurantItem,
        updateRestaurantItem,
        deleteRestaurantItem,
        toggleRestaurantItemAvailability,
        updateRestaurantTemplateSettings,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        addItem,
        updateItem,
        deleteItem,
        toggleItemAvailability,
        updateTemplateSettings,
        selectTemplate,
        uploadImage,
        addTable,
        deleteTable
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) throw new Error('useRestaurant must be used within a RestaurantProvider');
  return context;
};
