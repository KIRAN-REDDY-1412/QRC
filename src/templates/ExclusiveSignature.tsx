import React from 'react';
import { TemplateProps } from './types';
import { DietaryBadge } from '@/components/common/DietaryBadge';
import { SpiceLevel } from '@/components/common/SpiceLevel';
import { ShieldCheck } from 'lucide-react';

export const ExclusiveSignature: React.FC<TemplateProps> = ({
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
    <div className="min-h-screen bg-[#07080a] text-slate-200 font-sans pb-32">
      {/* Platinum Crest Header */}
      <header className="relative pt-16 pb-12 px-6 text-center border-b border-slate-800 bg-gradient-to-b from-[#101217] via-[#0b0c0f] to-[#07080a]">
        <div className="w-14 h-14 mx-auto rounded-full bg-slate-800/80 border border-slate-600 flex items-center justify-center text-slate-300 shadow-2xl mb-4">
          <ShieldCheck className="w-7 h-7 text-slate-300" />
        </div>
        <span className="text-[10px] uppercase font-mono tracking-[0.4em] text-slate-400 font-semibold block mb-2">
          PRIVATE SIGNATURE COLLECTION
        </span>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-wider">
          {restaurant.name}
        </h1>
        {restaurant.tagline && (
          <p className="text-xs md:text-sm text-slate-400 italic font-serif mt-2 max-w-md mx-auto">
            {restaurant.tagline}
          </p>
        )}
        {tableNumber && (
          <div className="mt-4">
            <span className="px-3.5 py-1 text-xs font-mono rounded-full border border-slate-700 bg-slate-800/50 text-slate-300">
              VIP SUITE • {tableNumber}
            </span>
          </div>
        )}
      </header>

      {/* Platinum Ribbon Navigation */}
      <nav className="sticky top-0 z-30 bg-[#07080a]/95 backdrop-blur border-b border-slate-800 px-4 py-3 overflow-x-auto no-scrollbar">
        <div className="max-w-4xl mx-auto flex gap-3 justify-start md:justify-center">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-4 py-1.5 text-xs font-mono uppercase tracking-widest rounded-full transition ${
              selectedCategory === 'all'
                ? 'bg-slate-200 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            ALL
          </button>
          {filteredCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-1.5 text-xs font-mono uppercase tracking-widest whitespace-nowrap rounded-full transition ${
                selectedCategory === cat.id
                  ? 'bg-slate-200 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Signature Items List */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-14">
        {filteredCategories.map(cat => {
          if (selectedCategory !== 'all' && selectedCategory !== cat.id) return null;
          const catItems = getFilteredItems(cat.id);
          if (catItems.length === 0) return null;

          return (
            <section key={cat.id} className="space-y-6">
              <div className="flex items-baseline justify-between border-b border-slate-800 pb-2">
                <h2 className="text-xl font-serif font-bold text-white tracking-wide">{cat.name}</h2>
                <span className="text-xs font-mono text-slate-500">{catItems.length} SELECTIONS</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {catItems.map(item => (
                  <div
                    key={item.id}
                    className="bg-[#0e1014] p-5 rounded-2xl border border-slate-800/80 shadow-xl flex flex-col justify-between hover:border-slate-600 transition duration-300"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <DietaryBadge type={item.dietary_type} />
                          <h3 className="font-serif font-semibold text-base text-white">{item.name}</h3>
                        </div>
                        <SpiceLevel level={item.spice_level} />
                      </div>
                      {item.description && (
                        <p className="text-xs font-sans text-slate-400 mt-2 pl-6 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between font-mono">
                      <span className="text-base font-bold text-slate-200">₹{item.price}</span>
                      {item.is_featured && (
                        <span className="text-[10px] tracking-wider uppercase text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                          Signature Craft
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
