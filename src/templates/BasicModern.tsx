import React from 'react';
import { TemplateProps } from './types';
import { DietaryBadge } from '@/components/common/DietaryBadge';
import { SpiceLevel } from '@/components/common/SpiceLevel';

export const BasicModern: React.FC<TemplateProps> = ({
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">
      {/* Modern Card Banner */}
      <div className="bg-white border-b border-slate-200 px-4 py-6 text-center">
        {restaurant.logo_url && (
          <img src={restaurant.logo_url} alt="" className="w-16 h-16 mx-auto rounded-2xl object-cover shadow-sm mb-3" />
        )}
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">{restaurant.name}</h1>
        {restaurant.tagline && (
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">{restaurant.tagline}</p>
        )}
        {tableNumber && (
          <div className="mt-2 inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full border border-slate-200">
            {tableNumber}
          </div>
        )}
      </div>

      {/* Horizontal Scroll Categories */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
            selectedCategory === 'all'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Items
        </button>
        {filteredCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition ${
              selectedCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Modern Card Grid */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {filteredCategories.map(cat => {
          if (selectedCategory !== 'all' && selectedCategory !== cat.id) return null;
          const catItems = getFilteredItems(cat.id);
          if (catItems.length === 0) return null;

          return (
            <div key={cat.id}>
              <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center justify-between">
                <span>{cat.name}</span>
                <span className="text-xs font-medium text-slate-400">{catItems.length} dishes</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {catItems.map(item => (
                  <div 
                    key={item.id}
                    className={`bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between transition hover:border-emerald-300 ${
                      !item.is_available ? 'opacity-50' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <DietaryBadge type={item.dietary_type} />
                          <h3 className="font-semibold text-sm text-slate-900">{item.name}</h3>
                        </div>
                        <SpiceLevel level={item.spice_level} />
                      </div>
                      {item.caption && (
                        <p className="text-[11px] font-medium text-amber-600 mt-0.5 italic">{item.caption}</p>
                      )}
                      {item.description && (
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{item.description}</p>
                      )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-sm text-slate-900">₹{item.price}</span>
                        {item.discount_price && (
                          <span className="text-xs line-through text-slate-400">₹{item.discount_price}</span>
                        )}
                      </div>
                      {!item.is_available ? (
                        <span className="text-[11px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">Sold Out</span>
                      ) : item.is_featured ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Chef's Pick</span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
};
