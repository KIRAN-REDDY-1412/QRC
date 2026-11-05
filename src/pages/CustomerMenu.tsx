import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { 
  Restaurant, 
  MenuCategory, 
  MenuItem, 
  RestaurantTemplateSettings, 
  DietaryType 
} from '@/types';
import { 
  getStoredRestaurants, 
  getStoredCategories, 
  getStoredItems, 
  getStoredSettings, 
  ALL_TEMPLATES, 
  recordScanEvent,
  getStoredSubscription
} from '@/lib/supabase';
import { TemplateRenderer } from '@/templates/TemplateRenderer';
import { Search, Globe, Utensils, AlertCircle } from 'lucide-react';

export const CustomerMenu: React.FC = () => {
  const { restaurantSlug } = useParams<{ restaurantSlug: string }>();
  const [searchParams] = useSearchParams();
  const tableParam = searchParams.get('table');

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<RestaurantTemplateSettings | null>(null);
  const [templateCode, setTemplateCode] = useState<string>('classic_menu');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryType | 'all'>('all');
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSaasBranding, setShowSaasBranding] = useState<boolean>(true);

  useEffect(() => {
    loadMenu();
  }, [restaurantSlug]);

  const loadMenu = () => {
    setIsLoading(true);
    setError(null);

    const allRestaurants = getStoredRestaurants();
    const found = allRestaurants.find(r => r.slug.toLowerCase() === restaurantSlug?.toLowerCase());

    if (!found) {
      setError(`Restaurant "${restaurantSlug}" could not be found.`);
      setIsLoading(false);
      return;
    }

    setRestaurant(found);
    const loadedCats = getStoredCategories(found.id);
    const loadedItems = getStoredItems(found.id);
    const loadedSettings = getStoredSettings(found.id);

    setCategories(loadedCats);
    setItems(loadedItems);
    setSettings(loadedSettings);

    // Resolve template code
    const tpl = ALL_TEMPLATES.find(t => t.id === loadedSettings.template_id);
    setTemplateCode(tpl ? tpl.code : 'classic_menu');

    // Check SaaS branding removal permission from plan
    const sub = getStoredSubscription(found.id);
    setShowSaasBranding(!sub.plan?.remove_saas_branding);

    // Record scan event
    recordScanEvent(found.id, 'qr_scan');

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-lg font-bold tracking-wide">Opening Menu...</p>
        <p className="text-xs text-slate-400 mt-1">Connecting to kitchen & daily specials</p>
      </div>
    );
  }

  if (error || !restaurant || !settings) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center text-slate-800">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold">Restaurant Menu Not Found</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">{error || "Please verify the QR code URL."}</p>
        <a 
          href="/" 
          className="mt-6 px-6 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition"
        >
          Return to SmartQR Home
        </a>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen selection:bg-emerald-500 selection:text-white">
      {/* Search Header Overlay */}
      {isSearchOpen && (
        <div className="fixed top-0 inset-x-0 z-50 bg-slate-900/95 backdrop-blur-md p-4 shadow-xl border-b border-slate-700 animate-in fade-in slide-in-from-top-2">
          <div className="max-w-md mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes, ingredients..."
                autoFocus
                className="w-full pl-9 pr-4 py-2.5 bg-slate-800 text-white placeholder-slate-400 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
              }}
              className="px-3 py-2 text-xs font-bold text-slate-300 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Template Rendering */}
      <TemplateRenderer
        templateCode={templateCode}
        restaurant={restaurant}
        categories={categories}
        items={items}
        settings={settings}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        dietaryFilter={dietaryFilter}
        currentLanguage={currentLanguage}
        tableNumber={tableParam ? `Table ${tableParam}` : undefined}
      />

      {/* Mobile Floating Action Deck */}
      <div className="fixed bottom-4 inset-x-4 max-w-md mx-auto z-40">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 p-2 rounded-2xl shadow-2xl flex items-center justify-between gap-1 text-white">
          {/* Quick Veg Filter Toggle */}
          <div className="flex bg-slate-800/80 p-1 rounded-xl">
            <button
              onClick={() => setDietaryFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                dietaryFilter === 'all' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setDietaryFilter(dietaryFilter === 'veg' ? 'all' : 'veg')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                dietaryFilter === 'veg' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              <span className="badge-fssai-veg" />
              <span>Veg</span>
            </button>
            <button
              onClick={() => setDietaryFilter(dietaryFilter === 'non_veg' ? 'all' : 'non_veg')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                dietaryFilter === 'non_veg' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              <span className="badge-fssai-nonveg" />
              <span>Non-Veg</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Search menu"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setCurrentLanguage(currentLanguage === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{currentLanguage === 'en' ? 'EN' : 'हिन्दी'}</span>
            </button>
          </div>
        </div>

        {/* SmartQR SaaS Branding (Removed if Plan Entitled) */}
        {showSaasBranding && (
          <div className="text-center mt-2">
            <a 
              href="/" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-sans text-slate-400 hover:text-slate-200 transition bg-black/40 backdrop-blur px-2.5 py-0.5 rounded-full"
            >
              <Utensils className="w-3 h-3 text-emerald-400" /> Powered by <span className="font-bold text-white">SmartQR Menu</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
