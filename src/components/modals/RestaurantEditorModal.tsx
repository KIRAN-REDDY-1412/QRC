import React, { useState, useEffect } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { Restaurant, MenuCategory, MenuItem, RestaurantTemplateSettings, DietaryType, OpeningAnimationStyle } from '@/types';
import { DietaryBadge } from '@/components/common/DietaryBadge';
import { SpiceLevel } from '@/components/common/SpiceLevel';
import { TemplateRenderer } from '@/templates/TemplateRenderer';
import { OpeningExperienceOverlay } from '@/components/menu/OpeningExperienceOverlay';
import { 
  X, 
  Store, 
  Utensils, 
  Palette, 
  Eye, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  Check, 
  Power, 
  PowerOff, 
  AlertCircle, 
  Search, 
  Sparkles, 
  Image as ImageIcon,
  Flame,
  CheckCircle2,
  FolderTree,
  Smartphone,
  Tablet,
  Monitor,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  FileSpreadsheet,
  Crown,
  Play
} from 'lucide-react';
import { BulkMenuManagerModal } from '@/components/modals/BulkMenuManagerModal';

interface RestaurantEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
  initialTab?: 'profile' | 'items' | 'categories' | 'design' | 'preview';
}

export const RestaurantEditorModal: React.FC<RestaurantEditorModalProps> = ({
  isOpen,
  onClose,
  restaurantId,
  initialTab = 'items'
}) => {
  const { 
    restaurants, 
    templates,
    updateRestaurantById,
    toggleRestaurantActive,
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
    updateRestaurantTemplateSettings
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'profile' | 'items' | 'categories' | 'design' | 'preview'>(initialTab);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  // Restaurant details state
  const currentRest = restaurants.find(r => r.id === restaurantId);
  const [profileForm, setProfileForm] = useState<Partial<Restaurant>>({});

  // Local categories & items
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<RestaurantTemplateSettings>({
    restaurant_id: restaurantId,
    template_id: 'tpl-1',
    accent_color: '#f59e0b',
    font_family: 'Plus Jakarta Sans',
    card_style: 'luxury',
    show_photos: true,
    show_dietary_badges: true,
    show_spice_level: true,
    show_prices: true
  });

  // Items filter & search
  const [itemSearch, setItemSearch] = useState('');
  const [itemCategoryFilter, setItemCategoryFilter] = useState('all');

  // Item Modal state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemForm, setItemForm] = useState<{
    name: string;
    category_id: string;
    description: string;
    price: number;
    discount_price?: number;
    dietary_type: DietaryType;
    spice_level: number;
    calories?: number;
    preparation_time: string;
    image_url: string;
    is_featured: boolean;
    is_available: boolean;
  }>({
    name: '',
    category_id: '',
    description: '',
    price: 250,
    discount_price: undefined,
    dietary_type: 'veg',
    spice_level: 0,
    calories: undefined,
    preparation_time: '15 mins',
    image_url: '',
    is_featured: false,
    is_available: true
  });

  // Category Modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');

  // Design state
  const [designSettings, setDesignSettings] = useState<RestaurantTemplateSettings>(settings);

  // Preview state
  const [previewTemplateId, setPreviewTemplateId] = useState<string>('tpl-1');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [previewCategory, setPreviewCategory] = useState('all');
  const [previewSearch, setPreviewSearch] = useState('');
  const [previewDiet, setPreviewDiet] = useState<DietaryType | 'all'>('all');
  const [isPreviewingOpening, setIsPreviewingOpening] = useState<boolean>(false);

  // Load restaurant data
  const reloadData = () => {
    if (!restaurantId) return;
    const r = restaurants.find(item => item.id === restaurantId);
    if (r) {
      setProfileForm(r);
    }
    const cats = getRestaurantCategories(restaurantId);
    const itms = getRestaurantItems(restaurantId);
    const sets = getRestaurantSettings(restaurantId);
    setCategories(cats);
    setItems(itms);
    setSettings(sets);
    setDesignSettings(sets);
    setPreviewTemplateId(sets.template_id || 'tpl-1');
  };

  useEffect(() => {
    if (isOpen) {
      reloadData();
      setActiveTab(initialTab);
    }
  }, [isOpen, restaurantId]);

  if (!isOpen || !currentRest) return null;

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Profile Save
  const handleSaveProfile = () => {
    updateRestaurantById(restaurantId, profileForm);
    showToast('Restaurant details saved successfully!');
    reloadData();
  };

  // Toggle Active
  const handleToggleActive = () => {
    toggleRestaurantActive(restaurantId);
    const nextState = !currentRest.is_active;
    showToast(`Restaurant is now ${nextState ? 'ACTIVE' : 'DEACTIVATED'}`);
    setProfileForm(prev => ({ ...prev, is_active: nextState }));
  };

  // Item Handlers
  const handleOpenAddItem = () => {
    setEditingItem(null);
    setItemForm({
      name: '',
      category_id: categories[0]?.id || '',
      description: '',
      price: 250,
      discount_price: undefined,
      dietary_type: 'veg',
      spice_level: 0,
      calories: undefined,
      preparation_time: '15 mins',
      image_url: '',
      is_featured: false,
      is_available: true
    });
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      category_id: item.category_id,
      description: item.description || '',
      price: item.price,
      discount_price: item.discount_price,
      dietary_type: item.dietary_type,
      spice_level: item.spice_level,
      calories: item.calories,
      preparation_time: item.preparation_time || '15 mins',
      image_url: item.image_url || '',
      is_featured: item.is_featured,
      is_available: item.is_available
    });
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.name.trim()) return;

    if (editingItem) {
      updateRestaurantItem(restaurantId, editingItem.id, itemForm);
      showToast(`Updated "${itemForm.name}"`);
    } else {
      addRestaurantItem(restaurantId, itemForm);
      showToast(`Added "${itemForm.name}" to menu`);
    }

    setIsItemModalOpen(false);
    reloadData();
  };

  const handleDeleteItem = (item: MenuItem) => {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      deleteRestaurantItem(restaurantId, item.id);
      showToast(`Deleted "${item.name}"`);
      reloadData();
    }
  };

  const handleToggleItemStock = (item: MenuItem) => {
    toggleRestaurantItemAvailability(restaurantId, item.id);
    reloadData();
  };

  // Category Handlers
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryDesc('');
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: MenuCategory) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setCategoryDesc(cat.description || '');
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    if (editingCategory) {
      updateRestaurantCategory(restaurantId, editingCategory.id, {
        name: categoryName,
        description: categoryDesc
      });
      showToast(`Updated category "${categoryName}"`);
    } else {
      addRestaurantCategory(restaurantId, categoryName, categoryDesc);
      showToast(`Created category "${categoryName}"`);
    }

    setIsCategoryModalOpen(false);
    reloadData();
  };

  const handleDeleteCategory = (cat: MenuCategory) => {
    if (confirm(`Delete category "${cat.name}"? Food items in this category won't be deleted but will be unassigned.`)) {
      deleteRestaurantCategory(restaurantId, cat.id);
      showToast(`Deleted category "${cat.name}"`);
      reloadData();
    }
  };

  // Design Save
  const handleSaveDesign = () => {
    updateRestaurantTemplateSettings(restaurantId, designSettings);
    setSettings(designSettings);
    showToast('Menu design & template settings updated!');
    reloadData();
  };

  // Filtered items
  const filteredItems = items.filter(i => {
    const matchesCat = itemCategoryFilter === 'all' || i.category_id === itemCategoryFilter;
    const matchesSearch = i.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
      (i.description && i.description.toLowerCase().includes(itemSearch.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const previewTemplateObj = templates.find(t => t.id === previewTemplateId) || templates[0];

  const presetColors = [
    { name: 'Saffron Gold', hex: '#f59e0b' },
    { name: 'Emerald Jade', hex: '#10b981' },
    { name: 'Royal Crimson', hex: '#e11d48' },
    { name: 'Cobalt Sapphire', hex: '#2563eb' },
    { name: 'Sunset Terracotta', hex: '#ea580c' },
    { name: 'Imperial Violet', hex: '#8b5cf6' },
    { name: 'Obsidian Slate', hex: '#64748b' },
    { name: 'Blush Rose', hex: '#f43f5e' }
  ];

  const fontOptions = [
    'Plus Jakarta Sans',
    'Playfair Display',
    'Cinzel',
    'Outfit',
    'Inter',
    'Montserrat',
    'Cormorant Garamond'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="relative bg-slate-950 border border-slate-800 rounded-3xl max-w-6xl w-full h-[94vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:px-6 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {currentRest.logo_url ? (
              <img src={currentRest.logo_url} alt="" className="w-12 h-12 rounded-2xl object-cover border border-slate-800" />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                <Store className="w-6 h-6" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">{currentRest.name}</h2>
                {currentRest.is_active ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active Menu
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                    <PowerOff className="w-3 h-3" />
                    Deactivated
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Slug: <span className="font-mono text-slate-300">/menu/{currentRest.slug}</span> • {currentRest.city}, {currentRest.state}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Activate/Deactivate Toggle */}
            <button
              onClick={handleToggleActive}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                currentRest.is_active
                  ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}
            >
              {currentRest.is_active ? (
                <>
                  <PowerOff className="w-3.5 h-3.5" />
                  <span>Deactivate Menu</span>
                </>
              ) : (
                <>
                  <Power className="w-3.5 h-3.5" />
                  <span>Activate Menu</span>
                </>
              )}
            </button>

            {/* Open Public Menu */}
            <a
              href={`/menu/${currentRest.slug}?preview=true`}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-slate-300 hover:text-white rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
              title="Open public menu in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toast alert banner */}
        {saveToast && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 px-6 py-2 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{saveToast}</span>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'items', label: `Food Items (${items.length})`, icon: Utensils },
            { id: 'categories', label: `Categories (${categories.length})`, icon: FolderTree },
            { id: 'design', label: 'Design & Styling', icon: Palette },
            { id: 'preview', label: 'Check Template (Live Preview)', icon: Eye },
            { id: 'profile', label: 'Restaurant Profile & Status', icon: Store }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 text-xs font-bold whitespace-nowrap border-b-2 flex items-center gap-2 transition ${
                  isActive
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar bg-slate-950">
          {/* TAB 1: FOOD ITEMS */}
          {activeTab === 'items' && (
            <div className="space-y-4">
              {/* Actions & Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 flex-1">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search food items..."
                      value={itemSearch}
                      onChange={(e) => setItemSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <select
                    value={itemCategoryFilter}
                    onChange={(e) => setItemCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 bg-slate-950 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="all">All Categories ({items.length})</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({items.filter(i => i.category_id === c.id).length})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBulkOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Bulk CSV / Excel</span>
                    <Crown className="w-3 h-3 text-amber-400" />
                  </button>

                  <button
                    onClick={handleOpenAddItem}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Food Item</span>
                  </button>
                </div>
              </div>

              {/* Items List */}
              {filteredItems.length === 0 ? (
                <div className="p-12 text-center bg-slate-900/30 rounded-3xl border border-slate-800/80">
                  <Utensils className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-white font-bold text-sm">No food items found</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    {items.length === 0
                      ? 'This restaurant does not have any dishes in its digital menu yet.'
                      : 'No dishes match your filter criteria.'}
                  </p>
                  <button
                    onClick={handleOpenAddItem}
                    className="mt-4 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create First Dish</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredItems.map(item => {
                    const cat = categories.find(c => c.id === item.category_id);
                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl bg-slate-900/80 border transition-all flex items-start gap-3 justify-between ${
                          item.is_available 
                            ? 'border-slate-800 hover:border-slate-700' 
                            : 'border-rose-900/40 bg-rose-950/10 opacity-75'
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt=""
                              className="w-16 h-16 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600 flex-shrink-0">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <DietaryBadge type={item.dietary_type} />
                              <h4 className="font-bold text-sm text-white truncate">{item.name}</h4>
                            </div>

                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                              {item.description || 'No description provided'}
                            </p>

                            <div className="flex items-center gap-3 mt-1.5 text-xs">
                              <span className="font-bold text-amber-400">
                                ₹{item.price}
                                {item.discount_price && (
                                  <span className="ml-1 text-[10px] text-slate-500 line-through">
                                    ₹{item.discount_price}
                                  </span>
                                )}
                              </span>

                              {cat && (
                                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                                  {cat.name}
                                </span>
                              )}

                              {item.spice_level > 0 && (
                                <div className="flex items-center">
                                  <SpiceLevel level={item.spice_level} />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleToggleItemStock(item)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition ${
                              item.is_available
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30'
                            }`}
                          >
                            {item.is_available ? 'In Stock' : 'Out of Stock'}
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenEditItem(item)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                              title="Edit Item"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400 transition"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Menu Categories</h3>
                  <p className="text-xs text-slate-400">Organize dishes into sections on the customer QR menu.</p>
                </div>

                <button
                  onClick={handleOpenAddCategory}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="space-y-2">
                {categories.map((cat, idx) => {
                  const itemCount = items.filter(i => i.category_id === cat.id).length;
                  return (
                    <div
                      key={cat.id}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 font-mono text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-white">{cat.name}</h4>
                          <p className="text-xs text-slate-400">{cat.description || 'No section description'}</p>
                          <span className="text-[10px] text-amber-400 font-semibold mt-1 inline-block">
                            {itemCount} dishes assigned
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditCategory(cat)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DESIGN & STYLING ("degine") */}
          {activeTab === 'design' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Visual Design & Theme Configuration</h3>
                  <p className="text-xs text-slate-400">
                    Set the active template theme, brand accents, typography, and display toggles for this restaurant.
                  </p>
                </div>

                <button
                  onClick={handleSaveDesign}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Design Settings</span>
                </button>
              </div>

              {/* Template Picker */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Select Active Dining Template (15 Available)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {templates.map(tpl => {
                    const isSelected = designSettings.template_id === tpl.id;
                    return (
                      <div
                        key={tpl.id}
                        onClick={() => setDesignSettings(prev => ({ ...prev, template_id: tpl.id }))}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <img
                          src={tpl.thumbnail_url}
                          alt=""
                          className="w-full h-24 rounded-xl object-cover mb-2 border border-slate-800"
                        />
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-white">{tpl.name}</h4>
                          <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            {tpl.tier}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{tpl.vibe}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Accent Color Palette */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Brand Accent Color
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {presetColors.map(c => (
                    <button
                      key={c.hex}
                      onClick={() => setDesignSettings(prev => ({ ...prev, accent_color: c.hex }))}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                        designSettings.accent_color === c.hex
                          ? 'border-white bg-slate-800 text-white'
                          : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                  <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400">Custom:</span>
                    <input
                      type="color"
                      value={designSettings.accent_color || '#f59e0b'}
                      onChange={(e) => setDesignSettings(prev => ({ ...prev, accent_color: e.target.value }))}
                      className="w-6 h-6 rounded bg-transparent cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Font Family
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {fontOptions.map(font => (
                    <button
                      key={font}
                      onClick={() => setDesignSettings(prev => ({ ...prev, font_family: font }))}
                      className={`p-2.5 rounded-xl text-xs text-left border transition ${
                        designSettings.font_family === font
                          ? 'border-amber-400 bg-amber-500/10 text-white font-bold'
                          : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Toggles */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Display Options
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'show_photos', label: 'Show Food Photos', desc: 'Display dish thumbnails in menu' },
                    { key: 'show_dietary_badges', label: 'Show Veg / Non-Veg Badges', desc: 'Display standard Indian dietary dot indicators' },
                    { key: 'show_spice_level', label: 'Show Spice Level Flames', desc: 'Display heat rating indicators (1-3)' },
                    { key: 'show_prices', label: 'Show Dish Pricing', desc: 'Display price tags on dishes' }
                  ].map(opt => {
                    const checked = (designSettings as any)[opt.key] ?? true;
                    return (
                      <div
                        key={opt.key}
                        onClick={() => setDesignSettings(prev => ({ ...prev, [opt.key]: !checked }))}
                        className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700"
                      >
                        <div>
                          <h4 className="text-xs font-bold text-white">{opt.label}</h4>
                          <p className="text-[10px] text-slate-400">{opt.desc}</p>
                        </div>
                        <div className={`w-10 h-6 rounded-full p-1 transition ${checked ? 'bg-amber-500' : 'bg-slate-800'}`}>
                          <div className={`w-4 h-4 rounded-full bg-white transition transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instant QR Scan Opening Animation Experience Settings */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Instant QR Scan Opening Animation</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Configure the intro animation shown when customers scan this restaurant's QR code.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={designSettings.opening_animation_enabled ?? true}
                      onChange={(e) => setDesignSettings(prev => ({ ...prev, opening_animation_enabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {designSettings.opening_animation_enabled !== false && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 block">Animation Style</label>
                      <select
                        value={designSettings.opening_animation_style || 'gold_glow'}
                        onChange={(e) => setDesignSettings(prev => ({ ...prev, opening_animation_style: e.target.value as OpeningAnimationStyle }))}
                        className="w-full px-3 py-2 bg-slate-950 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400"
                      >
                        <option value="minimal">Minimal Zoom (Basic)</option>
                        <option value="gold_glow">Gold Radiant Aura (Premium)</option>
                        <option value="luxury_particles">Luxury Shimmer Particles (Premium)</option>
                        <option value="cinematic">Cinematic Anamorphic Flare (Premium)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] font-bold text-slate-300">
                        <span>Intro Duration</span>
                        <span className="font-mono text-amber-400">{designSettings.opening_animation_duration || 1.8}s</span>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="2.5"
                        step="0.1"
                        value={designSettings.opening_animation_duration || 1.8}
                        onChange={(e) => setDesignSettings(prev => ({ ...prev, opening_animation_duration: parseFloat(e.target.value) }))}
                        className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-300 block">Custom Tagline</label>
                      <input
                        type="text"
                        value={designSettings.opening_animation_tagline || ''}
                        onChange={(e) => setDesignSettings(prev => ({ ...prev, opening_animation_tagline: e.target.value }))}
                        placeholder="e.g. Experience Royal Awadhi Gastronomy"
                        className="w-full px-3 py-2 bg-slate-950 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CHECK TEMPLATE (LIVE PREVIEW) */}
          {activeTab === 'preview' && (
            <div className="space-y-4 h-full flex flex-col">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase text-slate-400 font-bold">Template:</span>
                  <select
                    value={previewTemplateId}
                    onChange={(e) => setPreviewTemplateId(e.target.value)}
                    className="px-3 py-1.5 bg-slate-950 text-white text-xs font-semibold rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.tier})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  {/* Device Switcher */}
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1">
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
                        previewDevice === 'mobile' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Phone</span>
                    </button>
                    <button
                      onClick={() => setPreviewDevice('tablet')}
                      className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
                        previewDevice === 'tablet' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                      }`}
                    >
                      <Tablet className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Tablet</span>
                    </button>
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`p-1.5 rounded-lg text-xs flex items-center gap-1 ${
                        previewDevice === 'desktop' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Full</span>
                    </button>
                  </div>

                  {/* Play Intro Experience Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsPreviewingOpening(false);
                      setTimeout(() => setIsPreviewingOpening(true), 50);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition flex items-center gap-1.5"
                    title="Preview Instant QR Scan Opening Experience"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Play Intro</span>
                  </button>

                  {/* Apply Template Directly */}
                  <button
                    onClick={() => {
                      updateRestaurantTemplateSettings(restaurantId, { template_id: previewTemplateId });
                      showToast(`Applied ${previewTemplateObj.name} as active template!`);
                      reloadData();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Set As Active Template</span>
                  </button>
                </div>
              </div>

              {/* Viewport */}
              <div className="flex-1 bg-slate-900/40 p-2 sm:p-4 rounded-3xl border border-slate-800/80 flex items-center justify-center overflow-hidden min-h-[480px]">
                {previewDevice === 'mobile' ? (
                  <div className="w-full max-w-[390px] h-[640px] bg-slate-950 rounded-[40px] border-4 border-slate-800 shadow-2xl overflow-y-auto relative no-scrollbar flex flex-col ring-1 ring-slate-700/50">
                    <div className="sticky top-0 z-50 w-full bg-slate-950 py-1.5 flex justify-center">
                      <div className="w-20 h-3.5 bg-slate-800 rounded-full" />
                    </div>
                    <TemplateRenderer
                      templateCode={previewTemplateObj.code}
                      restaurant={currentRest}
                      categories={categories}
                      items={items}
                      settings={{ ...settings, template_id: previewTemplateId }}
                      selectedCategory={previewCategory}
                      onSelectCategory={setPreviewCategory}
                      searchQuery={previewSearch}
                      dietaryFilter={previewDiet}
                    />

                    {/* Opening Intro Animation Preview Layer */}
                    {isPreviewingOpening && (
                      <OpeningExperienceOverlay
                        restaurant={currentRest}
                        animationStyle={designSettings.opening_animation_style || 'gold_glow'}
                        duration={designSettings.opening_animation_duration || 1.8}
                        tagline={designSettings.opening_animation_tagline}
                        showSkipButton={designSettings.opening_animation_skip_button ?? true}
                        soundEnabled={designSettings.opening_animation_sound ?? false}
                        tableLabel="Table 4"
                        isPreview={true}
                        onComplete={() => setIsPreviewingOpening(false)}
                      />
                    )}
                  </div>
                ) : (
                  <div className="w-full h-[640px] bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-y-auto relative no-scrollbar">
                    <TemplateRenderer
                      templateCode={previewTemplateObj.code}
                      restaurant={currentRest}
                      categories={categories}
                      items={items}
                      settings={{ ...settings, template_id: previewTemplateId }}
                      selectedCategory={previewCategory}
                      onSelectCategory={setPreviewCategory}
                      searchQuery={previewSearch}
                      dietaryFilter={previewDiet}
                    />

                    {/* Opening Intro Animation Preview Layer */}
                    {isPreviewingOpening && (
                      <OpeningExperienceOverlay
                        restaurant={currentRest}
                        animationStyle={designSettings.opening_animation_style || 'gold_glow'}
                        duration={designSettings.opening_animation_duration || 1.8}
                        tagline={designSettings.opening_animation_tagline}
                        showSkipButton={designSettings.opening_animation_skip_button ?? true}
                        soundEnabled={designSettings.opening_animation_sound ?? false}
                        tableLabel="Table 4"
                        isPreview={true}
                        onComplete={() => setIsPreviewingOpening(false)}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: RESTAURANT PROFILE & STATUS */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Restaurant Profile & Activation Status</h3>
                  <p className="text-xs text-slate-400">
                    Manage core restaurant identity, location, contact, and menu activation status.
                  </p>
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Restaurant Details</span>
                </button>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                profileForm.is_active
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                <div className="flex items-center gap-3">
                  {profileForm.is_active ? (
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Power className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
                      <PowerOff className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-sm">
                      {profileForm.is_active ? 'Menu is Live & Active' : 'Menu is Currently Deactivated'}
                    </h4>
                    <p className="text-xs opacity-80">
                      {profileForm.is_active
                        ? 'Customers can scan QR codes and browse all active dishes.'
                        : 'Customer QR scans will show a "Menu Temporarily Offline" notice.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleActive}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    profileForm.is_active
                      ? 'bg-rose-500 hover:bg-rose-600 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {profileForm.is_active ? 'Deactivate Now' : 'Activate Now'}
                </button>
              </div>

              {/* Profile Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Restaurant Name</label>
                  <input
                    type="text"
                    value={profileForm.name || ''}
                    onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={profileForm.slug || ''}
                    onChange={(e) => setProfileForm(p => ({ ...p, slug: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 block mb-1">Tagline</label>
                  <input
                    type="text"
                    value={profileForm.tagline || ''}
                    onChange={(e) => setProfileForm(p => ({ ...p, tagline: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">City</label>
                  <input
                    type="text"
                    value={profileForm.city || ''}
                    onChange={(e) => setProfileForm(p => ({ ...p, city: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">State</label>
                  <input
                    type="text"
                    value={profileForm.state || ''}
                    onChange={(e) => setProfileForm(p => ({ ...p, state: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profileForm.phone || ''}
                    onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">FSSAI License</label>
                  <input
                    type="text"
                    value={profileForm.fssai_license || ''}
                    onChange={(e) => setProfileForm(p => ({ ...p, fssai_license: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 block mb-1">Logo URL</label>
                  <input
                    type="text"
                    value={profileForm.logo_url || ''}
                    onChange={(e) => setProfileForm(p => ({ ...p, logo_url: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 block mb-1">Banner Image URL</label>
                  <input
                    type="text"
                    value={profileForm.banner_url || ''}
                    onChange={(e) => setProfileForm(p => ({ ...p, banner_url: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Premium Plus Features Configuration */}
                <div className="sm:col-span-2 pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Premium Plus Dining Features
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">WhatsApp Order Number</label>
                      <input
                        type="text"
                        placeholder="e.g. +91 98200 12345"
                        value={profileForm.whatsapp_number || ''}
                        onChange={(e) => setProfileForm(p => ({ ...p, whatsapp_number: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">UPI ID for Tabletop Bill</label>
                      <input
                        type="text"
                        placeholder="e.g. restaurant@okaxis"
                        value={profileForm.upi_id || ''}
                        onChange={(e) => setProfileForm(p => ({ ...p, upi_id: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Google Maps Review URL</label>
                      <input
                        type="text"
                        placeholder="e.g. https://g.page/r/.../review"
                        value={profileForm.google_review_url || ''}
                        onChange={(e) => setProfileForm(p => ({ ...p, google_review_url: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(profileForm.is_pure_veg)}
                      onChange={(e) => setProfileForm(p => ({ ...p, is_pure_veg: e.target.checked }))}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-bold text-emerald-400">Pure Vegetarian Establishment Only</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SUB-MODAL: ADD / EDIT FOOD ITEM */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl no-scrollbar">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-black text-base text-white">
                {editingItem ? 'Edit Food Item' : 'Add New Food Item'}
              </h3>
              <button
                onClick={() => setIsItemModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Awadhi Galouti Kebab"
                  value={itemForm.name}
                  onChange={(e) => setItemForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Category *</label>
                <select
                  required
                  value={itemForm.category_id}
                  onChange={(e) => setItemForm(f => ({ ...f, category_id: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="">Select a category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={itemForm.price}
                    onChange={(e) => setItemForm(f => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="Optional"
                    value={itemForm.discount_price ?? ''}
                    onChange={(e) => setItemForm(f => ({ ...f, discount_price: e.target.value ? Number(e.target.value) : undefined }))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Dietary Type</label>
                  <select
                    value={itemForm.dietary_type}
                    onChange={(e) => setItemForm(f => ({ ...f, dietary_type: e.target.value as DietaryType }))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="veg">Vegetarian (Green Dot)</option>
                    <option value="non_veg">Non-Vegetarian (Red Dot)</option>
                    <option value="egg">Egg (Yellow Dot)</option>
                    <option value="vegan">Vegan</option>
                    <option value="jain">Jain (No Root Veg)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Spice Level (0-3)</label>
                  <select
                    value={itemForm.spice_level}
                    onChange={(e) => setItemForm(f => ({ ...f, spice_level: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value={0}>Mild / Not Spicy</option>
                    <option value={1}>Medium Hot (1 Flame)</option>
                    <option value={2}>Spicy (2 Flames)</option>
                    <option value={3}>Extra Hot (3 Flames)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Food Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={itemForm.image_url}
                  onChange={(e) => setItemForm(f => ({ ...f, image_url: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Ingredients, preparation technique, serving notes..."
                  value={itemForm.description}
                  onChange={(e) => setItemForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={itemForm.is_available}
                    onChange={(e) => setItemForm(f => ({ ...f, is_available: e.target.checked }))}
                    className="w-4 h-4 rounded text-emerald-500"
                  />
                  <span>In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={itemForm.is_featured}
                    onChange={(e) => setItemForm(f => ({ ...f, is_featured: e.target.checked }))}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <span>Chef's Special / Featured</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition"
                >
                  {editingItem ? 'Save Changes' : 'Add Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-MODAL: ADD / EDIT CATEGORY */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-black text-base text-white">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Starters, Woodfired Pizzas"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Short introductory note for customers..."
                  value={categoryDesc}
                  onChange={(e) => setCategoryDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition"
                >
                  {editingCategory ? 'Save Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* BULK CSV / EXCEL MODAL */}
      {isBulkOpen && (
        <BulkMenuManagerModal
          isOpen={isBulkOpen}
          onClose={() => setIsBulkOpen(false)}
          restaurantId={restaurantId}
        />
      )}
    </div>
  );
};