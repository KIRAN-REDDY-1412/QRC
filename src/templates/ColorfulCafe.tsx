import React from 'react';
import { TemplateProps } from './types';
import { DietaryBadge } from '@/components/common/DietaryBadge';
import { Coffee, Heart } from 'lucide-react';

export const ColorfulCafe: React.FC<TemplateProps> = ({
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
    <div className="min-h-screen bg-[#fff9f5] text-slate-800 font-sans pb-28">
      {/* Cheery Cafe Header */}
      <header className="p-6 text-center bg-gradient-to-r from-amber-100 via-rose-50 to-orange-100 border-b border-orange-200/60">
        <div className="w-14 h-14 mx-auto rounded-3xl bg-white shadow-md flex items-center justify-center text-orange-500 mb-2">
          {restaurant.logo_url ? (
            <img src={restaurant.logo_url} alt="" className="w-full h-full rounded-3xl object-cover" />
          ) : (
            <Coffee className="w-7 h-7" />
          )}
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">{restaurant.name}</h1>
        <p className="text-xs text-orange-700/80 font-medium mt-1">Baked with Love & Fresh Daily ☕</p>
        {tableNumber && (
          <span className="inline-block mt-2 px-3 py-1 bg-white/80 text-orange-600 text-xs font-bold rounded-full shadow-sm">
            {tableNumber}
          </span>
        )}
      </header>

      {/* Pastel Category Tabs */}
      <nav className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-orange-100 px-4 py-2.5 overflow-x-auto no-scrollbar flex gap-2">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-4 py-1.5 text-xs font-bold rounded-2xl whitespace-nowrap transition ${
            selectedCategory === 'all'
              ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
              : 'bg-orange-50 text-orange-800 hover:bg-orange-100'
          }`}
        >
          All Treats
        </button>
        {filteredCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-1.5 text-xs font-bold rounded-2xl whitespace-nowrap transition ${
              selectedCategory === cat.id
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-orange-50 text-orange-800 hover:bg-orange-100'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </nav>

      {/* Colorful Cards Grid */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {filteredCategories.map(cat => {
          if (selectedCategory !== 'all' && selectedCategory !== cat.id) return null;
          const catItems = getFilteredItems(cat.id);
          if (catItems.length === 0) return null;

          return (
            <div key={cat.id}>
              <h2 className="text-base font-extrabold text-slate-800 mb-3 flex items-center gap-2">
                <span className="p-1 rounded-lg bg-orange-100 text-orange-600">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </span>
                {cat.name}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {catItems.map(item => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-4 border-2 border-orange-100/70 shadow-sm hover:shadow-md transition hover:border-orange-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <DietaryBadge type={item.dietary_type} />
                          <h3 className="font-bold text-sm text-slate-800">{item.name}</h3>
                        </div>
                        <span className="font-extrabold text-sm text-orange-600 bg-orange-50 px-2.5 py-1 rounded-xl">
                          ₹{item.price}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                      {item.calories ? <span>🔥 {item.calories} kcal</span> : <span />}
                      {!item.is_available && (
                        <span className="font-bold text-red-500">Sold out for now</span>
                      )}
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
