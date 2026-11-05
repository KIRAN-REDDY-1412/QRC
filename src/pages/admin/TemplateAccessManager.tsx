import React, { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { MenuTemplate, PlanCode } from '@/types';
import { LayoutTemplate, Check, Save } from 'lucide-react';

export const TemplateAccessManager: React.FC = () => {
  const { templates } = useRestaurant();
  const [templateList, setTemplateList] = useState<MenuTemplate[]>(templates);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleTierChange = (tplId: string, newTier: PlanCode) => {
    setTemplateList(prev =>
      prev.map(t => t.id === tplId ? { ...t, tier: newTier } : t)
    );
  };

  const handleToggleActive = (tplId: string) => {
    setTemplateList(prev =>
      prev.map(t => t.id === tplId ? { ...t, is_active: !t.is_active } : t)
    );
  };

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <LayoutTemplate className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
              Template Governance
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Template Entitlements & Assignment</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Super Admins can reassign any of the 15 templates to Free, Premium, or Premium Plus tiers in real time.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          {savedNotice ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{savedNotice ? 'Access Matrix Updated!' : 'Save Entitlements'}</span>
        </button>
      </div>

      {/* Templates Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-900 border-b border-slate-800 grid grid-cols-12 text-xs font-bold uppercase text-slate-400">
          <div className="col-span-5">Template Details</div>
          <div className="col-span-4">Assigned Plan Tier</div>
          <div className="col-span-3 text-right">Marketplace Status</div>
        </div>

        <div className="divide-y divide-slate-800/80">
          {templateList.map(tpl => (
            <div key={tpl.id} className="p-4 grid grid-cols-12 items-center gap-4 text-xs">
              {/* Template Info */}
              <div className="col-span-5 flex items-center gap-3">
                <img
                  src={tpl.thumbnail_url}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                />
                <div>
                  <h4 className="font-bold text-white text-sm">{tpl.name}</h4>
                  <span className="text-[11px] text-slate-400 block">{tpl.vibe}</span>
                </div>
              </div>

              {/* Tier Assignment */}
              <div className="col-span-4">
                <select
                  value={tpl.tier}
                  onChange={(e) => handleTierChange(tpl.id, e.target.value as PlanCode)}
                  className="px-3 py-1.5 bg-slate-900 text-white font-semibold rounded-lg border border-slate-700 text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="free">Free Plan (Available to all)</option>
                  <option value="premium">Premium Plan Tier</option>
                  <option value="premium_plus">Premium Plus Luxury Tier</option>
                </select>
              </div>

              {/* Status */}
              <div className="col-span-3 flex items-center justify-end gap-3">
                <button
                  onClick={() => handleToggleActive(tpl.id)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    tpl.is_active
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {tpl.is_active ? 'Active' : 'Hidden'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
