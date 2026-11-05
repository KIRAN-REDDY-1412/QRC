import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurant } from '@/context/RestaurantContext';
import { usePlan } from '@/context/PlanContext';
import { 
  BarChart2, 
  Store, 
  CreditCard, 
  QrCode, 
  Crown, 
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const { restaurants } = useRestaurant();
  const { plans } = usePlan();
  const navigate = useNavigate();

  const totalRestaurants = restaurants.length;
  const premiumPlan = plans.find(p => p.code === 'premium');
  const premiumPlusPlan = plans.find(p => p.code === 'premium_plus');

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
            Executive Command Center
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-white">SmartQR SaaS Platform Overview</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          High-level metrics across all restaurant establishments, subscriptions, and platform revenue.
        </p>
      </div>

      {/* High Level Platform Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Restaurants</span>
            <Store className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-white">{totalRestaurants}</span>
            <span className="text-[11px] text-emerald-400 block mt-1">Across Mumbai, Bengaluru & Delhi</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Configured Premium Rate</span>
            <CreditCard className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-amber-300 font-mono">₹{premiumPlan?.monthly_price || 799}/mo</span>
            <span className="text-[11px] text-slate-400 block mt-1">Super Admin dynamic pricing</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Configured Premium Plus Rate</span>
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-amber-300 font-mono">₹{premiumPlusPlan?.monthly_price || 1999}/mo</span>
            <span className="text-[11px] text-slate-400 block mt-1">All 15 luxury templates included</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Diner Scans</span>
            <QrCode className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-white">14,892</span>
            <span className="text-[11px] text-teal-400 block mt-1">High conversion traffic</span>
          </div>
        </div>
      </div>

      {/* Quick Governance Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Subscription Pricing & Plan Engine</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Update monthly and yearly rates in Indian Rupees (₹), configure discount percentages, and grant template permissions without touching code.
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/pricing')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 self-start"
          >
            <span>Configure Pricing Matrix</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Crown className="w-4 h-4 text-emerald-400" />
              <span>15 Templates Entitlement Matrix</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Assign or move templates across Free, Premium, and Premium Plus tiers. Changes take effect on the restaurant owner dashboard immediately.
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/templates')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 self-start"
          >
            <span>Manage Template Access</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
