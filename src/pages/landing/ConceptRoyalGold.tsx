import React, { useState } from 'react';
import { 
  Sparkles, 
  Crown, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Palette, 
  Award, 
  Flame, 
  Wine, 
  Eye, 
  SlidersHorizontal,
  ChevronRight,
  Heart
} from 'lucide-react';

interface ConceptProps {
  onSelectConcept?: (name: string) => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const ConceptRoyalGold: React.FC<ConceptProps> = ({ onSelectConcept, onOpenAuth }) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // Before / After comparison slider
  const [activeTastingTab, setActiveTastingTab] = useState<'shahi' | 'biryani' | 'dessert'>('shahi');

  return (
    <div className="min-h-screen bg-[#070709] text-[#f7eedd] font-serif selection:bg-amber-500 selection:text-black relative overflow-hidden">
      {/* Golden Particle & Ambient Glow Layers */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-amber-500/15 via-amber-600/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#d9770615_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono uppercase tracking-widest backdrop-blur-md">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Grand Indian Gastronomy & Haute Dining</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#faedd4] tracking-tight leading-[1.05]">
            A Regal Digital Showcase <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
              Worthy of Royalty.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-stone-400 font-sans max-w-2xl mx-auto leading-relaxed">
            Crafted for royal Awadhi palaces, fine-dining restaurants, and five-star lounges across India. Turn printed menu cards into a gilded sensory feast on every table.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 font-sans">
            <button
              onClick={() => onOpenAuth ? onOpenAuth('register') : null}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-xs sm:text-sm tracking-wide transition shadow-xl shadow-amber-500/20 transform active:scale-95"
            >
              <span>Begin Royal Onboarding</span>
              <ArrowRight className="w-4 h-4 inline-block ml-2" />
            </button>

            <a
              href="#before-after"
              className="px-6 py-3.5 rounded-2xl bg-stone-900/90 hover:bg-stone-800 text-amber-300 text-xs sm:text-sm font-bold border border-amber-500/30 transition flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Compare Before & After</span>
            </a>
          </div>
        </div>

        {/* INTERACTIVE BEFORE & AFTER SLIDER */}
        <div id="before-after" className="mt-16 max-w-4xl mx-auto font-sans">
          <div className="text-center mb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">Interactive Reality Check</span>
            <h3 className="text-xl font-bold text-white mt-1">Slide to compare: Faded Paper vs. Royal SmartQR</h3>
          </div>

          <div className="relative h-[420px] rounded-3xl overflow-hidden border-4 border-amber-500/30 shadow-2xl select-none">
            {/* Background Layer: Royal SmartQR Menu */}
            <div className="absolute inset-0 bg-stone-950 p-6 flex flex-col justify-between text-white">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold tracking-widest block uppercase">SmartQR Digital Menu</span>
                  <h4 className="font-serif font-black text-2xl text-amber-200">Saffron Heritage Darbar</h4>
                </div>
                <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full font-mono border border-amber-500/40 font-bold">
                  Instant Table QR • 0% Paper Waste
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 my-auto">
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-amber-500/30 flex items-center gap-4">
                  <img src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80" alt="" className="w-16 h-16 rounded-xl object-cover border border-amber-500/40" />
                  <div>
                    <h5 className="font-bold text-sm text-white">Shahi Galouti Kebab</h5>
                    <p className="text-xs text-stone-400">32 hand-ground royal spices</p>
                    <span className="text-amber-400 font-bold text-sm">₹495</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-900/90 border border-amber-500/30 flex items-center gap-4">
                  <img src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80" alt="" className="w-16 h-16 rounded-xl object-cover border border-amber-500/40" />
                  <div>
                    <h5 className="font-bold text-sm text-white">Awadhi Dum Biryani</h5>
                    <p className="text-xs text-stone-400">Sealed in clay handi with saffron</p>
                    <span className="text-amber-400 font-bold text-sm">₹550</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-400 border-t border-amber-500/20 pt-3">
                <span>Includes High-Res Photography & Allergen Badges</span>
                <span className="text-emerald-400 font-bold">Instant Price Updates Anytime</span>
              </div>
            </div>

            {/* Foreground Cut Layer: Torn Grease Faded Paper Menu */}
            <div 
              className="absolute inset-y-0 left-0 bg-[#e8e0cc] text-stone-900 p-6 flex flex-col justify-between overflow-hidden border-r-4 border-amber-400"
              style={{ width: `${sliderPos}%` }}
            >
              <div className="flex items-center justify-between border-b border-stone-400/40 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-stone-600 font-bold tracking-widest block uppercase">Printed Paper Menu Card</span>
                  <h4 className="font-serif font-black text-2xl text-stone-900">Traditional Faded Menu</h4>
                </div>
                <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-mono font-bold">
                  Stained • High Reprint Costs
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 my-auto opacity-75">
                <div className="p-4 rounded-xl bg-stone-200/80 border border-stone-300">
                  <h5 className="font-bold text-sm line-through">Galouti Kebab (Price Scratched)</h5>
                  <p className="text-xs text-stone-600">Old price ₹380 &rarr; New written ₹495 with pen</p>
                  <span className="text-stone-700 font-bold text-xs mt-1 block">No food photo</span>
                </div>
                <div className="p-4 rounded-xl bg-stone-200/80 border border-stone-300">
                  <h5 className="font-bold text-sm">Chicken Biryani</h5>
                  <p className="text-xs text-stone-600">Grease fingerprints on laminated plastic</p>
                  <span className="text-stone-700 font-bold text-xs mt-1 block">Must reprint entire batch to change ₹10</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-600 border-t border-stone-400/40 pt-3">
                <span>₹25,000+ Annual Paper Printing Costs</span>
                <span className="text-red-700 font-bold">Unsanitary for Diners</span>
              </div>
            </div>

            {/* Slider Control Line & Thumb */}
            <div 
              className="absolute inset-y-0 w-1 bg-amber-400 cursor-ew-resize pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-xs shadow-xl border-2 border-white">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
            </div>

            {/* Hidden Range Input for Scrubbing */}
            <input
              type="range"
              min="10"
              max="90"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Interactive Tasting Card Showcase */}
      <section className="py-20 max-w-5xl mx-auto px-4 font-sans">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">Interactive Tasting Notes</span>
          <h2 className="text-3xl font-serif font-black text-amber-100">Click a Dish to Inspect Culinary Heritage</h2>
        </div>

        {/* Dish Tab Selectors */}
        <div className="flex justify-center gap-3 mb-8">
          {[
            { id: 'shahi', label: 'Awadhi Galouti Kebab', price: '₹495' },
            { id: 'biryani', label: 'Dum Pukht Gosht Biryani', price: '₹590' },
            { id: 'dessert', label: 'Zafrani Shahi Tukda', price: '₹295' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTastingTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                activeTastingTab === tab.id
                  ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-stone-900/90 text-stone-400 border-stone-800 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-75 font-mono">{tab.price}</span>
            </button>
          ))}
        </div>

        {/* Selected Tasting Card Display */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-stone-950 via-[#110e0c] to-stone-950 border-2 border-amber-500/40 shadow-2xl flex flex-col md:flex-row items-center gap-8">
          <img 
            src={
              activeTastingTab === 'shahi' 
                ? "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"
                : activeTastingTab === 'biryani'
                ? "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
                : "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80"
            }
            alt=""
            className="w-full md:w-72 h-64 rounded-2xl object-cover border-2 border-amber-500/30 shadow-xl"
          />

          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
              <Crown className="w-4 h-4" />
              <span>Nawab of Awadh Signature Degustation</span>
            </div>

            <h3 className="font-serif font-black text-2xl sm:text-3xl text-amber-100">
              {activeTastingTab === 'shahi' && 'Awadhi Melt-in-Mouth Galouti Kebab'}
              {activeTastingTab === 'biryani' && 'Dum Pukht Gosht Biryani in Clay Handi'}
              {activeTastingTab === 'dessert' && 'Zafrani Shahi Tukda with 24K Edible Silver'}
            </h3>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
              {activeTastingTab === 'shahi' && 'Finely minced mutton smoked with cloves and 32 proprietary spices, cooked on slow charcoal and served on coin-sized ulta tawa parathas with fresh mint chutney.'}
              {activeTastingTab === 'biryani' && 'Aged long-grain basmati rice layered with prime cut pasture-raised lamb, marinated for 24 hours in brown onions, saffron, and sweet rose essence sealed with dough in earthen pots.'}
              {activeTastingTab === 'dessert' && 'Crisp ghee-fried brioche soaked in cardamom saffron syrup, smothered with thickened saffron malai rabri and garnished with edible silver vark.'}
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2 text-xs font-sans">
              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                <span className="text-[10px] text-stone-500 block uppercase font-mono">Wine Pairing</span>
                <span className="font-bold text-amber-200">Sula Dindori Shiraz</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                <span className="text-[10px] text-stone-500 block uppercase font-mono">Spice Heat</span>
                <span className="font-bold text-amber-400">Mild • Royal Dum</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                <span className="text-[10px] text-stone-500 block uppercase font-mono">Prep Technique</span>
                <span className="font-bold text-amber-200">Dum Pukht</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Select Banner */}
      <div className="p-8 bg-[#0a090b] border-t border-amber-500/20 text-center font-sans">
        <button
          onClick={() => onSelectConcept ? onSelectConcept('Royal-Gold') : null}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm transition shadow-xl shadow-amber-500/30 inline-flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>Select Concept 2 (Royal Heritage & Velvet Gold)</span>
        </button>
      </div>
    </div>
  );
};