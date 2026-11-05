import React from 'react';
import { TemplateProps } from './types';
import { DietaryBadge } from '@/components/common/DietaryBadge';
import { SpiceLevel } from '@/components/common/SpiceLevel';
import { Sparkles } from 'lucide-react';

export const ModernFoodGallery: React.FC<TemplateProps> = ({
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
    <div className="min-h-screen bg-neutral-900 text-white font-sans pb-28">
      {/* Visual Hero Header */}
      <div className="relative h-60 w-full overflow-hidden">
        {restaurant.banner_url ? (
          <img src={restaurant.banner_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-emerald-800 to-teal-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent" />
        
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="flex items-center gap-3">
            {restaurant.logo_url && (
              <img 
                src={restaurant.logo_url} 
                alt="" 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-xl"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-white drop-shadow-sm">{restaurant.name}</h1>
                <span className="p-1 bg-amber-500/20 text-amber-400 rounded-lg">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
              </div>
              {restaurant.tagline && (
                <p className="text-xs text-neutral-300 line-clamp-1 mt-0.5">{restaurant.tagline}</p>
              )}
            </div>
          </div>
          {tableNumber && (
            <span className="px-3 py-1 bg-white/10 backdrop-blur text-xs font-semibold rounded-full border border-white/20">
              {tableNumber}
            </span>
          )}
        </div>
      </div>

      {/* Floating Category Pills */}
      <div className="sticky top-0 z-30 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 px-4 py-3 flex gap-2.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-amber-400 text-neutral-950 font-bold shadow-lg shadow-amber-400/20'
              : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
          }`}
        >
          All Feasts
        </button>
        {filteredCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-lg shadow-amber-400/20'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Photography Cards */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-10">
        {filteredCategories.map(cat => {
          if (selectedCategory !== 'all' && selectedCategory !== cat.id) return null;
          const catItems = getFilteredItems(cat.id);
          if (catItems.length === 0) return null;

          return (
            <div key={cat.id}>
              <div className="flex items-baseline justify-between mb-4 border-b border-neutral-800 pb-2">
                <h2 className="text-lg font-bold text-white tracking-wide">{cat.name}</h2>
                <span className="text-xs text-neutral-500 font-medium">{catItems.length} items</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {catItems.map(item => (
                  <div
                    key={item.id}
                    className={`bg-neutral-800/80 rounded-2xl overflow-hidden border border-neutral-700/60 shadow-lg flex flex-col justify-between group transition hover:border-amber-400/50 ${
                      !item.is_available ? 'opacity-50' : ''
                    }`}
                  >
                    {item.image_url && (
                      <div className="relative h-44 w-full overflow-hidden bg-neutral-900">
                        <img 
                          src={item.image_url} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <DietaryBadge type={item.dietary_type} showLabel />
                        </div>
                        {item.is_featured && (
                          <div className="absolute top-3 right-3 bg-amber-500 text-neutral-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-md">
                            Chef's Special
                          </div>
                        )}
                        {!item.is_available && (
                          <div className="absolute inset-0 bg-neutral-950/70 flex items-center justify-center">
                            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                              Sold Out
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          {!item.image_url && <DietaryBadge type={item.dietary_type} />}
                          <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition">
                            {item.name}
                          </h3>
                          <SpiceLevel level={item.spice_level} />
                        </div>
                        {item.description && (
                          <p className="text-xs text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-700/60 flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-extrabold text-amber-400">₹{item.price}</span>
                          {item.discount_price && (
                            <span className="text-xs line-through text-neutral-500">₹{item.discount_price}</span>
                          )}
                        </div>
                        {item.preparation_time && (
                          <span className="text-[11px] text-neutral-400">⏱ {item.preparation_time}</span>
                        )}
                      </div>
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
