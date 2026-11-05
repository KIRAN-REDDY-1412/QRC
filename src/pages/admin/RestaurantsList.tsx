import React, { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { usePlan } from '@/context/PlanContext';
import { Store, ExternalLink, Search, CheckCircle2, XCircle } from 'lucide-react';

export const RestaurantsList: React.FC = () => {
  const { restaurants, updateRestaurantProfile } = useRestaurant();
  const { plans } = usePlan();
  const [search, setSearch] = useState('');

  const filtered = restaurants.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.city?.toLowerCase().includes(search.toLowerCase()) ||
    r.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
              Account Governance
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">All Registered Restaurants ({restaurants.length})</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor restaurant accounts, slugs, cities across India, and active digital menus.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 text-white placeholder-slate-400 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="divide-y divide-slate-800/80">
          {filtered.map(r => (
            <div key={r.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {r.logo_url ? (
                  <img src={r.logo_url} alt="" className="w-14 h-14 rounded-2xl object-cover border border-slate-800" />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                    <Store className="w-6 h-6" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white">{r.name}</h3>
                    {r.is_pure_veg && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Pure Veg
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{r.tagline || 'Dining establishment'}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono mt-1">
                    <span>{r.city}, {r.state}</span>
                    <span>•</span>
                    <span>URL: /menu/{r.slug}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`/menu/${r.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
                >
                  <span>Open Menu</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
