import React, { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { usePlan } from '@/context/PlanContext';
import { MenuTemplate, PlanCode } from '@/types';
import { 
  Lock, 
  Check, 
  Crown, 
  Eye, 
  Sparkles, 
  ShieldAlert, 
  Smartphone, 
  X,
  Palette
} from 'lucide-react';
import { TemplateRenderer } from '@/templates/TemplateRenderer';

export const TemplateMarketplace: React.FC = () => {
  const { 
    templates, 
    templateSettings, 
    selectTemplate, 
    currentRestaurant, 
    categories, 
    items 
  } = useRestaurant();

  const { canAccessTemplate, openUpgradeModal, currentSubscription } = usePlan();

  const [activeTierFilter, setActiveTierFilter] = useState<'all' | 'basic' | 'premium'>('all');
  const [previewTemplate, setPreviewTemplate] = useState<MenuTemplate | null>(null);

  if (!currentRestaurant) return null;

  const currentPlanCode = currentSubscription?.plan?.code || 'basic';

  const filteredTemplates = templates.filter(tpl => {
    if (activeTierFilter === 'all') return true;
    if (activeTierFilter === 'basic') return tpl.tier === 'basic' || tpl.tier === 'free';
    if (activeTierFilter === 'premium') return tpl.tier === 'premium' || tpl.tier === 'premium_plus';
    return true;
  });

  const handleApplyTemplate = (tpl: MenuTemplate) => {
    const isAllowed = canAccessTemplate(tpl.tier);
    if (!isAllowed) {
      openUpgradeModal(tpl.tier);
      return;
    }
    selectTemplate(tpl.id);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Palette className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
              15 Bespoke Visual Themes
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Menu Template Marketplace</h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
            Choose from handcrafted dining aesthetics tailored for every concept: from street bistros and sunny cafes to regal Indian palaces and Michelin-star fine dining.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Your Subscription Tier</span>
            <span className="text-sm font-bold text-white capitalize">{currentPlanCode.replace('_', ' ')} Plan</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { key: 'all', label: 'All 15 Templates' },
          { key: 'basic', label: 'Basic Templates' },
          { key: 'premium', label: 'Premium Luxury Templates' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTierFilter(tab.key as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeTierFilter === tab.key
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tpl) => {
          const isSelected = templateSettings.template_id === tpl.id;
          const isAllowed = canAccessTemplate(tpl.tier);
          const isFree = tpl.tier === 'free';
          const isPremiumPlus = tpl.tier === 'premium_plus';

          return (
            <div
              key={tpl.id}
              className={`group bg-slate-950 rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                isSelected 
                  ? 'border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/30' 
                  : isAllowed 
                  ? 'border-slate-800 hover:border-slate-700 shadow-lg' 
                  : 'border-slate-800/80 opacity-90'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                <img
                  src={tpl.thumbnail_url}
                  alt={tpl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Tier Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md ${
                      isFree
                        ? 'bg-slate-800 text-slate-200 border border-slate-700'
                        : isPremiumPlus
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950'
                        : 'bg-emerald-500 text-slate-950'
                    }`}
                  >
                    {tpl.tier.replace('_', ' ')}
                  </span>
                </div>

                {/* Lock Overlay if unentitled */}
                {!isAllowed && (
                  <div className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/90 text-amber-400 border border-amber-500/40 shadow-lg">
                    <Lock className="w-4 h-4" />
                  </div>
                )}

                {/* Currently Active Badge */}
                {isSelected && (
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-md">
                    <Check className="w-3.5 h-3.5" /> Active Design
                  </div>
                )}
              </div>

              {/* Template Content Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-base text-white">{tpl.name}</h3>
                    <span className="text-[11px] font-medium text-slate-400">{tpl.vibe}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {tpl.description}
                  </p>

                  {/* Features List */}
                  <div className="mt-4 space-y-1.5 border-t border-slate-800 pt-3">
                    {tpl.features_list.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => setPreviewTemplate(tpl)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition border border-slate-700/60 flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Preview</span>
                  </button>

                  {isAllowed ? (
                    <button
                      onClick={() => handleApplyTemplate(tpl)}
                      disabled={isSelected}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Applied</span>
                        </>
                      ) : (
                        <span>Use Template</span>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => openUpgradeModal(tpl.tier)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1 shadow-md"
                    >
                      <Lock className="w-3 h-3" />
                      <span>Unlock</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fullscreen Interactive Phone Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-slate-950 border border-slate-800 rounded-3xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-sm text-white">{previewTemplate.name} • Mobile Live Preview</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Rendered with your actual menu items</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {canAccessTemplate(previewTemplate.tier) ? (
                  <button
                    onClick={() => {
                      selectTemplate(previewTemplate.id);
                      setPreviewTemplate(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition"
                  >
                    Apply This Template
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      openUpgradeModal(previewTemplate.tier);
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition flex items-center gap-1"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>Upgrade to Use</span>
                  </button>
                )}
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Viewport Simulation Container */}
            <div className="flex-1 bg-slate-900/60 p-4 md:p-8 flex items-center justify-center overflow-hidden">
              <div className="w-full max-w-[400px] h-full max-h-[700px] bg-slate-950 rounded-[40px] border-4 border-slate-800 shadow-2xl overflow-y-auto relative no-scrollbar">
                {/* Simulated Phone Top Speaker */}
                <div className="sticky top-0 z-50 w-full bg-slate-950 py-1 flex justify-center">
                  <div className="w-20 h-3.5 bg-slate-800 rounded-full" />
                </div>

                {/* Render Template */}
                <TemplateRenderer
                  templateCode={previewTemplate.code}
                  restaurant={currentRestaurant}
                  categories={categories}
                  items={items}
                  settings={templateSettings}
                  selectedCategory="all"
                  onSelectCategory={() => {}}
                  searchQuery=""
                  dietaryFilter="all"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
