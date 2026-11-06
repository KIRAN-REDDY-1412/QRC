import React, { useState, useEffect } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { MenuTemplate, Restaurant, DietaryType } from '@/types';
import { TemplateRenderer } from '@/templates/TemplateRenderer';
import { 
  X, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Check, 
  Crown, 
  Sparkles, 
  Search, 
  Layers,
  Palette,
  Store,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTemplateId?: string;
  initialRestaurantId?: string;
  onApplyTemplate?: (restaurantId: string, templateId: string) => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  isOpen,
  onClose,
  initialTemplateId,
  initialRestaurantId,
  onApplyTemplate
}) => {
  const { 
    templates, 
    restaurants, 
    currentRestaurant, 
    getRestaurantCategories, 
    getRestaurantItems, 
    getRestaurantSettings,
    updateRestaurantTemplateSettings
  } = useRestaurant();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    initialTemplateId || templates[0]?.id || 'tpl-1'
  );

  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>(
    initialRestaurantId || currentRestaurant?.id || restaurants[0]?.id || ''
  );

  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryType | 'all'>('all');
  const [appliedNotice, setAppliedNotice] = useState<boolean>(false);

  useEffect(() => {
    if (initialTemplateId) setSelectedTemplateId(initialTemplateId);
  }, [initialTemplateId]);

  useEffect(() => {
    if (initialRestaurantId) setSelectedRestaurantId(initialRestaurantId);
  }, [initialRestaurantId]);

  if (!isOpen) return null;

  const currentTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];
  const activeRestaurant = restaurants.find(r => r.id === selectedRestaurantId) || restaurants[0];

  const categories = activeRestaurant ? getRestaurantCategories(activeRestaurant.id) : [];
  const items = activeRestaurant ? getRestaurantItems(activeRestaurant.id) : [];
  const baseSettings = activeRestaurant ? getRestaurantSettings(activeRestaurant.id) : null;

  const effectiveSettings = {
    ...(baseSettings || {
      restaurant_id: activeRestaurant?.id || 'demo',
      template_id: currentTemplate.id,
      accent_color: '#f59e0b',
      font_family: 'Plus Jakarta Sans',
      card_style: 'luxury',
      show_photos: true,
      show_dietary_badges: true,
      show_spice_level: true,
      show_prices: true
    }),
    template_id: currentTemplate.id
  };

  const handleApply = () => {
    if (activeRestaurant) {
      updateRestaurantTemplateSettings(activeRestaurant.id, { template_id: currentTemplate.id });
      if (onApplyTemplate) {
        onApplyTemplate(activeRestaurant.id, currentTemplate.id);
      }
      setAppliedNotice(true);
      setTimeout(() => setAppliedNotice(false), 2500);
    }
  };

  const tierColors: Record<string, { bg: string; text: string; border: string }> = {
    free: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    premium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    premium_plus: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="relative bg-slate-950 border border-slate-800 rounded-3xl max-w-6xl w-full h-[94vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Top Header */}
        <div className="p-4 sm:px-6 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">{currentTemplate.name}</h3>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tierColors[currentTemplate.tier].bg} ${tierColors[currentTemplate.tier].text} ${tierColors[currentTemplate.tier].border}`}>
                  {currentTemplate.tier.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400">{currentTemplate.vibe} • Interactive Template Live Preview</p>
            </div>
          </div>

          {/* Controls: Restaurant selector, Device Switcher, Apply & Close */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Restaurant Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
              <Store className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedRestaurantId}
                onChange={(e) => setSelectedRestaurantId(e.target.value)}
                className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {restaurants.map(r => (
                  <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
              <button
                onClick={() => setDeviceMode('mobile')}
                title="Mobile Phone View"
                className={`p-1.5 rounded-lg text-xs transition flex items-center gap-1 ${
                  deviceMode === 'mobile' 
                    ? 'bg-amber-500 text-slate-950 font-bold' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Phone</span>
              </button>
              <button
                onClick={() => setDeviceMode('tablet')}
                title="Tablet View"
                className={`p-1.5 rounded-lg text-xs transition flex items-center gap-1 ${
                  deviceMode === 'tablet' 
                    ? 'bg-amber-500 text-slate-950 font-bold' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                onClick={() => setDeviceMode('desktop')}
                title="Desktop View"
                className={`p-1.5 rounded-lg text-xs transition flex items-center gap-1 ${
                  deviceMode === 'desktop' 
                    ? 'bg-amber-500 text-slate-950 font-bold' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Full</span>
              </button>
            </div>

            {/* Apply Button */}
            <button
              onClick={handleApply}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
            >
              {appliedNotice ? <Check className="w-3.5 h-3.5" /> : <Palette className="w-3.5 h-3.5" />}
              <span>{appliedNotice ? 'Template Assigned!' : 'Apply to This Restaurant'}</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Template Selector Ribbon */}
        <div className="bg-slate-900/80 border-b border-slate-800 px-4 py-2 overflow-x-auto no-scrollbar flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider font-bold whitespace-nowrap mr-2">
            Switch Template:
          </span>
          {templates.map(tpl => {
            const isSelected = tpl.id === selectedTemplateId;
            return (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplateId(tpl.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-300 hover:text-white border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{tpl.name}</span>
                <span className="text-[9px] uppercase font-mono opacity-80 px-1 py-0.2 rounded bg-black/20">
                  {tpl.tier === 'premium_plus' ? 'Luxury' : tpl.tier}
                </span>
              </button>
            );
          })}
        </div>

        {/* Viewport Simulation Area */}
        <div className="flex-1 bg-slate-900/40 p-2 sm:p-6 flex items-center justify-center overflow-hidden">
          {deviceMode === 'mobile' ? (
            <div className="w-full max-w-[400px] h-full max-h-[720px] bg-slate-950 rounded-[44px] border-[6px] border-slate-800 shadow-2xl overflow-y-auto relative no-scrollbar flex flex-col ring-1 ring-slate-700/50">
              {/* Phone Dynamic Island / Speaker Notch */}
              <div className="sticky top-0 z-50 w-full bg-slate-950 py-1.5 flex justify-center">
                <div className="w-24 h-4 bg-slate-800 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-950 mr-2" />
                  <div className="w-3 h-1 bg-slate-900 rounded-full" />
                </div>
              </div>

              {/* Render Template */}
              <div className="flex-1">
                <TemplateRenderer
                  templateCode={currentTemplate.code}
                  restaurant={activeRestaurant}
                  categories={categories}
                  items={items}
                  settings={effectiveSettings}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  searchQuery={searchQuery}
                  dietaryFilter={dietaryFilter}
                />
              </div>
            </div>
          ) : deviceMode === 'tablet' ? (
            <div className="w-full max-w-[760px] h-full max-h-[720px] bg-slate-950 rounded-[32px] border-[8px] border-slate-800 shadow-2xl overflow-y-auto relative no-scrollbar ring-1 ring-slate-700/50">
              <TemplateRenderer
                templateCode={currentTemplate.code}
                restaurant={activeRestaurant}
                categories={categories}
                items={items}
                settings={effectiveSettings}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                searchQuery={searchQuery}
                dietaryFilter={dietaryFilter}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-y-auto relative no-scrollbar">
              <TemplateRenderer
                templateCode={currentTemplate.code}
                restaurant={activeRestaurant}
                categories={categories}
                items={items}
                settings={effectiveSettings}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                searchQuery={searchQuery}
                dietaryFilter={dietaryFilter}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};