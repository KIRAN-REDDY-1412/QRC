import React from 'react';
import { TemplateProps } from './types';
import { DietaryBadge } from '@/components/common/DietaryBadge';

export const MinimalWhite: React.FC<TemplateProps> = ({
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
    <div className="min-h-screen bg-white text-black font-sans pb-28">
      {/* Architectural Header */}
      <header className="border-b border-black/10 px-6 py-10 max-w-4xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-mono block mb-1">
            01 / MENU ARCHIVE
          </span>
          <h1 className="text-2xl md:text-3xl font-extralight tracking-tight uppercase">
            {restaurant.name}
          </h1>
          {restaurant.tagline && (
            <p className="text-xs text-neutral-500 font-light mt-1">{restaurant.tagline}</p>
          )}
        </div>
        {tableNumber && (
          <span className="font-mono text-xs uppercase px-2.5 py-1 border border-black/20 self-start md:self-auto">
            {tableNumber}
          </span>
        )}
      </header>

      {/* Minimal Sticky Nav */}
      <nav className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-black/10 px-6 py-3 overflow-x-auto no-scrollbar">
        <div className="max-w-4xl mx-auto flex gap-6">
          <button
            onClick={() => onSelectCategory('all')}
            className={`text-xs font-mono tracking-widest uppercase transition ${
              selectedCategory === 'all' ? 'font-bold underline underline-offset-8 text-black' : 'text-neutral-400'
            }`}
          >
            ALL
          </button>
          {filteredCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`text-xs font-mono tracking-widest uppercase whitespace-nowrap transition ${
                selectedCategory === cat.id ? 'font-bold underline underline-offset-8 text-black' : 'text-neutral-400'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Minimal Items Grid */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-12">
        {filteredCategories.map(cat => {
          if (selectedCategory !== 'all' && selectedCategory !== cat.id) return null;
          const catItems = getFilteredItems(cat.id);
          if (catItems.length === 0) return null;

          return (
            <section key={cat.id} className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-black pb-2">
                <h2 className="text-sm font-mono uppercase tracking-widest font-semibold">{cat.name}</h2>
                <span className="text-[11px] font-mono text-neutral-400">{catItems.length} SELECTIONS</span>
              </div>

              <div className="space-y-4">
                {catItems.map(item => (
                  <div key={item.id} className={`flex items-start justify-between py-2 border-b border-neutral-100 ${!item.is_available ? 'opacity-30' : ''}`}>
                    <div className="pr-4">
                      <div className="flex items-center gap-2">
                        <DietaryBadge type={item.dietary_type} />
                        <h3 className="text-sm font-medium tracking-tight text-neutral-900">{item.name}</h3>
                      </div>
                      {item.description && (
                        <p className="text-xs text-neutral-500 font-light mt-1 pl-6 max-w-lg leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="font-mono text-sm font-medium whitespace-nowrap text-right">
                      ₹{item.price}
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
