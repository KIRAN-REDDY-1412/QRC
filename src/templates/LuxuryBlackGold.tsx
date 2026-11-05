import React from 'react';
import { TemplateProps } from './types';
import { DietaryBadge } from '@/components/common/DietaryBadge';
import { SpiceLevel } from '@/components/common/SpiceLevel';
import { Crown } from 'lucide-react';

export const LuxuryBlackGold: React.FC<TemplateProps> = ({
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
    <div className="min-h-screen bg-[#08090b] text-[#f4eedb] font-royal pb-32">
      {/* Luxury Obsidian & Gold Crest Header */}
      <header className="relative pt-16 pb-12 px-6 text-center border-b border-[#d4af37]/30 bg-gradient-to-b from-[#14161a] via-[#0d0f12] to-[#08090b]">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#d4af37] via-[#f7e7a9] to-[#aa820a] p-0.5 shadow-luxury mb-4">
          <div className="w-full h-full rounded-full bg-[#08090b] flex items-center justify-center text-[#d4af37]">
            {restaurant.logo_url ? (
              <img src={restaurant.logo_url} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <Crown className="w-8 h-8 fill-current" />
            )}
          </div>
        </div>

        <span className="text-[10px] uppercase tracking-[0.4em] text-[#d4af37] font-semibold block mb-2 font-sans">
          LUXURY DINING EXPERIENCE
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#fef0cd] to-[#aa820a] drop-shadow-md">
          {restaurant.name}
        </h1>
        {restaurant.tagline && (
          <p className="text-xs md:text-sm font-light text-[#c2b69d] mt-2 font-serif italic max-w-lg mx-auto">
            {restaurant.tagline}
          </p>
        )}
        {tableNumber && (
          <div className="mt-4">
            <span className="inline-block px-4 py-1 border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#f5e2b3] text-xs uppercase tracking-widest font-sans rounded-full">
              {tableNumber}
            </span>
          </div>
        )}
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#d4af37]" />
          <span className="text-xs text-[#d4af37]">❖</span>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#d4af37]" />
        </div>
      </header>

      {/* Gold Foil Category Ribbon */}
      <nav className="sticky top-0 z-30 bg-[#08090b]/95 backdrop-blur-md border-b border-[#d4af37]/20 px-4 py-3 overflow-x-auto no-scrollbar">
        <div className="max-w-4xl mx-auto flex gap-3 justify-start md:justify-center">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-4 py-2 text-xs uppercase tracking-[0.2em] rounded-full transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black font-extrabold shadow-lg shadow-[#d4af37]/20'
                : 'text-[#d4af37] hover:bg-[#d4af37]/10 border border-[#d4af37]/30'
            }`}
          >
            All Courses
          </button>
          {filteredCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.2em] whitespace-nowrap rounded-full transition-all duration-300 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#aa820a] text-black font-extrabold shadow-lg shadow-[#d4af37]/20'
                  : 'text-[#d4af37] hover:bg-[#d4af37]/10 border border-[#d4af37]/30'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Luxury Black Gold Cards */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        {filteredCategories.map(cat => {
          if (selectedCategory !== 'all' && selectedCategory !== cat.id) return null;
          const catItems = getFilteredItems(cat.id);
          if (catItems.length === 0) return null;

          return (
            <section key={cat.id} className="space-y-6">
              <div className="text-center">
                <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#aa820a]">Grand Selection</span>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-wider uppercase text-white mt-1">
                  {cat.name}
                </h2>
                <div className="w-12 h-0.5 bg-[#d4af37] mx-auto mt-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {catItems.map(item => (
                  <div
                    key={item.id}
                    className="relative bg-gradient-to-b from-[#131519] to-[#0d0f12] rounded-2xl p-5 border border-[#d4af37]/25 shadow-luxury flex flex-col justify-between hover:border-[#d4af37]/70 transition-all duration-300 group"
                  >
                    <div>
                      {item.image_url && (
                        <div className="relative h-44 rounded-xl overflow-hidden mb-4 border border-[#d4af37]/20">
                          <img 
                            src={item.image_url} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-700" 
                          />
                          <div className="absolute top-2.5 left-2.5">
                            <DietaryBadge type={item.dietary_type} showLabel />
                          </div>
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          {!item.image_url && <DietaryBadge type={item.dietary_type} />}
                          <h3 className="text-base md:text-lg font-bold tracking-wide text-white group-hover:text-[#f3e1b6] transition">
                            {item.name}
                          </h3>
                        </div>
                        <SpiceLevel level={item.spice_level} />
                      </div>

                      {item.description && (
                        <p className="text-xs font-serif text-[#b8ab92] mt-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-[#d4af37]/20 flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#fef0cd]">
                          ₹{item.price}
                        </span>
                        {item.discount_price && (
                          <span className="text-xs line-through text-neutral-500 font-mono">₹{item.discount_price}</span>
                        )}
                      </div>

                      {item.is_featured && (
                        <span className="px-3 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/40">
                          Royal Signature
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
