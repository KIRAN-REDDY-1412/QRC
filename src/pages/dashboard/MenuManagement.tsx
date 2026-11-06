import React, { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { usePlan } from '@/context/PlanContext';
import { DietaryType, MenuItem, MenuCategory } from '@/types';
import { DietaryBadge } from '@/components/common/DietaryBadge';
import { SpiceLevel } from '@/components/common/SpiceLevel';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  Check, 
  X, 
  Flame, 
  Sparkles, 
  Upload, 
  FolderTree,
  Search,
  Lock,
  FileSpreadsheet,
  Crown
} from 'lucide-react';
import { BulkMenuManagerModal } from '@/components/modals/BulkMenuManagerModal';

export const MenuManagement: React.FC = () => {
  const { 
    currentRestaurant, 
    categories, 
    items, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    addItem, 
    updateItem, 
    deleteItem, 
    toggleItemAvailability,
    uploadImage 
  } = useRestaurant();

  const { canAccessFeature, openUpgradeModal } = usePlan();
  const canUseBulk = canAccessFeature('bulk_import');

  const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);

  // Form states for Item
  const [itemName, setItemName] = useState('');
  const [itemCategoryId, setItemCategoryId] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState<number>(250);
  const [itemDiscountPrice, setItemDiscountPrice] = useState<number | undefined>(undefined);
  const [itemDietaryType, setItemDietaryType] = useState<DietaryType>('veg');
  const [itemSpiceLevel, setItemSpiceLevel] = useState<number>(0);
  const [itemCalories, setItemCalories] = useState<number | undefined>(undefined);
  const [itemPrepTime, setItemPrepTime] = useState('');
  const [itemImageUrl, setItemImageUrl] = useState('');
  const [itemIsFeatured, setItemIsFeatured] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form states for Category
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  if (!currentRestaurant) return null;

  const canUploadImages = canAccessFeature('food_images');

  // Handle open item modal
  const openNewItemModal = () => {
    setEditingItem(null);
    setItemName('');
    setItemCategoryId(categories[0]?.id || '');
    setItemDescription('');
    setItemPrice(250);
    setItemDiscountPrice(undefined);
    setItemDietaryType('veg');
    setItemSpiceLevel(0);
    setItemCalories(undefined);
    setItemPrepTime('15 mins');
    setItemImageUrl('');
    setItemIsFeatured(false);
    setIsItemModalOpen(true);
  };

  const openEditItemModal = (item: MenuItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemCategoryId(item.category_id);
    setItemDescription(item.description || '');
    setItemPrice(item.price);
    setItemDiscountPrice(item.discount_price);
    setItemDietaryType(item.dietary_type);
    setItemSpiceLevel(item.spice_level);
    setItemCalories(item.calories);
    setItemPrepTime(item.preparation_time || '');
    setItemImageUrl(item.image_url || '');
    setItemIsFeatured(item.is_featured);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !itemCategoryId) return;

    if (editingItem) {
      updateItem(editingItem.id, {
        name: itemName,
        category_id: itemCategoryId,
        description: itemDescription,
        price: Number(itemPrice),
        discount_price: itemDiscountPrice ? Number(itemDiscountPrice) : undefined,
        dietary_type: itemDietaryType,
        spice_level: itemSpiceLevel,
        calories: itemCalories ? Number(itemCalories) : undefined,
        preparation_time: itemPrepTime,
        image_url: itemImageUrl || undefined,
        is_featured: itemIsFeatured
      });
    } else {
      addItem({
        category_id: itemCategoryId,
        name: itemName,
        description: itemDescription,
        price: Number(itemPrice),
        discount_price: itemDiscountPrice ? Number(itemDiscountPrice) : undefined,
        dietary_type: itemDietaryType,
        spice_level: itemSpiceLevel,
        calories: itemCalories ? Number(itemCalories) : undefined,
        preparation_time: itemPrepTime,
        image_url: itemImageUrl || undefined,
        is_available: true,
        is_featured: itemIsFeatured
      });
    }

    setIsItemModalOpen(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!canUploadImages) {
      openUpgradeModal('premium');
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      setItemImageUrl(url);
    } finally {
      setIsUploading(false);
    }
  };

  // Category modal handlers
  const openNewCategoryModal = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryDescription('');
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: MenuCategory) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setCategoryDescription(cat.description || '');
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: categoryName,
        description: categoryDescription
      });
    } else {
      addCategory(categoryName, categoryDescription);
    }
    setIsCategoryModalOpen(false);
  };

  const filteredItems = items.filter(item => {
    if (selectedCategoryFilter !== 'all' && item.category_id !== selectedCategoryFilter) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner and Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Menu Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your dishes, dietary tags, prices, and instant availability toggles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Bulk CSV / Excel</span>
            <Crown className="w-3 h-3 text-amber-400" />
          </button>

          {activeTab === 'items' ? (
            <button
              onClick={openNewItemModal}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Food Item</span>
            </button>
          ) : (
            <button
              onClick={openNewCategoryModal}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>New Category</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('items')}
          className={`py-3 px-6 text-xs font-bold tracking-wider uppercase transition border-b-2 ${
            activeTab === 'items'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Dishes & Items ({items.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`py-3 px-6 text-xs font-bold tracking-wider uppercase transition border-b-2 ${
            activeTab === 'categories'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          Categories ({categories.length})
        </button>
      </div>

      {/* ITEMS VIEW */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search food items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 text-white placeholder-slate-400 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
              <button
                onClick={() => setSelectedCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategoryFilter === 'all'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All Sections
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    selectedCategoryFilter === cat.id
                      ? 'bg-slate-800 text-white font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Items Table / Cards */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="divide-y divide-slate-800/80">
              {filteredItems.map(item => {
                const category = categories.find(c => c.id === item.category_id);
                return (
                  <div
                    key={item.id}
                    className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:bg-slate-900/50 ${
                      !item.is_available ? 'opacity-60 bg-red-950/10' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.image_url ? (
                        <img src={item.image_url} alt="" className="w-14 h-14 rounded-2xl object-cover border border-slate-800" />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <DietaryBadge type={item.dietary_type} />
                          <h3 className="font-bold text-sm text-white">{item.name}</h3>
                          <SpiceLevel level={item.spice_level} />
                          {item.is_featured && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-md">
                          {item.description || 'No description provided.'}
                        </p>
                        <span className="text-[11px] text-slate-500 font-mono">
                          Category: {category?.name || 'General'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                      <div className="text-right">
                        <span className="font-mono text-base font-bold text-emerald-400">₹{item.price}</span>
                        {item.discount_price && (
                          <span className="text-xs line-through text-slate-500 block font-mono">₹{item.discount_price}</span>
                        )}
                      </div>

                      {/* Real-time Availability Toggle */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleItemAvailability(item.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            item.is_available
                              ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                          }`}
                        >
                          {item.is_available ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>In Stock</span>
                            </>
                          ) : (
                            <>
                              <X className="w-3.5 h-3.5" />
                              <span>Sold Out</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditItemModal(item)}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition"
                          title="Edit Item"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 transition"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CATEGORIES VIEW */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, idx) => {
            const count = items.filter(i => i.category_id === cat.id).length;
            return (
              <div
                key={cat.id}
                className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-500">SECTION #{idx + 1}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {count} dishes
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-white">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{cat.description}</p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditCategoryModal(cat)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition text-xs font-semibold flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 transition text-xs font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Food Item Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 text-white shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">
                {editingItem ? 'Edit Food Item' : 'Add New Food Item'}
              </h3>
              <button onClick={() => setIsItemModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Awadhi Mutton Biryani"
                  className="w-full px-3.5 py-2.5 bg-slate-950 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Category *</label>
                  <select
                    value={itemCategoryId}
                    onChange={(e) => setItemCategoryId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-950 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Dietary Type *</label>
                  <select
                    value={itemDietaryType}
                    onChange={(e) => setItemDietaryType(e.target.value as DietaryType)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="veg">Vegetarian (Green Dot)</option>
                    <option value="non_veg">Non-Vegetarian (Red Triangle)</option>
                    <option value="egg">Contains Egg (Yellow Circle)</option>
                    <option value="jain">Jain Friendly</option>
                    <option value="vegan">100% Plant Vegan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    value={itemPrice}
                    onChange={(e) => setItemPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Discount Price (Optional)</label>
                  <input
                    type="number"
                    value={itemDiscountPrice || ''}
                    onChange={(e) => setItemDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 199"
                    className="w-full px-3.5 py-2.5 bg-slate-950 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="Ingredients, preparation details, allergen notes..."
                  className="w-full px-3.5 py-2 bg-slate-950 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Food Image Upload & Permission Gate */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Food Photo</span>
                  </label>
                  {!canUploadImages && (
                    <span className="text-[10px] text-amber-400 flex items-center gap-1 font-bold">
                      <Lock className="w-3 h-3" /> Premium Feature
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {itemImageUrl ? (
                    <img src={itemImageUrl} alt="" className="w-16 h-16 rounded-xl object-cover border border-slate-700" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Recommended: 800x600 JPG or WebP</p>
                  </div>
                </div>
              </div>

              {/* Spice Level & Featured */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Spice Level: {itemSpiceLevel === 0 ? 'Mild' : itemSpiceLevel === 1 ? 'Medium' : itemSpiceLevel === 2 ? 'Spicy' : 'Extra Hot'}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    value={itemSpiceLevel}
                    onChange={(e) => setItemSpiceLevel(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="flex items-center pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={itemIsFeatured}
                      onChange={(e) => setItemIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-0 bg-slate-950 border-slate-800"
                    />
                    <span className="text-xs font-semibold text-slate-200">Mark as Chef's Special</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Starters, Tandoor, Desserts"
                  className="w-full px-3.5 py-2.5 bg-slate-950 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                  placeholder="Brief note about this dining section..."
                  className="w-full px-3.5 py-2 bg-slate-950 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* BULK CSV / EXCEL MODAL (PREMIUM PLUS) */}
      {isBulkModalOpen && (
        <BulkMenuManagerModal
          isOpen={isBulkModalOpen}
          onClose={() => setIsBulkModalOpen(false)}
          restaurantId={currentRestaurant.id}
        />
      )}
    </div>
  );
};
