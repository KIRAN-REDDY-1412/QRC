import React, { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { usePlan } from '@/context/PlanContext';
import { TemplateRenderer } from '@/templates/TemplateRenderer';
import { 
  Palette, 
  Smartphone, 
  Type, 
  Layers, 
  Sparkles, 
  Lock, 
  Save, 
  Check, 
  Sliders
} from 'lucide-react';

export const MenuDesignStudio: React.FC = () => {
  const { 
    currentRestaurant, 
    categories, 
    items, 
    templateSettings, 
    updateTemplateSettings, 
    templates 
  } = useRestaurant();

  const { canAccessFeature, openUpgradeModal, currentSubscription } = usePlan();

  const [accentColor, setAccentColor] = useState(templateSettings.accent_color || '#10b981');
  const [fontFamily, setFontFamily] = useState(templateSettings.font_family || 'Plus Jakarta Sans');
  const [showPhotos, setShowPhotos] = useState(templateSettings.show_photos ?? true);
  const [showDietaryBadges, setShowDietaryBadges] = useState(templateSettings.show_dietary_badges ?? true);
  const [showSpiceLevel, setShowSpiceLevel] = useState(templateSettings.show_spice_level ?? true);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  if (!currentRestaurant) return null;

  const currentTemplate = templates.find(t => t.id === templateSettings.template_id) || templates[0];
  const canCustomColors = canAccessFeature('custom_branding');
  const canCustomFonts = canAccessFeature('custom_branding');

  const handleSaveSettings = () => {
    updateTemplateSettings({
      accent_color: accentColor,
      font_family: fontFamily,
      show_photos: showPhotos,
      show_dietary_badges: showDietaryBadges,
      show_spice_level: showSpiceLevel
    });
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Palette className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
              Visual Design Studio
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Menu Styling & Live Preview</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Customize typography, accent palettes, and display toggles with real-time mobile preview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveSettings}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            {isSavedNotice ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSavedNotice ? 'Changes Published!' : 'Save & Publish Changes'}</span>
          </button>
        </div>
      </div>

      {/* Split Screen Workspace: Controls on Left, Live Mobile Phone on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Template Card */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Theme</span>
              <a
                href="/dashboard/templates"
                className="text-xs text-emerald-400 hover:underline font-semibold"
              >
                Browse All 15 Themes
              </a>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">{currentTemplate.name}</h3>
                <span className="text-[11px] text-slate-400 capitalize">{currentTemplate.vibe}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {currentTemplate.tier.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Accent Color Palette Customization */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4 text-emerald-400" />
                <span>Brand Accent Color</span>
              </label>
              {!canCustomColors && (
                <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Premium Feature
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {['#10b981', '#f59e0b', '#6366f1', '#ec4899', '#06b6d4', '#e11d48'].map((c) => (
                <button
                  key={c}
                  style={{ backgroundColor: c }}
                  onClick={() => {
                    if (!canCustomColors) {
                      openUpgradeModal('premium');
                      return;
                    }
                    setAccentColor(c);
                  }}
                  className={`w-8 h-8 rounded-full border-2 transition ${
                    accentColor === c ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                  }`}
                />
              ))}
              <input
                type="color"
                value={accentColor}
                onChange={(e) => {
                  if (!canCustomColors) {
                    openUpgradeModal('premium');
                    return;
                  }
                  setAccentColor(e.target.value);
                }}
                className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-0"
              />
            </div>
          </div>

          {/* Font Selection */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Type className="w-4 h-4 text-indigo-400" />
                <span>Typography & Font Family</span>
              </label>
              {!canCustomFonts && (
                <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Premium Feature
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Plus Jakarta Sans', label: 'Modern Sans' },
                { name: 'Playfair Display', label: 'Classic Serif' },
                { name: 'Cinzel', label: 'Royal Imperial' },
                { name: 'Outfit', label: 'Clean Geometric' }
              ].map(f => (
                <button
                  key={f.name}
                  onClick={() => {
                    if (!canCustomFonts) {
                      openUpgradeModal('premium');
                      return;
                    }
                    setFontFamily(f.name);
                  }}
                  className={`p-3 rounded-xl border text-left transition ${
                    fontFamily === f.name
                      ? 'bg-slate-900 border-emerald-500 text-white'
                      : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold block">{f.label}</span>
                  <span className="text-[10px] text-slate-500">{f.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Display Toggles */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
            <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Menu Card Affordances</span>
            </label>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                <span className="text-xs text-slate-300 font-medium">Show Food Photography</span>
                <input
                  type="checkbox"
                  checked={showPhotos}
                  onChange={(e) => setShowPhotos(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 accent-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                <span className="text-xs text-slate-300 font-medium">Show FSSAI Dietary Badges (Veg / Non-Veg)</span>
                <input
                  type="checkbox"
                  checked={showDietaryBadges}
                  onChange={(e) => setShowDietaryBadges(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 accent-emerald-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                <span className="text-xs text-slate-300 font-medium">Show Spice Meter (Chili Icons)</span>
                <input
                  type="checkbox"
                  checked={showSpiceLevel}
                  onChange={(e) => setShowSpiceLevel(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 accent-emerald-500"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Live Smartphone Preview Column */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>LIVE INTERACTIVE PHONE SIMULATOR</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">REALTIME RENDERING</span>
          </div>

          {/* Device Mockup Shell */}
          <div className="w-full max-w-[390px] h-[720px] bg-slate-950 rounded-[48px] border-[6px] border-slate-800 shadow-2xl overflow-y-auto relative no-scrollbar">
            {/* Phone Notch / Speaker */}
            <div className="sticky top-0 z-50 w-full bg-slate-950 py-1.5 flex justify-center">
              <div className="w-24 h-4 bg-slate-800 rounded-full" />
            </div>

            {/* Injected Template Renderer */}
            <TemplateRenderer
              templateCode={currentTemplate.code}
              restaurant={currentRestaurant}
              categories={categories}
              items={items}
              settings={{
                ...templateSettings,
                accent_color: accentColor,
                font_family: fontFamily,
                show_photos: showPhotos,
                show_dietary_badges: showDietaryBadges,
                show_spice_level: showSpiceLevel
              }}
              selectedCategory="all"
              onSelectCategory={() => {}}
              searchQuery=""
              dietaryFilter="all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
