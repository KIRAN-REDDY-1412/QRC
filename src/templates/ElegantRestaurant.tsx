import React from 'react';
import { TemplateProps } from './types';
import { DietaryBadge } from '@/components/common/DietaryBadge';
import { SpiceLevel } from '@/components/common/SpiceLevel';

export const ElegantRestaurant: React.FC<TemplateProps> = ({
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
    <div className="min-h-screen bg-[#fcf9f2] text-[#22211f] font-serif pb-28">
      {/* Editorial Header */}
      <header className="pt-12 pb-8 px-6 text-center max-w-2xl mx-auto border-b border-[#e5dec9]">
        <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-[#9c8266] font-semibold block mb-2">
          Est. 2018 • Gastronomy Experience
        </span>
        <h1 className="text-3xl md:text-4xl font-normal tracking-tight text-[#1a1918]">
          {restaurant.name}
        </h1>
        {restaurant.tagline && (
          <p className="text-xs md:text-sm italic text-[#786a59] mt-2 font-serif">
            {restaurant.tagline}
          </p>
        )}
        {tableNumber && (
          <div className="mt-3">
            <span className="text-xs font-sans font-medium px-3 py-1 rounded-full border border-[#d6cbaf] text-[#5e4f3c]">
              {tableNumber}
            </span>
          </div>
        )}
      </header>

      {/* Understated Sticky Category Selector */}
      <nav className="sticky top-0 z-20 bg-[#fcf9f2]/95 backdrop-blur border-b border-[#e5dec9] px-4 py-3 overflow-x-auto no-scrollbar">
        <div className="flex gap-4 justify-start md:justify-center min-w-max">
          <button
            onClick={() => onSelectCategory('all')}
            className={`text-xs font-sans uppercase tracking-[0.15em] pb-1 transition-all ${
              selectedCategory === 'all'
                ? 'border-b-2 border-[#1a1918] font-bold text-[#1a1918]'
                : 'text-[#887766] hover:text-[#1a1918]'
            }`}
          >
            Full Menu
          </button>
          {filteredCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`text-xs font-sans uppercase tracking-[0.15em] pb-1 transition-all ${
                selectedCategory === cat.id
                  ? 'border-b-2 border-[#1a1918] font-bold text-[#1a1918]'
                  : 'text-[#887766] hover:text-[#1a1918]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Editorial Menu List */}
      <main className="max-w-3xl mx-auto px-6 py-10 space-y-12">
        {filteredCategories.map(cat => {
          if (selectedCategory !== 'all' && selectedCategory !== cat.id) return null;
          const catItems = getFilteredItems(cat.id);
          if (catItems.length === 0) return null;

          return (
            <section key={cat.id} className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl md:text-2xl font-serif font-normal italic tracking-wide text-[#2b2723]">
                  {cat.name}
                </h2>
                <div className="w-8 h-px bg-[#c2b29c] mx-auto mt-2" />
              </div>

              <div className="divide-y divide-[#ece5d4]">
                {catItems.map(item => (
                  <div key={item.id} className={`py-4 flex flex-col md:flex-row md:items-baseline justify-between gap-4 ${!item.is_available ? 'opacity-40' : ''}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <DietaryBadge type={item.dietary_type} />
                        <h3 className="font-serif text-base md:text-lg font-medium text-[#1c1a17]">
                          {item.name}
                        </h3>
                        <SpiceLevel level={item.spice_level} />
                      </div>
                      {item.description && (
                        <p className="text-xs font-sans text-[#786b5b] mt-1 leading-relaxed pl-5 max-w-xl">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pl-5 md:pl-0 font-sans font-semibold text-sm text-[#2b2621]">
                      {item.discount_price ? (
                        <>
                          <span className="text-xs line-through text-[#a39480]">₹{item.price}</span>
                          <span className="text-[#a83232]">₹{item.discount_price}</span>
                        </>
                      ) : (
                        <span>₹{item.price}</span>
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
