import React from 'react';
import { TemplateProps } from './types';
import { DietaryBadge } from '@/components/common/DietaryBadge';
import { SpiceLevel } from '@/components/common/SpiceLevel';

export const SimpleRestaurant: React.FC<TemplateProps> = ({
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
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-24">
      {/* Top Banner / Brand Bar */}
      <header className="bg-slate-900 text-white p-4 sticky top-0 z-30 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          {restaurant.logo_url && (
            <img src={restaurant.logo_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-white" />
          )}
          <div>
            <h1 className="text-base font-bold leading-tight">{restaurant.name}</h1>
            <p className="text-xs text-slate-400 truncate max-w-[200px]">{restaurant.city || 'India'}</p>
          </div>
        </div>
        {tableNumber && (
          <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500 text-slate-950 rounded">
            {tableNumber}
          </span>
        )}
      </header>

      {/* Pill Category Selector */}
      <div className="sticky top-[64px] z-20 bg-slate-50 border-b border-slate-200 px-4 py-2.5 overflow-x-auto no-scrollbar flex gap-2">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-300 text-slate-700'
          }`}
        >
          All
        </button>
        {filteredCategories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-300 text-slate-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* List items */}
      <main className="max-w-2xl mx-auto px-4 py-6 divide-y divide-slate-100">
        {filteredCategories.map(cat => {
          if (selectedCategory !== 'all' && selectedCategory !== cat.id) return null;
          const catItems = getFilteredItems(cat.id);
          if (catItems.length === 0) return null;

          return (
            <section key={cat.id} className="pt-6 pb-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                {cat.name} ({catItems.length})
              </h2>

              <div className="space-y-3">
                {catItems.map(item => (
                  <div 
                    key={item.id} 
                    className={`flex items-start justify-between py-2.5 border-b border-dashed border-slate-200 last:border-0 ${
                      !item.is_available ? 'opacity-40' : ''
                    }`}
                  >
                    <div className="flex-1 pr-3">
                      <div className="flex items-center gap-2">
                        <DietaryBadge type={item.dietary_type} />
                        <h3 className="font-semibold text-sm text-slate-900">{item.name}</h3>
                        <SpiceLevel level={item.spice_level} />
                      </div>
                      {item.description && (
                        <p className="text-xs text-slate-500 mt-1 leading-normal pl-6">{item.description}</p>
                      )}
                      {!item.is_available && (
                        <span className="inline-block mt-1 pl-6 text-[11px] font-bold text-red-600">Unavailable</span>
                      )}
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <span className="font-bold text-sm text-slate-900">₹{item.price}</span>
                      {item.discount_price && (
                        <span className="text-[11px] line-through text-slate-400">₹{item.discount_price}</span>
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
