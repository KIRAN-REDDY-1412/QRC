import React, { useState } from 'react';
import { usePlan } from '@/context/PlanContext';
import { SubscriptionPlan, PlanCode } from '@/types';
import { CreditCard, Save, Check, Plus, Trash2, ShieldCheck, Sparkles } from 'lucide-react';

export const PlanPricingManager: React.FC = () => {
  const { plans, updatePlanPricing } = usePlan();
  const [editingPlans, setEditingPlans] = useState<SubscriptionPlan[]>(plans);
  const [savedNotice, setSavedNotice] = useState(false);

  const handlePriceChange = (planId: string, field: 'monthly_price' | 'yearly_price' | 'yearly_discount_percent', val: number) => {
    setEditingPlans(prev =>
      prev.map(p => (p.id === planId ? { ...p, [field]: val } : p))
    );
  };

  const handleAddFeature = (planId: string, featureText: string) => {
    if (!featureText.trim()) return;
    setEditingPlans(prev =>
      prev.map(p =>
        p.id === planId ? { ...p, features: [...p.features, featureText.trim()] } : p
      )
    );
  };

  const handleRemoveFeature = (planId: string, idx: number) => {
    setEditingPlans(prev =>
      prev.map(p =>
        p.id === planId ? { ...p, features: p.features.filter((_, i) => i !== idx) } : p
      )
    );
  };

  const handleSaveAll = () => {
    editingPlans.forEach(p => {
      updatePlanPricing(p.id, {
        monthly_price: Number(p.monthly_price),
        yearly_price: Number(p.yearly_price),
        yearly_discount_percent: Number(p.yearly_discount_percent),
        features: p.features,
        is_active: p.is_active
      });
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
              Dynamic Pricing Engine
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Subscription Plans & INR (₹) Pricing</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Prices and features configured here update the public landing page, pricing tables, and owner upgrade modals instantaneously.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          {savedNotice ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{savedNotice ? 'Platform Rates Published!' : 'Publish Plan Changes'}</span>
        </button>
      </div>

      {/* Plan Cards Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {editingPlans.map((plan) => {
          const isFree = plan.code === 'free';
          const isPremiumPlus = plan.code === 'premium_plus';

          return (
            <div
              key={plan.id}
              className={`bg-slate-950 rounded-3xl p-6 border flex flex-col justify-between shadow-xl ${
                isPremiumPlus
                  ? 'border-amber-500/50 ring-1 ring-amber-500/30'
                  : isFree
                  ? 'border-slate-800'
                  : 'border-emerald-500/50 ring-1 ring-emerald-500/30'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    isPremiumPlus 
                      ? 'bg-amber-500/20 text-amber-300' 
                      : isFree 
                      ? 'bg-slate-800 text-slate-300' 
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {plan.code.replace('_', ' ')}
                  </span>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-[11px] text-slate-400">Active</span>
                    <input
                      type="checkbox"
                      checked={plan.is_active}
                      onChange={(e) => {
                        setEditingPlans(prev =>
                          prev.map(p => (p.id === plan.id ? { ...p, is_active: e.target.checked } : p))
                        );
                      }}
                      className="accent-amber-500 w-4 h-4 rounded"
                    />
                  </label>
                </div>

                <h3 className="text-xl font-bold text-white">{plan.name}</h3>

                {/* Pricing Fields in INR ₹ */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">
                      Monthly Price (₹ INR)
                    </label>
                    <input
                      type="number"
                      disabled={isFree}
                      value={plan.monthly_price}
                      onChange={(e) => handlePriceChange(plan.id, 'monthly_price', Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-900 text-white font-mono text-sm rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">
                      Yearly Price (₹ INR)
                    </label>
                    <input
                      type="number"
                      disabled={isFree}
                      value={plan.yearly_price}
                      onChange={(e) => handlePriceChange(plan.id, 'yearly_price', Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-900 text-white font-mono text-sm rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">
                      Yearly Discount (%)
                    </label>
                    <input
                      type="number"
                      disabled={isFree}
                      value={plan.yearly_discount_percent}
                      onChange={(e) => handlePriceChange(plan.id, 'yearly_discount_percent', Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-900 text-white font-mono text-sm rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Features List */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">Plan Entitlement Bullets:</span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar pr-1">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-slate-300 bg-slate-900 p-2 rounded-lg">
                        <span className="truncate max-w-[200px]">{feat}</span>
                        <button
                          onClick={() => handleRemoveFeature(plan.id, idx)}
                          className="text-slate-500 hover:text-red-400 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Feature input */}
                  <div className="flex gap-1.5 pt-1">
                    <input
                      type="text"
                      id={`new-feat-${plan.id}`}
                      placeholder="Add bullet..."
                      className="flex-1 px-2.5 py-1.5 bg-slate-900 text-white text-xs rounded-lg border border-slate-700 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById(`new-feat-${plan.id}`) as HTMLInputElement;
                        if (input && input.value) {
                          handleAddFeature(plan.id, input.value);
                          input.value = '';
                        }
                      }}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-lg font-bold"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
