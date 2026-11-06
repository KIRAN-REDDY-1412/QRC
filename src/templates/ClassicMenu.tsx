import React from 'react';
import { TemplateProps } from './types';
import { DietaryBadge } from '@/components/common/DietaryBadge';
import { SpiceLevel } from '@/components/common/SpiceLevel';

export const ClassicMenu: React.FC<TemplateProps> = ({
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
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2621] font-serif pb-24">
      {/* Traditional Printed Header */}
      <header className="border-b-4 border-double border-[#8b6f4e]/40 bg-[#f4efe8] py-8 px-4 text-center">
        {restaurant.logo_url && (
          <img 
            src={restaurant.logo_url} 
            alt={restaurant.name} 
            className="w-16 h-16 mx-auto rounded-full object-cover border-2 border-[#8b6f4e] mb-3 shadow-sm"
          />
        )}
        <h1 className="text-2xl md:text-3xl font-bold tracking-wider uppercase text-[#3d2b1f]">
          {restaurant.name}
        </h1>
        {restaurant.tagline && (
          <p className="text-xs md:text-sm italic text-[#7a6452] mt-1 max-w-md mx-auto">
            "{restaurant.tagline}"
          </p>
        )}
        {tableNumber && (
          <span className="inline-block mt-2 px-3 py-0.5 text-xs font-sans font-semibold uppercase tracking-widest bg-[#8b6f4e]/10 text-[#5c4033] rounded-full">
            {tableNumber}
          </span>
        )}
        <div className="w-24 h-0.5 bg-[#8b6f4e] mx-auto mt-4" />
      </header>

      {/* Classical Horizontal Ribbon Navigation */}
      <nav className="sticky top-0 z-20 bg-[#efe7dc] border-b border-[#cfbeab] px-3 py-2 overflow-x-auto no-scrollbar shadow-sm">
        <div className="flex gap-2 justify-start md:justify-center min-w-max">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded transition font-sans font-medium ${
              selectedCategory === 'all'
                ? 'bg-[#5c4033] text-white shadow-sm'
                : 'text-[#5c4033] hover:bg-[#dfd3c3]'
            }`}
          >
            All Sections
          </button>
          {filteredCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded transition font-sans font-medium ${
                selectedCategory === cat.id
                  ? 'bg-[#5c4033] text-white shadow-sm'
                  : 'text-[#5c4033] hover:bg-[#dfd3c3]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Classical Menu Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        {filteredCategories.map(cat => {
          if (selectedCategory !== 'all' && selectedCategory !== cat.id) return null;
          const catItems = getFilteredItems(cat.id);
          if (catItems.length === 0) return null;

          return (
            <section key={cat.id} className="space-y-4">
              <div className="text-center pb-2 border-b border-[#cfbeab]">
                <h2 className="text-xl md:text-2xl font-bold tracking-wide text-[#3d2b1f] uppercase inline-block relative px-4">
                  <span className="text-[#8b6f4e] mr-2">✦</span>
                  {cat.name}
                  <span className="text-[#8b6f4e] ml-2">✦</span>
                </h2>
                {cat.description && (
                  <p className="text-xs italic text-[#7a6452] mt-0.5">{cat.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {catItems.map(item => (
                  <div key={item.id} className={`p-2 transition-colors ${!item.is_available ? 'opacity-50 grayscale' : ''}`}>
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <DietaryBadge type={item.dietary_type} />
                        <h3 className="font-semibold text-sm md:text-base text-[#2c2621]">
                          {item.name}
                        </h3>
                        <SpiceLevel level={item.spice_level} />
                      </div>
                      <div className="flex items-baseline gap-1 font-sans font-bold text-sm text-[#5c4033] whitespace-nowrap">
                        {item.discount_price ? (
                          <>
                            <span className="text-xs line-through text-slate-400">₹{item.price}</span>
                            <span className="text-red-700">₹{item.discount_price}</span>
                          </>
                        ) : (
                          <span>₹{item.price}</span>
                        )}
                      </div>
                    </div>
                    {item.caption && (
                      <p className="text-[11px] font-semibold text-amber-700 italic pl-5 mt-0.5">
                        {item.caption}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-xs text-[#6e5d50] mt-1 leading-relaxed pl-5 font-sans">
                        {item.description}
                      </p>
                    )}
                    {!item.is_available && (
                      <span className="inline-block mt-1 pl-5 text-[11px] font-sans font-medium text-red-600">
                        Currently Sold Out
                      </span>
                    )}
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
