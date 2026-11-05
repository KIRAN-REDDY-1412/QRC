import React from 'react';
import { TemplateProps } from './types';
import { DietaryBadge } from '@/components/common/DietaryBadge';
import { Wine } from 'lucide-react';

export const FineDining: React.FC<TemplateProps> = ({
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
    <div className="min-h-screen bg-[#111317] text-[#e3ded4] font-serif pb-32">
      {/* Haute Cuisine Header */}
      <header className="pt-16 pb-12 px-6 text-center max-w-2xl mx-auto border-b border-[#2d323c]">
        <span className="text-[10px] tracking-[0.4em] font-sans uppercase text-[#baa479] font-medium block mb-2">
          Degustation & A La Carte
        </span>
        <h1 className="text-3xl md:text-4xl font-normal tracking-wide text-white">
          {restaurant.name}
        </h1>
        {tableNumber && (
          <p className="text-xs font-sans text-[#baa479] mt-3 uppercase tracking-widest">
            Salon Reserve • {tableNumber}
          </p>
        )}
      </header>

      {/* Course Navigation */}
      <nav className="sticky top-0 z-30 bg-[#111317]/95 backdrop-blur border-b border-[#2d323c] px-4 py-3.5 overflow-x-auto no-scrollbar">
        <div className="max-w-3xl mx-auto flex gap-6 justify-start md:justify-center">
          <button
            onClick={() => onSelectCategory('all')}
            className={`text-xs font-sans uppercase tracking-[0.2em] pb-1 transition ${
              selectedCategory === 'all' ? 'text-white border-b border-[#baa479] font-semibold' : 'text-[#848c9c]'
            }`}
          >
            All Courses
          </button>
          {filteredCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`text-xs font-sans uppercase tracking-[0.2em] whitespace-nowrap pb-1 transition ${
                selectedCategory === cat.id ? 'text-white border-b border-[#baa479] font-semibold' : 'text-[#848c9c]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Tasting Menu Presentation */}
      <main className="max-w-3xl mx-auto px-6 py-12 space-y-16">
        {filteredCategories.map(cat => {
          if (selectedCategory !== 'all' && selectedCategory !== cat.id) return null;
          const catItems = getFilteredItems(cat.id);
          if (catItems.length === 0) return null;

          return (
            <section key={cat.id} className="space-y-8">
              <div className="text-center">
                <h2 className="text-xl md:text-2xl font-light italic text-[#baa479] tracking-wider">
                  {cat.name}
                </h2>
                {cat.description && (
                  <p className="text-xs font-sans text-neutral-400 mt-1 max-w-md mx-auto">{cat.description}</p>
                )}
              </div>

              <div className="divide-y divide-[#222730]">
                {catItems.map(item => (
                  <div key={item.id} className="py-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                    <div className="flex-1 pr-6">
                      <div className="flex items-center gap-2">
                        <DietaryBadge type={item.dietary_type} />
                        <h3 className="text-base md:text-lg font-normal text-white">{item.name}</h3>
                      </div>
                      {item.description && (
                        <p className="text-xs font-sans text-[#97a0af] mt-1.5 pl-6 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                      {item.is_featured && (
                        <div className="flex items-center gap-1.5 text-[11px] font-sans text-[#baa479] mt-2 pl-6">
                          <Wine className="w-3.5 h-3.5" />
                          <span>Chef's recommended wine pairing available</span>
                        </div>
                      )}
                    </div>

                    <div className="font-sans font-light text-base text-[#baa479] pl-6 md:pl-0 whitespace-nowrap">
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
