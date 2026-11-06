import React, { createContext, useContext, useState, useEffect } from 'react';
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
  DEMO_ITEMS
} from '@/lib/supabase';

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
  addRestaurant: (restaurantData: Omit<Restaurant, 'id' | 'created_at' | 'updated_at'>) => Restaurant;
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
  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => getStoredRestaurants());
  const [currentRestaurant, setCurrentRestaurantState] = useState<Restaurant | null>(() => {
    const list = getStoredRestaurants();
    return list.length > 0 ? list[0] : DEMO_RESTAURANTS[0];
  });

  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [templateSettings, setTemplateSettings] = useState<RestaurantTemplateSettings>(() => {
    const restId = currentRestaurant?.id || DEMO_RESTAURANTS[0].id;
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
    const all = restaurants.map(r => r.id === updated.id ? updated : r);
    setRestaurants(all);
    saveStoredRestaurants(all);
  };

  // Super Admin & Multi-restaurant operations
  const updateRestaurantById = (restaurantId: string, updates: Partial<Restaurant>) => {
    const all = restaurants.map(r => r.id === restaurantId ? { ...r, ...updates, updated_at: new Date().toISOString() } : r);
    setRestaurants(all);
    saveStoredRestaurants(all);
    if (currentRestaurant?.id === restaurantId) {
      setCurrentRestaurantState(prev => prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : null);
    }
  };

  const toggleRestaurantActive = (restaurantId: string) => {
    const target = restaurants.find(r => r.id === restaurantId);
    if (!target) return;
    updateRestaurantById(restaurantId, { is_active: !target.is_active });
  };

  const addRestaurant = (restaurantData: Omit<Restaurant, 'id' | 'created_at' | 'updated_at'>): Restaurant => {
    const newRest: Restaurant = {
      ...restaurantData,
      id: `rest-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const all = [newRest, ...restaurants];
    setRestaurants(all);
    saveStoredRestaurants(all);
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
      id: `cat-${Date.now()}`,
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
      id: `item-${Date.now()}`,
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
      id: `cat-${Date.now()}`,
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
    // Persist all categories across restaurants
    const allStored = localStorage.getItem('smartqr_categories');
    const fullList: MenuCategory[] = allStored ? JSON.parse(allStored) : DEMO_CATEGORIES;
    saveStoredCategories([...fullList.filter(c => c.restaurant_id !== currentRestaurant.id), ...updated]);
  };

  const updateCategory = (id: string, updates: Partial<MenuCategory>) => {
    if (!currentRestaurant) return;
    const updated = categories.map(c => c.id === id ? { ...c, ...updates } : c);
    setCategories(updated);
    const allStored = localStorage.getItem('smartqr_categories');
    const fullList: MenuCategory[] = allStored ? JSON.parse(allStored) : DEMO_CATEGORIES;
    saveStoredCategories([...fullList.filter(c => c.restaurant_id !== currentRestaurant.id), ...updated]);
  };

  const deleteCategory = (id: string) => {
    if (!currentRestaurant) return;
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    const allStored = localStorage.getItem('smartqr_categories');
    const fullList: MenuCategory[] = allStored ? JSON.parse(allStored) : DEMO_CATEGORIES;
    saveStoredCategories([...fullList.filter(c => c.restaurant_id !== currentRestaurant.id), ...updated]);
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
      id: `item-${Date.now()}`,
      restaurant_id: currentRestaurant.id,
      order_index: items.length + 1,
      created_at: new Date().toISOString()
    };
    const updated = [...items, newItem];
    setItems(updated);
    const allStored = localStorage.getItem('smartqr_items');
    const fullList: MenuItem[] = allStored ? JSON.parse(allStored) : DEMO_ITEMS;
    saveStoredItems([...fullList.filter(i => i.restaurant_id !== currentRestaurant.id), ...updated]);
  };

  const updateItem = (id: string, updates: Partial<MenuItem>) => {
    if (!currentRestaurant) return;
    const updated = items.map(i => i.id === id ? { ...i, ...updates } : i);
    setItems(updated);
    const allStored = localStorage.getItem('smartqr_items');
    const fullList: MenuItem[] = allStored ? JSON.parse(allStored) : DEMO_ITEMS;
    saveStoredItems([...fullList.filter(i => i.restaurant_id !== currentRestaurant.id), ...updated]);
  };

  const deleteItem = (id: string) => {
    if (!currentRestaurant) return;
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    const allStored = localStorage.getItem('smartqr_items');
    const fullList: MenuItem[] = allStored ? JSON.parse(allStored) : DEMO_ITEMS;
    saveStoredItems([...fullList.filter(i => i.restaurant_id !== currentRestaurant.id), ...updated]);
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
      id: `tbl-${Date.now()}`,
      restaurant_id: currentRestaurant.id,
      table_number: tableNumber,
      section_name: section || 'Main Dining',
      capacity
    };
    const updated = [...tables, newTable];
    setTables(updated);
    localStorage.setItem(`smartqr_tables_${currentRestaurant.id}`, JSON.stringify(updated));
  };

  const deleteTable = (tableId: string) => {
    if (!currentRestaurant) return;
    const updated = tables.filter(t => t.id !== tableId);
    setTables(updated);
    localStorage.setItem(`smartqr_tables_${currentRestaurant.id}`, JSON.stringify(updated));
  };

  return (
    <RestaurantContext.Provider
      value={{
        restaurants,
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
