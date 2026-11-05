import React, { useState } from 'react';
import { TemplateProps } from './types';
import { DietaryBadge } from '@/components/common/DietaryBadge';
import { SpiceLevel } from '@/components/common/SpiceLevel';
import { Activity, Clock, Info } from 'lucide-react';
import { MenuItem } from '@/types';

export const AdvancedFoodShowcase: React.FC<TemplateProps> = ({
  restaurant,
  categories,
  items,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  dietaryFilter,
  tableNumber
}) => {
  const [selectedItemForInfo, setSelectedItemForInfo] = useState<MenuItem | null>(null);

  const filteredCategories = categories.filter(c => c.is_active);

  const getFilteredItems = (categoryId: string) => {
    return items.filter(item => {
      if (item.category_id !== categoryId) return false;
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !item.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (dietaryFilter !== 'all' && item.dietary_type !== dietaryFilter) {
        return false;
      }
      return true;
    });
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-100 font-sans pb-32">
      {/* Culinary Lab Header */}
      <header className="p-6 border-b border-slate-800 bg-[#161a22]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{restaurant.name}</h1>
              <p className="text-xs text-teal-400 font-mono">Nutri-Smart Culinary Menu</p>
            </div>
          </div>
          {tableNumber && (
            <span className="px-3 py-1 bg-slate-800 text-teal-300 font-mono text-xs rounded-lg border border-slate-700">
              {tableNumber}
            </span>
          )}
        </div>
      </header>

      {/* Categories Bar */}
      <nav className="sticky top-0 z-30 bg-[#0f1115]/95 backdrop-blur border-b border-slate-800 px-4 py-3 overflow-x-auto no-scrollbar">
        <div className="max-w-4xl mx-auto flex gap-2">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
              selectedCategory === 'all'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            All Sections
          </button>
          {filteredCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Advanced Food Cards with Macro Nutrients */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        {filteredCategories.map(cat => {
          if (selectedCategory !== 'all' && selectedCategory !== cat.id) return null;
          const catItems = getFilteredItems(cat.id);
          if (catItems.length === 0) return null;

          return (
            <section key={cat.id} className="space-y-4">
              <h2 className="text-sm font-mono uppercase tracking-wider text-teal-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded bg-teal-400" />
                {cat.name}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {catItems.map(item => (
                  <div
                    key={item.id}
                    className="bg-[#161a22] p-4 rounded-2xl border border-slate-800 hover:border-teal-500/40 transition shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <DietaryBadge type={item.dietary_type} />
                          <h3 className="font-bold text-sm text-white">{item.name}</h3>
                        </div>
                        <SpiceLevel level={item.spice_level} />
                      </div>
                      {item.description && (
                        <p className="text-xs text-slate-400 mt-2 pl-6 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-base text-teal-300">₹{item.price}</span>
                        {item.calories && (
                          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded">
                            <Activity className="w-3 h-3 text-teal-400" /> {item.calories} kcal
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedItemForInfo(item)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="View dish details"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Dish Details Modal */}
      {selectedItemForInfo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#161a22] border border-teal-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DietaryBadge type={selectedItemForInfo.dietary_type} showLabel />
                <h3 className="text-lg font-bold text-white">{selectedItemForInfo.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedItemForInfo(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {selectedItemForInfo.image_url && (
              <img 
                src={selectedItemForInfo.image_url} 
                alt="" 
                className="w-full h-48 object-cover rounded-2xl" 
              />
            )}

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedItemForInfo.description}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <div className="bg-slate-800/60 p-2.5 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-mono block">CALORIES</span>
                <span className="text-sm font-bold text-teal-300">{selectedItemForInfo.calories || 380} kcal</span>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-mono block">PREP TIME</span>
                <span className="text-sm font-bold text-teal-300 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" /> {selectedItemForInfo.preparation_time || '15 mins'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xl font-bold font-mono text-white">₹{selectedItemForInfo.price}</span>
              <button
                onClick={() => setSelectedItemForInfo(null)}
                className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
