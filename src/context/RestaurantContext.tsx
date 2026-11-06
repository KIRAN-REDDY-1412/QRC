import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Restaurant, 
  MenuCategory, 
  MenuItem, 
  MenuTemplate, 
  RestaurantTemplateSettings,
  RestaurantTable,
  PlanCode
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
  DEMO_RESTAURANTS,
  DEMO_CATEGORIES,
  DEMO_ITEMS,
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
  addCategory: (name: string, description?: string, icon?: string) => void;
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
    if (visibleRestaurants.length > 0) return visibleRestaurants[0];
    if (isSuperAdmin && allRestaurants.length > 0) return allRestaurants[0];
    return null;
  });

  // Keep owner restaurants isolated and auto-provision newly registered owners
  useEffect(() => {
    if (!user) return;

    if (isSuperAdmin) {
      if (!currentRestaurant && allRestaurants.length > 0) {
        setCurrentRestaurantState(allRestaurants[0]);
      }
      return;
    }

    const matching = allRestaurants.filter(r => 
      (r.owner_id && r.owner_id === user.id) || 
      (r.email && user.email && r.email.toLowerCase() === user.email.toLowerCase())
    );

    if (matching.length === 0) {
      // Newly registered owner has no restaurant in storage yet - provision their own!
      const restName = user.full_name?.includes('(') 
        ? user.full_name.split('(')[0].trim() 
        : (user.full_name || 'My Restaurant');
      const cleanSlug = restName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `restaurant-${Date.now()}`;
      
      const newOwnerRest: Restaurant = {
        id: generateId(),
        owner_id: user.id,
        name: restName,
        slug: cleanSlug,
        tagline: 'Authentic Dining & Crafted Menus',
        description: 'Welcome to our digital menu. Explore freshly prepared culinary specials and order right from your table.',
        phone: user.phone || '+91 98765 43210',
        email: user.email,
        address: 'Main Street, City Center',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        currency: 'INR',
        logo_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
        banner_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        opening_time: '11:00 AM',
        closing_time: '11:00 PM',
        whatsapp_number: user.phone ? user.phone.replace(/[^0-9]/g, '') : '919876543210',
        upi_id: `${cleanSlug}@upi`,
        enable_ordering: true,
        enable_upi: true,
        enable_reviews: true,
        is_active: true,
        is_pure_veg: false,
        created_at: new Date().toISOString()
      };

      // Seed starter categories for this new restaurant
      const starterCats: MenuCategory[] = [
        {
          id: `cat-${newOwnerRest.id}-1`,
          restaurant_id: newOwnerRest.id,
          name: "Chef's Specials",
          description: 'Signature dishes crafted fresh daily',
          icon: 'Sparkles',
          order_index: 1,
          is_active: true
        },
        {
          id: `cat-${newOwnerRest.id}-2`,
          restaurant_id: newOwnerRest.id,
          name: 'Main Courses',
          description: 'Aromatic flavors served with classic sides',
          icon: 'Utensils',
          order_index: 2,
          is_active: true
        },
        {
          id: `cat-${newOwnerRest.id}-3`,
          restaurant_id: newOwnerRest.id,
          name: 'Beverages & Coolers',
          description: 'Refreshing juices and chilled infusions',
          icon: 'Coffee',
          order_index: 3,
          is_active: true
        }
      ];

      // Seed starter items
      const starterItems: MenuItem[] = [
        {
          id: `item-${newOwnerRest.id}-1`,
          restaurant_id: newOwnerRest.id,
          category_id: starterCats[0].id,
          name: 'Signature House Platter',
          description: 'Crisp hand-tossed delicacies seasoned with aromatic herbs and house dip.',
          price: 349,
          image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
          is_available: true,
          is_featured: true,
          dietary_type: 'veg',
          spice_level: 1,
          order_index: 1
        },
        {
          id: `item-${newOwnerRest.id}-2`,
          restaurant_id: newOwnerRest.id,
          category_id: starterCats[1].id,
          name: 'Classic Dum Biryani',
          description: 'Slow cooked long-grain rice with rich spices and fresh mint.',
          price: 449,
          image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
          is_available: true,
          is_featured: true,
          dietary_type: 'non_veg',
          spice_level: 2,
          order_index: 1
        },
        {
          id: `item-${newOwnerRest.id}-3`,
          restaurant_id: newOwnerRest.id,
          category_id: starterCats[2].id,
          name: 'Fresh Mint Lime Cooler',
          description: 'Crushed mint, fresh lime juice and sparkling soda.',
          price: 149,
          image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
          is_available: true,
          is_featured: false,
          dietary_type: 'vegan',
          spice_level: 0,
          order_index: 1
        }
      ];

      const allCats = getAllStoredCategories();
      saveStoredCategories([...allCats, ...starterCats]);

      const allItms = getAllStoredItems();
      saveStoredItems([...allItms, ...starterItems]);

      const updated = [newOwnerRest, ...allRestaurants];
      setAllRestaurants(updated);
      saveStoredRestaurants(updated);
      setCurrentRestaurantState(newOwnerRest);

      if (isLiveSupabase) {
        supabase.from('restaurants').upsert({
          id: newOwnerRest.id,
          owner_id: user.id,
          name: newOwnerRest.name,
          slug: newOwnerRest.slug,
          tagline: newOwnerRest.tagline,
          description: newOwnerRest.description,
          phone: newOwnerRest.phone,
          email: newOwnerRest.email,
          city: newOwnerRest.city,
          state: newOwnerRest.state,
          currency: newOwnerRest.currency,
          logo_url: newOwnerRest.logo_url,
          banner_url: newOwnerRest.banner_url,
          opening_time: newOwnerRest.opening_time,
          closing_time: newOwnerRest.closing_time,
          whatsapp_number: newOwnerRest.whatsapp_number,
          upi_id: newOwnerRest.upi_id,
          enable_ordering: newOwnerRest.enable_ordering,
          enable_upi: newOwnerRest.enable_upi,
          enable_reviews: newOwnerRest.enable_reviews,
          is_active: newOwnerRest.is_active
        }).then(({ error }) => {
          if (error) console.warn('Supabase restaurant upsert error:', error.message);
        });
      }
    } else {
      // Ensure currentRestaurant belongs to this owner!
      const currentBelongsToUser = currentRestaurant && matching.some(r => r.id === currentRestaurant.id);
      if (!currentBelongsToUser) {
        setCurrentRestaurantState(matching[0]);
      }
    }
  }, [user?.id, user?.email, user?.role, allRestaurants]);

  // Sync from Supabase on mount / auth
  useEffect(() => {
    if (!isLiveSupabase || !user) return;
    const fetchFromSupabase = async () => {
      try {
        let query = supabase.from('restaurants').select('*');
        if (!isSuperAdmin) {
          query = query.eq('owner_id', user.id);
        }
        const { data, error } = await query;
        if (!error && data) {
          setAllRestaurants(data as Restaurant[]);
          saveStoredRestaurants(data as Restaurant[]);
          if (data.length > 0) {
            setCurrentRestaurantState(data[0] as Restaurant);
          }
        }
      } catch (err) {
        console.warn('Supabase restaurant fetch notice:', err);
      }
    };
    fetchFromSupabase();
  }, [user?.id, isLiveSupabase, isSuperAdmin]);

  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [templateSettings, setTemplateSettings] = useState<RestaurantTemplateSettings>(() => {
    const restId = currentRestaurant?.id || visibleRestaurants[0]?.id || '';
    return getStoredSettings(restId);
  });
  const [templates] = useState<MenuTemplate[]>(ALL_TEMPLATES);
  const [tables, setTables] = useState<RestaurantTable[]>([]);

  // Reload data whenever currentRestaurant changes
  useEffect(() => {
    if (!currentRestaurant) return;
    const currentCats = getStoredCategories(currentRestaurant.id);
    const currentItms = getStoredItems(currentRestaurant.id);
    const currentSets = getStoredSettings(currentRestaurant.id);

    setCategories(currentCats);
    setItems(currentItms);
    setTemplateSettings(currentSets);

    if (isLiveSupabase && currentRestaurant) {
      supabase
        .from('menu_categories')
        .select('*')
        .eq('restaurant_id', currentRestaurant.id)
        .order('order_index')
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setCategories(data as MenuCategory[]);
          }
        });

      supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', currentRestaurant.id)
        .order('order_index')
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setItems(data as MenuItem[]);
          }
        });
    }

    // Initial tables demo
    const storedTables = localStorage.getItem(`smartqr_tables_${currentRestaurant.id}`);
    if (storedTables) {
      setTables(JSON.parse(storedTables));
    } else {
      const initialTables: RestaurantTable[] = [
        { id: 'tbl-1', restaurant_id: currentRestaurant.id, table_number: 'Table 1', section_name: 'Courtyard', capacity: 4 },
        { id: 'tbl-2', restaurant_id: currentRestaurant.id, table_number: 'Table 2', section_name: 'Courtyard', capacity: 2 },
        { id: 'tbl-3', restaurant_id: currentRestaurant.id, table_number: 'Table 3', section_name: 'Heritage Hall', capacity: 6 },
        { id: 'tbl-4', restaurant_id: currentRestaurant.id, table_number: 'VIP Lounge 1', section_name: 'Rooftop Lounge', capacity: 8 },
      ];
      setTables(initialTables);
      localStorage.setItem(`smartqr_tables_${currentRestaurant.id}`, JSON.stringify(initialTables));
    }
  }, [currentRestaurant?.id]);

  const setCurrentRestaurant = (restaurant: Restaurant) => {
    setCurrentRestaurantState(restaurant);
  };

  const updateRestaurantProfile = (updates: Partial<Restaurant>) => {
    if (!currentRestaurant) return;
    const updated: Restaurant = { ...currentRestaurant, ...updates, updated_at: new Date().toISOString() };
    setCurrentRestaurantState(updated);
    const all = allRestaurants.map(r => r.id === updated.id ? updated : r);
    setAllRestaurants(all);
    saveStoredRestaurants(all);

    if (isLiveSupabase) {
      supabase.from('restaurants').update(updates).eq('id', updated.id).then(({ error }) => {
        if (error) console.warn('Supabase update error:', error.message);
      });
    }
  };

  // Super Admin & Multi-restaurant operations
  const updateRestaurantById = (restaurantId: string, updates: Partial<Restaurant>) => {
    const all = allRestaurants.map(r => r.id === restaurantId ? { ...r, ...updates, updated_at: new Date().toISOString() } : r);
    setAllRestaurants(all);
    saveStoredRestaurants(all);
    if (currentRestaurant?.id === restaurantId) {
      setCurrentRestaurantState(prev => prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : null);
    }
    if (isLiveSupabase) {
      supabase.from('restaurants').update(updates).eq('id', restaurantId).then(({ error }) => {
        if (error) console.warn('Supabase updateById error:', error.message);
      });
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
      owner_id: restaurantData.owner_id || user?.id || generateId(),
      email: restaurantData.email || user?.email || '',
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const all = [newRest, ...allRestaurants];
    setAllRestaurants(all);
    saveStoredRestaurants(all);
    setCurrentRestaurantState(newRest);

    if (isLiveSupabase) {
      supabase.from('restaurants').insert(newRest).then(({ error }) => {
        if (error) console.warn('Supabase addRestaurant insert notice:', error.message);
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
    return newCat;
  };

  const updateRestaurantCategory = (restaurantId: string, categoryId: string, updates: Partial<MenuCategory>) => {
    const allCats = getAllStoredCategories();
    const updated = allCats.map(c => c.id === categoryId ? { ...c, ...updates } : c);
    saveStoredCategories(updated);
    if (currentRestaurant?.id === restaurantId) {
      setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, ...updates } : c));
    }
  };

  const deleteRestaurantCategory = (restaurantId: string, categoryId: string) => {
    const allCats = getAllStoredCategories();
    const updated = allCats.filter(c => c.id !== categoryId);
    saveStoredCategories(updated);
    if (currentRestaurant?.id === restaurantId) {
      setCategories(prev => prev.filter(c => c.id !== categoryId));
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
    const updated = [...allItems, newItem];
    saveStoredItems(updated);
    if (currentRestaurant?.id === restaurantId) {
      setItems(prev => [...prev, newItem]);
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
  };

  const deleteRestaurantItem = (restaurantId: string, itemId: string) => {
    const allItems = getAllStoredItems();
    const updated = allItems.filter(i => i.id !== itemId);
    saveStoredItems(updated);
    if (currentRestaurant?.id === restaurantId) {
      setItems(prev => prev.filter(i => i.id !== itemId));
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
  };

  // Categories CRUD
  const addCategory = (name: string, description?: string, icon?: string) => {
    if (!currentRestaurant) return;
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
    const allStored = localStorage.getItem('smartqr_categories');
    const fullList: MenuCategory[] = allStored ? JSON.parse(allStored) : DEMO_CATEGORIES;
    saveStoredCategories([...fullList.filter(c => c.restaurant_id !== currentRestaurant.id), ...updated]);

    if (isLiveSupabase) {
      supabase.from('menu_categories').insert({
        id: newCat.id,
        restaurant_id: newCat.restaurant_id,
        name: newCat.name,
        description: newCat.description,
        icon: newCat.icon,
        order_index: newCat.order_index,
        is_active: newCat.is_active
      }).then(({ error }) => {
        if (error) console.warn('Supabase menu_categories insert notice:', error.message);
      });
    }
  };

  const updateCategory = (id: string, updates: Partial<MenuCategory>) => {
    if (!currentRestaurant) return;
    const updated = categories.map(c => c.id === id ? { ...c, ...updates } : c);
    setCategories(updated);
    const allStored = localStorage.getItem('smartqr_categories');
    const fullList: MenuCategory[] = allStored ? JSON.parse(allStored) : DEMO_CATEGORIES;
    saveStoredCategories([...fullList.filter(c => c.restaurant_id !== currentRestaurant.id), ...updated]);

    if (isLiveSupabase) {
      supabase.from('menu_categories').update(updates).eq('id', id).then(({ error }) => {
        if (error) console.warn('Supabase menu_categories update notice:', error.message);
      });
    }
  };

  const deleteCategory = (id: string) => {
    if (!currentRestaurant) return;
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    const allStored = localStorage.getItem('smartqr_categories');
    const fullList: MenuCategory[] = allStored ? JSON.parse(allStored) : DEMO_CATEGORIES;
    saveStoredCategories([...fullList.filter(c => c.restaurant_id !== currentRestaurant.id), ...updated]);

    if (isLiveSupabase) {
      supabase.from('menu_categories').delete().eq('id', id).then(({ error }) => {
        if (error) console.warn('Supabase menu_categories delete notice:', error.message);
      });
    }
  };

  const reorderCategories = (orderedIds: string[]) => {
    if (!currentRestaurant) return;
    const updated = orderedIds.map((id, index) => {
      const match = categories.find(c => c.id === id);
      return { ...match!, order_index: index + 1 };
    }).filter(Boolean) as MenuCategory[];

    setCategories(updated);
    const allStored = localStorage.getItem('smartqr_categories');
    const fullList: MenuCategory[] = allStored ? JSON.parse(allStored) : DEMO_CATEGORIES;
    saveStoredCategories([...fullList.filter(c => c.restaurant_id !== currentRestaurant.id), ...updated]);
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
    const allStored = localStorage.getItem('smartqr_items');
    const fullList: MenuItem[] = allStored ? JSON.parse(allStored) : DEMO_ITEMS;
    saveStoredItems([...fullList.filter(i => i.restaurant_id !== currentRestaurant.id), ...updated]);

    if (isLiveSupabase) {
      supabase.from('menu_items').insert({
        id: newItem.id,
        restaurant_id: newItem.restaurant_id,
        category_id: newItem.category_id,
        name: newItem.name,
        description: newItem.description,
        caption: newItem.caption,
        price: newItem.price,
        discount_price: newItem.discount_price,
        image_url: newItem.image_url,
        is_available: newItem.is_available,
        is_featured: newItem.is_featured,
        dietary_type: newItem.dietary_type,
        spice_level: newItem.spice_level,
        order_index: newItem.order_index
      }).then(({ error }) => {
        if (error) console.warn('Supabase menu_items insert notice:', error.message);
      });
    }
  };

  const updateItem = (id: string, updates: Partial<MenuItem>) => {
    if (!currentRestaurant) return;
    const updated = items.map(i => i.id === id ? { ...i, ...updates } : i);
    setItems(updated);
    const allStored = localStorage.getItem('smartqr_items');
    const fullList: MenuItem[] = allStored ? JSON.parse(allStored) : DEMO_ITEMS;
    saveStoredItems([...fullList.filter(i => i.restaurant_id !== currentRestaurant.id), ...updated]);

    if (isLiveSupabase) {
      supabase.from('menu_items').update(updates).eq('id', id).then(({ error }) => {
        if (error) console.warn('Supabase menu_items update notice:', error.message);
      });
    }
  };

  const deleteItem = (id: string) => {
    if (!currentRestaurant) return;
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    const allStored = localStorage.getItem('smartqr_items');
    const fullList: MenuItem[] = allStored ? JSON.parse(allStored) : DEMO_ITEMS;
    saveStoredItems([...fullList.filter(i => i.restaurant_id !== currentRestaurant.id), ...updated]);

    if (isLiveSupabase) {
      supabase.from('menu_items').delete().eq('id', id).then(({ error }) => {
        if (error) console.warn('Supabase menu_items delete notice:', error.message);
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

  // Tables
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
    localStorage.setItem(`smartqr_tables_${currentRestaurant.id}`, JSON.stringify(updated));

    if (isLiveSupabase) {
      supabase.from('restaurant_tables').insert(newTable).then(({ error }) => {
        if (error) console.warn('Supabase table insert notice:', error.message);
      });
    }
  };

  const deleteTable = (tableId: string) => {
    if (!currentRestaurant) return;
    const updated = tables.filter(t => t.id !== tableId);
    setTables(updated);
    localStorage.setItem(`smartqr_tables_${currentRestaurant.id}`, JSON.stringify(updated));

    if (isLiveSupabase) {
      supabase.from('restaurant_tables').delete().eq('id', tableId).then(({ error }) => {
        if (error) console.warn('Supabase table delete notice:', error.message);
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
