import React from 'react';
import { TemplateProps } from './types';
import { DietaryBadge } from '@/components/common/DietaryBadge';
import { SpiceLevel } from '@/components/common/SpiceLevel';
import { Sparkles } from 'lucide-react';

export const RoyalRestaurant: React.FC<TemplateProps> = ({
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
    <div className="min-h-screen bg-[#24130d] text-[#faedd4] font-serif pb-32">
      {/* Royal Palace Arch Header */}
      <header className="relative pt-16 pb-12 px-6 text-center border-b-2 border-[#b8860b] bg-gradient-to-b from-[#381e14] via-[#2a160f] to-[#24130d]">
        <div className="inline-block px-4 py-1 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/40 text-[#f59e0b] text-xs font-sans uppercase tracking-[0.25em] mb-3">
          शाही दावत • Imperial Feast
        </div>
        <h1 className="text-3xl md:text-5xl font-royal font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#fcd34d] via-[#fbbf24] to-[#d97706] drop-shadow-lg">
          {restaurant.name}
        </h1>
        {restaurant.tagline && (
          <p className="text-xs md:text-sm text-[#dec29b] mt-2 italic max-w-md mx-auto">
            {restaurant.tagline}
          </p>
        )}
        {tableNumber && (
          <div className="mt-3">
            <span className="inline-block px-3 py-1 bg-[#47261a] border border-[#d97706]/40 text-xs font-sans rounded-md text-[#fbbf24]">
              दीवान-ए-खास • {tableNumber}
            </span>
          </div>
        )}
      </header>

      {/* Saffron Jali Category Navigation */}
      <nav className="sticky top-0 z-30 bg-[#24130d]/95 backdrop-blur border-b border-[#b8860b]/40 px-4 py-3 overflow-x-auto no-scrollbar">
        <div className="max-w-4xl mx-auto flex gap-3 justify-start md:justify-center">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-4 py-1.5 text-xs font-sans font-bold uppercase tracking-wider rounded-lg transition ${
              selectedCategory === 'all'
                ? 'bg-[#d97706] text-white shadow-md shadow-[#d97706]/30'
                : 'text-[#dec29b] hover:bg-[#381e14] border border-[#b8860b]/30'
            }`}
          >
            संपूर्ण मेनू (All)
          </button>
          {filteredCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-1.5 text-xs font-sans font-bold uppercase tracking-wider whitespace-nowrap rounded-lg transition ${
                selectedCategory === cat.id
                  ? 'bg-[#d97706] text-white shadow-md shadow-[#d97706]/30'
                  : 'text-[#dec29b] hover:bg-[#381e14] border border-[#b8860b]/30'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Royal Heritage Dishes */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-12">
        {filteredCategories.map(cat => {
          if (selectedCategory !== 'all' && selectedCategory !== cat.id) return null;
          const catItems = getFilteredItems(cat.id);
          if (catItems.length === 0) return null;

          return (
            <section key={cat.id} className="space-y-6">
              <div className="text-center relative py-2">
                <h2 className="text-2xl font-royal font-bold text-[#fbbf24] tracking-wider uppercase inline-block bg-[#24130d] px-6 relative z-10">
                  {cat.name}
                </h2>
                <div className="absolute top-1/2 left-0 right-0 h-px bg-[#b8860b]/40 -z-0" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {catItems.map(item => (
                  <div
                    key={item.id}
                    className="bg-[#2e1911] p-5 rounded-xl border border-[#b8860b]/30 shadow-md flex flex-col justify-between hover:border-[#fbbf24] transition duration-300"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <DietaryBadge type={item.dietary_type} />
                          <h3 className="font-bold text-base text-[#fef3c7]">{item.name}</h3>
                        </div>
                        <SpiceLevel level={item.spice_level} />
                      </div>
                      {item.description && (
                        <p className="text-xs text-[#d1b99a] mt-2 pl-6 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#b8860b]/20 flex items-center justify-between">
                      <span className="font-sans font-extrabold text-base text-[#fbbf24]">₹{item.price}</span>
                      {item.is_featured && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-[#f59e0b] bg-[#f59e0b]/10 px-2.5 py-0.5 rounded-full border border-[#f59e0b]/30">
                          <Sparkles className="w-3 h-3" /> शाही पसंद
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
