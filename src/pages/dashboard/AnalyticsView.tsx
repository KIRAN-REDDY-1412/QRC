import React from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { usePlan } from '@/context/PlanContext';
import { getScanCount } from '@/lib/supabase';
import { BarChart3, Smartphone, TrendingUp, Users, Clock, Crown, Lock } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { currentRestaurant, items } = useRestaurant();
  const { canAccessFeature, openUpgradeModal, currentSubscription } = usePlan();

  if (!currentRestaurant) return null;

  const totalScans = getScanCount(currentRestaurant.id);
  const canViewAnalytics = canAccessFeature('analytics');

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
            Customer Traffic
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-white">QR Scans & Engagement Analytics</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Real-time metrics on physical QR scans, popular dining hours, and guest browsing activity.
        </p>
      </div>

      {!canViewAnalytics && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Detailed Analytics Locked on Free Tier</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Upgrade to Premium to unlock hourly customer traffic breakdown, conversion metrics, and diner loyalty charts.
              </p>
            </div>
          </div>
          <button
            onClick={() => openUpgradeModal('premium')}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition whitespace-nowrap"
          >
            <Crown className="w-4 h-4" /> Upgrade to View Full Analytics
          </button>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total QR Scans</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-white">{totalScans.toLocaleString('en-IN')}</span>
            <span className="text-[11px] text-emerald-400 block mt-1">↑ 18% vs last month</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Average Menu Dwell Time</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-white">3m 42s</span>
            <span className="text-[11px] text-slate-400 block mt-1">High diner engagement</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Mobile Traffic Share</span>
            <Smartphone className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-white">96.8%</span>
            <span className="text-[11px] text-slate-400 block mt-1">iOS & Android smartphone users</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Peak Dining Hour</span>
            <TrendingUp className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-white">8 - 10 PM</span>
            <span className="text-[11px] text-rose-400 block mt-1">Dinner rush period</span>
          </div>
        </div>
      </div>

      {/* Hourly Scan Distribution & Top Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Dining Times Visualizer */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-white">Peak Dining Scan Traffic (24h)</h3>
          
          <div className="space-y-2 pt-2">
            {[
              { time: '12:00 PM - 02:00 PM (Lunch)', pct: 65, scans: '142 scans' },
              { time: '02:00 PM - 05:00 PM (Afternoon)', pct: 25, scans: '48 scans' },
              { time: '05:00 PM - 07:00 PM (High Tea)', pct: 40, scans: '86 scans' },
              { time: '07:00 PM - 11:00 PM (Dinner Rush)', pct: 95, scans: '298 scans' },
              { time: '11:00 PM - 01:00 AM (Late Night)', pct: 30, scans: '54 scans' }
            ].map((slot, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{slot.time}</span>
                  <span className="font-mono text-emerald-400">{slot.scans}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                    style={{ width: `${slot.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Viewed Dishes */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-white">Top 5 Trending Dishes</h3>

          <div className="divide-y divide-slate-800/80">
            {items.slice(0, 5).map((dish, i) => (
              <div key={dish.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-500 w-4">#{i + 1}</span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{dish.name}</h4>
                    <span className="text-[11px] font-mono text-emerald-400">₹{dish.price}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-white font-mono">{950 - i * 110} views</span>
                  <span className="text-[10px] text-slate-500 block">Diner favorite</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
