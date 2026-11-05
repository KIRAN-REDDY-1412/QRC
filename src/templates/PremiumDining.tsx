import React from 'react';
import { TemplateProps } from './types';
import { DietaryBadge } from '@/components/common/DietaryBadge';
import { SpiceLevel } from '@/components/common/SpiceLevel';
import { Award } from 'lucide-react';

export const PremiumDining: React.FC<TemplateProps> = ({
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
    <div className="min-h-screen bg-[#1c2229] text-slate-100 font-sans pb-28">
      {/* Bistro Header */}
      <header className="p-8 text-center border-b border-slate-700/60 bg-gradient-to-b from-[#242c35] to-[#1c2229]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Award className="w-3.5 h-3.5" /> Curated Dining Selection
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide">
          {restaurant.name}
        </h1>
        {tableNumber && (
          <p className="text-xs text-slate-400 font-mono mt-1">Seated at {tableNumber}</p>
        )}
      </header>

      {/* Structured Category Selector */}
      <nav className="sticky top-0 z-20 bg-[#1c2229]/95 backdrop-blur border-b border-slate-700 px-4 py-3 overflow-x-auto no-scrollbar">
        <div className="max-w-4xl mx-auto flex gap-2">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg uppercase tracking-wider transition ${
              selectedCategory === 'all'
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Courses
          </button>
          {filteredCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg uppercase tracking-wider whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Multi-column Bistro Cards */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        {filteredCategories.map(cat => {
          if (selectedCategory !== 'all' && selectedCategory !== cat.id) return null;
          const catItems = getFilteredItems(cat.id);
          if (catItems.length === 0) return null;

          return (
            <section key={cat.id} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <h2 className="text-lg font-serif font-bold text-white">{cat.name}</h2>
                <span className="text-xs font-mono text-slate-400">{catItems.length} dishes</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {catItems.map(item => (
                  <div
                    key={item.id}
                    className="bg-[#242c35] p-4 rounded-xl border border-slate-700/80 shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <DietaryBadge type={item.dietary_type} />
                          <h3 className="font-semibold text-sm text-slate-100">{item.name}</h3>
                        </div>
                        <SpiceLevel level={item.spice_level} />
                      </div>
                      {item.description && (
                        <p className="text-xs text-slate-400 mt-2 pl-6 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-slate-700/60 flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-white">₹{item.price}</span>
                      {item.is_featured && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                          Bistro Favorite
                        </span>
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
