import React, { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { Restaurant, DietaryType } from '@/types';
import { RestaurantEditorModal } from '@/components/modals/RestaurantEditorModal';
import { TemplatePreviewModal } from '@/components/modals/TemplatePreviewModal';
import { 
  Store, 
  ExternalLink, 
  Search, 
  Edit3, 
  Eye, 
  Power, 
  PowerOff, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Sparkles, 
  Utensils, 
  Palette, 
  SlidersHorizontal,
  MapPin,
  Check,
  X
} from 'lucide-react';

export const RestaurantsList: React.FC = () => {
  const { 
    restaurants, 
    toggleRestaurantActive, 
    addRestaurant, 
    getRestaurantItems, 
    getRestaurantSettings,
    templates 
  } = useRestaurant();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  // Modals state
  const [editingRestaurantId, setEditingRestaurantId] = useState<string | null>(null);
  const [editorInitialTab, setEditorInitialTab] = useState<'items' | 'design' | 'profile' | 'preview'>('items');
  const [previewRestaurantId, setPreviewRestaurantId] = useState<string | null>(null);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const [isAddRestaurantOpen, setIsAddRestaurantOpen] = useState(false);

  // New restaurant form state
  const [newRestName, setNewRestName] = useState('');
  const [newRestSlug, setNewRestSlug] = useState('');
  const [newRestCity, setNewRestCity] = useState('Mumbai');
  const [newRestState, setNewRestState] = useState('Maharashtra');
  const [newRestTagline, setNewRestTagline] = useState('');
  const [newRestIsPureVeg, setNewRestIsPureVeg] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggle = (r: Restaurant, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleRestaurantActive(r.id);
    showToast(`${r.name} is now ${!r.is_active ? 'ACTIVE' : 'DEACTIVATED'}`);
  };

  const handleOpenEdit = (restaurantId: string, tab: 'items' | 'design' | 'profile' | 'preview' = 'items') => {
    setEditingRestaurantId(restaurantId);
    setEditorInitialTab(tab);
  };

  const handleOpenPreview = (restaurantId: string, templateId?: string) => {
    setPreviewRestaurantId(restaurantId);
    if (templateId) {
      setPreviewTemplateId(templateId);
    } else {
      const sets = getRestaurantSettings(restaurantId);
      setPreviewTemplateId(sets.template_id || 'tpl-1');
    }
  };

  const handleCreateRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRestName.trim()) return;

    const slug = newRestSlug.trim() 
      ? newRestSlug.toLowerCase().replace(/\s+/g, '-')
      : newRestName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    const created = addRestaurant({
      owner_id: `user-${Date.now()}`,
      name: newRestName,
      slug,
      tagline: newRestTagline || 'Authentic Culinary Experience',
      city: newRestCity,
      state: newRestState,
      currency: 'INR',
      is_active: true,
      is_pure_veg: newRestIsPureVeg,
      logo_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80',
      banner_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80'
    });

    setIsAddRestaurantOpen(false);
    setNewRestName('');
    setNewRestSlug('');
    setNewRestTagline('');
    showToast(`Restaurant "${created.name}" created! Now you can edit its menu.`);
    // Directly open editor for the new restaurant
    handleOpenEdit(created.id, 'items');
  };

  // Filter logic
  const filtered = restaurants.filter(r => {
    const matchesSearch = 
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.city?.toLowerCase().includes(search.toLowerCase()) ||
      r.slug.toLowerCase().includes(search.toLowerCase());
    
    if (statusFilter === 'active') return matchesSearch && r.is_active;
    if (statusFilter === 'inactive') return matchesSearch && !r.is_active;
    return matchesSearch;
  });

  const activeCount = restaurants.filter(r => r.is_active).length;
  const inactiveCount = restaurants.filter(r => !r.is_active).length;
  const totalDishes = restaurants.reduce((acc, r) => acc + getRestaurantItems(r.id).length, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 border border-amber-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
              Super Admin Multi-Tenant Governance
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">All Registered Restaurants ({restaurants.length})</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Full control to edit menus, food items, visual design, activation status, and live template preview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddRestaurantOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard New Restaurant</span>
          </button>
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase block">Total Venues</span>
          <span className="text-2xl font-black text-white mt-1 block">{restaurants.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-[11px] font-mono text-emerald-400 uppercase block">Active Menus</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">{activeCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-[11px] font-mono text-rose-400 uppercase block">Deactivated Menus</span>
          <span className="text-2xl font-black text-rose-400 mt-1 block">{inactiveCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-[11px] font-mono text-amber-400 uppercase block">Total Dishes Live</span>
          <span className="text-2xl font-black text-amber-400 mt-1 block">{totalDishes}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, city, or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 text-white placeholder-slate-500 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                statusFilter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                statusFilter === 'active' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                statusFilter === 'inactive' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400'
              }`}
            >
              Deactivated ({inactiveCount})
            </button>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Showing {filtered.length} of {restaurants.length} venues
        </span>
      </div>

      {/* Restaurants List Cards */}
      <div className="space-y-3">
        {filtered.map(r => {
          const items = getRestaurantItems(r.id);
          const sets = getRestaurantSettings(r.id);
          const currentTpl = templates.find(t => t.id === sets.template_id) || templates[0];

          return (
            <div
              key={r.id}
              className={`p-5 rounded-3xl bg-slate-950 border transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-5 ${
                r.is_active 
                  ? 'border-slate-800/80 hover:border-slate-700 shadow-xl' 
                  : 'border-rose-900/30 bg-rose-950/5 opacity-85'
              }`}
            >
              {/* Identity Details */}
              <div className="flex items-start sm:items-center gap-4 flex-1">
                {r.logo_url ? (
                  <img
                    src={r.logo_url}
                    alt=""
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-800 flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 flex-shrink-0">
                    <Store className="w-7 h-7" />
                  </div>
                )}

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-base text-white">{r.name}</h3>
                    {r.is_pure_veg && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Pure Veg
                      </span>
                    )}
                    {r.is_active ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active Menu
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/30 flex items-center gap-1">
                        <PowerOff className="w-3 h-3" />
                        Deactivated
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1">{r.tagline || 'Dining establishment'}</p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {r.city}, {r.state}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Utensils className="w-3.5 h-3.5" />
                      {items.length} Food Dishes
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Palette className="w-3.5 h-3.5 text-slate-400" />
                      Theme: <strong className="text-white">{currentTpl.name}</strong>
                    </span>
                    <span>•</span>
                    <span className="font-mono text-slate-400 text-[11px]">/menu/{r.slug}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                {/* Activate / Deactivate Toggle Button */}
                <button
                  onClick={(e) => handleToggle(r, e)}
                  title={r.is_active ? 'Deactivate this restaurant menu' : 'Activate this restaurant menu'}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                    r.is_active
                      ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {r.is_active ? (
                    <>
                      <PowerOff className="w-3.5 h-3.5" />
                      <span>Deactivate</span>
                    </>
                  ) : (
                    <>
                      <Power className="w-3.5 h-3.5" />
                      <span>Activate</span>
                    </>
                  )}
                </button>

                {/* Edit Restaurant & Menu Button */}
                <button
                  onClick={() => handleOpenEdit(r.id, 'items')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Menu & Theme</span>
                </button>

                {/* View / Check Template Button */}
                <button
                  onClick={() => handleOpenPreview(r.id, sets.template_id)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Check Template</span>
                </button>

                {/* Open Public Menu */}
                <a
                  href={`/menu/${r.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-800 transition"
                  title="Open live customer menu in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL RESTAURANT EDITOR MODAL */}
      {editingRestaurantId && (
        <RestaurantEditorModal
          isOpen={Boolean(editingRestaurantId)}
          onClose={() => setEditingRestaurantId(null)}
          restaurantId={editingRestaurantId}
          initialTab={editorInitialTab}
        />
      )}

      {/* TEMPLATE PREVIEW MODAL */}
      {previewRestaurantId && (
        <TemplatePreviewModal
          isOpen={Boolean(previewRestaurantId)}
          onClose={() => setPreviewRestaurantId(null)}
          initialRestaurantId={previewRestaurantId}
          initialTemplateId={previewTemplateId || undefined}
        />
      )}

      {/* ONBOARD NEW RESTAURANT MODAL */}
      {isAddRestaurantOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-base text-white">Onboard New Restaurant</h3>
              </div>
              <button
                onClick={() => setIsAddRestaurantOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRestaurant} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Restaurant Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Punjab Haveli"
                  value={newRestName}
                  onChange={(e) => setNewRestName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Custom URL Slug (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. royal-punjab-haveli"
                  value={newRestSlug}
                  onChange={(e) => setNewRestSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Authentic Dhaba & Tandoori Delights"
                  value={newRestTagline}
                  onChange={(e) => setNewRestTagline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">City</label>
                  <input
                    type="text"
                    value={newRestCity}
                    onChange={(e) => setNewRestCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">State</label>
                  <input
                    type="text"
                    value={newRestState}
                    onChange={(e) => setNewRestState(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-emerald-400 font-semibold pt-1">
                <input
                  type="checkbox"
                  checked={newRestIsPureVeg}
                  onChange={(e) => setNewRestIsPureVeg(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500"
                />
                <span>Pure Vegetarian Restaurant</span>
              </label>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddRestaurantOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition"
                >
                  Create & Edit Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};