import React from 'react';
import { TemplateProps } from './types';
import { DietaryBadge } from '@/components/common/DietaryBadge';
import { SpiceLevel } from '@/components/common/SpiceLevel';

export const GlassmorphismMenu: React.FC<TemplateProps> = ({
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
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#311042] text-slate-100 font-sans pb-32 relative overflow-hidden">
      {/* Dynamic Ambient Blur Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-80 right-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      
      {/* Frosted Glass Header */}
      <header className="relative z-10 pt-14 pb-8 px-6 text-center">
        <div className="max-w-xl mx-auto backdrop-blur-xl bg-white/10 p-6 rounded-3xl border border-white/20 shadow-2xl">
          {restaurant.logo_url && (
            <img src={restaurant.logo_url} alt="" className="w-16 h-16 mx-auto rounded-2xl object-cover mb-3 shadow-lg ring-2 ring-white/30" />
          )}
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
            {restaurant.name}
          </h1>
          {restaurant.tagline && (
            <p className="text-xs text-purple-200 mt-1 max-w-sm mx-auto">{restaurant.tagline}</p>
          )}
          {tableNumber && (
            <div className="mt-3">
              <span className="px-3 py-1 bg-white/15 backdrop-blur border border-white/30 text-xs font-semibold rounded-full text-white">
                {tableNumber}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Floating Glass Categories */}
      <nav className="sticky top-2 z-30 px-4 py-2 overflow-x-auto no-scrollbar">
        <div className="max-w-2xl mx-auto backdrop-blur-2xl bg-black/40 border border-white/15 p-2 rounded-2xl flex gap-2 shadow-2xl">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl transition ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            All Items
          </button>
          {filteredCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Glassmorphic Item Cards */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 py-8 space-y-10">
        {filteredCategories.map(cat => {
          if (selectedCategory !== 'all' && selectedCategory !== cat.id) return null;
          const catItems = getFilteredItems(cat.id);
          if (catItems.length === 0) return null;

          return (
            <section key={cat.id} className="space-y-4">
              <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2 pl-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                {cat.name}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {catItems.map(item => (
                  <div
                    key={item.id}
                    className="backdrop-blur-xl bg-white/[0.08] hover:bg-white/[0.12] rounded-3xl p-5 border border-white/15 shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <DietaryBadge type={item.dietary_type} />
                          <h3 className="font-bold text-sm text-white">{item.name}</h3>
                        </div>
                        <SpiceLevel level={item.spice_level} />
                      </div>
                      {item.description && (
                        <p className="text-xs text-slate-300 mt-2 pl-6 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
                        ₹{item.price}
                      </span>
                      {item.is_featured && (
                        <span className="text-[10px] font-bold text-purple-200 bg-purple-500/20 border border-purple-400/30 px-2 py-0.5 rounded-full">
                          Signature
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
