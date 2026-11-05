import React from 'react';
import { TemplateProps } from './types';
import { DietaryBadge } from '@/components/common/DietaryBadge';
import { SpiceLevel } from '@/components/common/SpiceLevel';
import { Moon } from 'lucide-react';

export const DarkFoodMenu: React.FC<TemplateProps> = ({
  restaurant,
  categories,
  items,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  dietaryFilter,
  tableNumber
}) => {
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
    <div className="min-h-screen bg-[#0d0f12] text-slate-100 font-sans pb-28">
      {/* Dark Lounge Header */}
      <header className="p-6 border-b border-slate-800/80 bg-gradient-to-b from-[#15181e] to-[#0d0f12]">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {restaurant.logo_url ? (
              <img src={restaurant.logo_url} alt="" className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-500/30" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
                <Moon className="w-6 h-6" />
              </div>
            )}
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">{restaurant.name}</h1>
              <p className="text-xs text-emerald-400 font-medium">Lounge & Dining</p>
            </div>
          </div>
          {tableNumber && (
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono font-semibold">
              {tableNumber}
            </span>
          )}
        </div>
      </header>

      {/* Sticky Category Tabs */}
      <nav className="sticky top-0 z-20 bg-[#0d0f12]/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 overflow-x-auto no-scrollbar">
        <div className="max-w-3xl mx-auto flex gap-2">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition ${
              selectedCategory === 'all'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
            }`}
          >
            All Items
          </button>
          {filteredCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Dark Cards */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {filteredCategories.map(cat => {
          if (selectedCategory !== 'all' && selectedCategory !== cat.id) return null;
          const catItems = getFilteredItems(cat.id);
          if (catItems.length === 0) return null;

          return (
            <section key={cat.id} className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 pl-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {cat.name}
              </h2>

              <div className="space-y-3">
                {catItems.map(item => (
                  <div
                    key={item.id}
                    className={`bg-[#15181e] p-4 rounded-2xl border border-slate-800/80 shadow-md flex items-center justify-between gap-4 transition hover:border-emerald-500/40 ${
                      !item.is_available ? 'opacity-40' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <DietaryBadge type={item.dietary_type} />
                        <h3 className="font-semibold text-sm text-slate-100">{item.name}</h3>
                        <SpiceLevel level={item.spice_level} />
                      </div>
                      {item.description && (
                        <p className="text-xs text-slate-400 mt-1 pl-6 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-emerald-400 font-mono">₹{item.price}</span>
                      {!item.is_available && (
                        <p className="text-[10px] text-red-400 font-bold uppercase mt-1">Out of stock</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
};
