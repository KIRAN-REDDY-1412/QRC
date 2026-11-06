import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  QrCode, 
  Smartphone, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Zap, 
  Globe, 
  CreditCard, 
  Utensils, 
  Play, 
  Layers,
  ChevronRight,
  TrendingUp,
  MessageCircle,
  Clock,
  Star,
  Flame,
  Volume2,
  VolumeX,
  RotateCcw,
  Plus,
  Minus,
  Maximize2,
  Sliders,
  ExternalLink,
  Compass,
  Eye,
  Crosshair,
  Sun
} from 'lucide-react';
import { ALL_TEMPLATES } from '@/lib/supabase';

interface ConceptProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const ConceptSensoryLuxury: React.FC<ConceptProps> = ({ onOpenAuth }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [activeCardModal, setActiveCardModal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'experience' | 'roi'>('overview');
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);

  // ROI State
  const [tables, setTables] = useState(28);
  const [avgTicket, setAvgTicket] = useState(1250);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Subtle Parallax calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    setMousePos({ x, y });
  };

  const handleResetMouse = () => {
    setMousePos({ x: 0, y: 0 });
    setZoomLevel(1);
  };

  // Ethereal ambient particle dust canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const motes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
      baseAlpha: number;
    }> = [];

    for (let i = 0; i < 50; i++) {
      motes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.45 - 0.1, // gently float upward like ambient dust
        r: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.5 + 0.2,
        baseAlpha: Math.random() * 0.5 + 0.2
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.x += m.vx;
        m.y += m.vy;

        if (m.y < 0) {
          m.y = h;
          m.x = Math.random() * w;
        }
        if (m.x < 0) m.x = w;
        if (m.x > w) m.x = 0;

        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = m.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  const currentTemplate = ALL_TEMPLATES[selectedTemplateIndex] || ALL_TEMPLATES[0];

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#111412] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-white relative overflow-x-hidden"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 20%, rgba(26, 38, 30, 0.55) 0%, rgba(17, 20, 18, 0.95) 75%),
          linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 120px 120px, 120px 120px'
      }}
    >
      {/* Background Star / Spore Canvas */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-0 opacity-80"
      />

      {/* Atmospheric Vertical Dividers (Exact match to reference art grid) */}
      <div className="fixed inset-0 pointer-events-none z-0 flex justify-between max-w-7xl mx-auto px-6 opacity-10">
        <div className="w-[1px] h-full bg-white" />
        <div className="w-[1px] h-full bg-white hidden md:block" />
        <div className="w-[1px] h-full bg-white hidden md:block" />
        <div className="w-[1px] h-full bg-white" />
      </div>

      {/* TOP STATUS BAR (Luxury Minimalist) */}
      <nav className="relative z-20 max-w-7xl mx-auto px-6 pt-6 pb-4 flex items-center justify-between text-xs tracking-wider">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-bold text-xs">
            ✦
          </div>
          <span className="font-medium text-white/90 uppercase tracking-widest text-[11px]">
            SmartQR &bull; Atelier Studio
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[11px] font-medium tracking-widest text-white/60 uppercase">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`transition ${activeTab === 'overview' ? 'text-white font-semibold' : 'hover:text-white'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('templates')}
            className={`transition ${activeTab === 'templates' ? 'text-white font-semibold' : 'hover:text-white'}`}
          >
            15 Themes
          </button>
          <button 
            onClick={() => setActiveTab('experience')}
            className={`transition ${activeTab === 'experience' ? 'text-white font-semibold' : 'hover:text-white'}`}
          >
            Dining Flow
          </button>
          <button 
            onClick={() => setActiveTab('roi')}
            className={`transition ${activeTab === 'roi' ? 'text-white font-semibold' : 'hover:text-white'}`}
          >
            Economics
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenAuth ? onOpenAuth('login') : null}
            className="text-[11px] text-white/70 hover:text-white font-medium uppercase tracking-widest transition px-3 py-1.5"
          >
            Sign In
          </button>
          <button
            onClick={() => onOpenAuth ? onOpenAuth('register') : null}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/25 text-white text-[11px] font-medium uppercase tracking-widest transition shadow-lg"
          >
            Start Free
          </button>
        </div>
      </nav>

      {/* MAIN HERO VIEWPORT (EXACT MATCH TO REFERENCE PHOTO COMPOSITION) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-32 min-h-[85vh] flex flex-col justify-between">
        
        {/* UPPER ROW: Headlines, Body Paragraph, Micro Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Title (Left) */}
          <div className="lg:col-span-5 space-y-4">
            <h1 className="text-4xl sm:text-6xl font-light text-white tracking-tight leading-[1.08]">
              Step into <br />
              <span className="font-normal text-white">the living world</span>
            </h1>
          </div>

          {/* Subheading & Capsule CTA (Center-Left) */}
          <div className="lg:col-span-4 space-y-6 lg:pt-3">
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light max-w-sm">
              We elevate dining tables through patient design, tactile digital craftsmanship, and a deeper kind of culinary hospitality.
            </p>

            {/* Signature Liquid Glass Pill Button with Top Rim Glow */}
            <div>
              <button 
                onClick={() => onOpenAuth ? onOpenAuth('register') : null}
                className="group relative inline-flex items-center gap-3 px-6 py-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                {/* Glowing top rim highlight */}
                <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />
                
                {/* Hamburger / Menu icon */}
                <div className="flex flex-col gap-1 w-3.5">
                  <span className="w-full h-[1.5px] bg-white/90 rounded-full" />
                  <span className="w-2.5 h-[1.5px] bg-white/90 rounded-full" />
                </div>

                <span className="text-xs font-medium text-white/90 tracking-wide">
                  Explore the work
                </span>
              </button>
            </div>
          </div>

          {/* Micro Telemetry Stats (Upper Right) */}
          <div className="lg:col-span-3 flex lg:flex-col justify-between lg:justify-start gap-6 lg:items-end text-left lg:text-right pt-2">
            <div className="space-y-1">
              <div className="flex items-center lg:justify-end gap-2 text-white/50 text-[10px] tracking-wider uppercase">
                <Crosshair className="w-3.5 h-3.5 text-emerald-400/80" />
                <span>Canopy restored</span>
              </div>
              <p className="text-sm font-light text-white tracking-wide">
                282 ha <span className="text-white/40 text-xs font-mono">&bull; 100% active</span>
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center lg:justify-end gap-2 text-white/50 text-[10px] tracking-wider uppercase">
                <Sun className="w-3.5 h-3.5 text-amber-300/80" />
                <span>Native species</span>
              </div>
              <p className="text-sm font-light text-white tracking-wide">
                43 mapped <span className="text-white/40 text-xs font-mono">&bull; 15 themes</span>
              </p>
            </div>
          </div>

        </div>

        {/* CENTER / LOWER REGION: The Cinematic 3D Sculptural Landscape & Floating White Cards */}
        <div 
          className="relative mt-8 sm:mt-16 w-full h-[520px] sm:h-[600px] rounded-[36px] overflow-hidden transition-transform duration-500 ease-out"
          style={{
            transform: `scale(${zoomLevel}) translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)`
          }}
        >
          {/* Cinematic Background Render / Moss-wood Bough Imagery */}
          <div className="absolute inset-0 bg-cover bg-center rounded-[36px] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=2000&q=85" 
              alt="Misty Moss Bough" 
              className="w-full h-full object-cover brightness-[0.78] contrast-[1.08] saturate-[1.15] scale-105 transition-transform duration-1000 ease-out"
              style={{
                transform: `translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px)`
              }}
            />
            {/* Atmospheric Muted Mist Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111412] via-transparent to-[#111412]/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111412]/60 via-transparent to-[#111412]/60" />
          </div>

          {/* Subtle Vertical Watermark on the branch (Exact match to reference art) */}
          <div className="absolute left-[54%] top-[45%] -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
            <span className="text-[10px] sm:text-xs font-mono text-white/20 tracking-[0.6em] uppercase vertical-text">
              D I S C O V E R
            </span>
          </div>

          {/* FLOATING INTERACTIVE CIRCULAR MEDIA BUTTON (Left Side) */}
          <div 
            className="absolute left-10 sm:left-24 top-[35%] -translate-y-1/2 z-20 cursor-pointer group"
            onClick={() => setActiveCardModal('audio')}
          >
            {/* Outer concentric wave ring */}
            <div className="absolute -inset-6 rounded-full border border-white/10 group-hover:border-white/20 transition-all duration-700 animate-pulse pointer-events-none" />
            
            {/* Multi-colored glowing Siri-style radial rim */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[1.5px] bg-gradient-to-tr from-cyan-400 via-indigo-500 to-amber-400 shadow-2xl transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full rounded-full bg-black/60 backdrop-blur-xl flex items-center justify-center text-white">
                <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-white ml-0.5 transition-transform group-hover:scale-110" />
              </div>
            </div>
            
            <span className="block mt-3 text-center text-[10px] font-mono tracking-widest uppercase text-white/50 group-hover:text-white/90 transition-colors">
              Play Soundscape
            </span>
          </div>

          {/* FLOATING WHITE EDITORIAL CARD 1: "Our Ethos / Let the wild lead" (Upper Center-Right) */}
          <div 
            className="absolute right-12 sm:right-56 top-8 sm:top-10 z-20 w-[240px] sm:w-[270px] bg-white text-slate-900 rounded-[28px] p-5 shadow-[0_30px_70px_rgba(0,0,0,0.65)] transition-all duration-500 hover:scale-[1.02] cursor-pointer"
            onClick={() => setActiveCardModal('ethos')}
          >
            {/* Top Thumbnail Image */}
            <div className="w-full h-28 rounded-2xl overflow-hidden mb-3.5 relative">
              <img 
                src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80" 
                alt="Moss Stones" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1 relative">
              <span className="text-[10px] font-medium text-slate-500 tracking-wider">Our Ethos</span>
              <h3 className="text-lg font-bold text-slate-900 leading-tight tracking-tight">
                Let the wild lead.
              </h3>
            </div>

            {/* Attached Circular Floating Pin Badge */}
            <div className="absolute -bottom-3 -right-3 w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-900 border border-slate-100">
              <span className="text-xs">🌱</span>
            </div>
          </div>

          {/* FLOATING WHITE EDITORIAL CARD 2: "Field Note 07 / After the Rain" (Lower Right) */}
          <div 
            className="absolute right-4 sm:right-12 bottom-8 sm:bottom-12 z-20 w-[250px] sm:w-[280px] bg-white text-slate-900 rounded-[28px] p-5 shadow-[0_30px_70px_rgba(0,0,0,0.65)] transition-all duration-500 hover:scale-[1.02] cursor-pointer"
            onClick={() => setActiveCardModal('fieldnote')}
          >
            <div className="space-y-1 mb-3.5">
              <span className="text-[10px] font-medium text-slate-500 tracking-wider">Field Note 07</span>
              <h3 className="text-lg font-bold text-slate-900 leading-tight tracking-tight">
                After the Rain
              </h3>
            </div>

            {/* Bottom Thumbnail Image */}
            <div className="w-full h-28 rounded-2xl overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=600&q=80" 
                alt="Forest Mist" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Attached Circular Floating Pin Badge */}
            <div className="absolute -bottom-3 -right-3 w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-900 border border-slate-100">
              <span className="text-xs">🌿</span>
            </div>
          </div>

        </div>

        {/* BOTTOM STUDIO DOCK (EXACT MATCH TO REFERENCE PHOTO: 23 FPS, ZOOM CONTROLS) */}
        <div className="relative z-20 pt-8 flex items-center justify-between text-xs text-white/50">
          
          {/* Bottom Left: FPS Telemetry Pill */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[11px] font-mono text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>60 FPS &bull; REALTIME</span>
            </div>
          </div>

          {/* Bottom Center: Minimalist Coordinates */}
          <div className="hidden sm:block text-[10px] font-mono tracking-widest uppercase text-white/40">
            LAT 28.6139° N &bull; LON 77.2090° E &bull; SMARTQR KINETIC ENGINE
          </div>

          {/* Bottom Right: Interactive View Controls [ - | + | ⟳ ] */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/15">
            <button 
              onClick={() => setZoomLevel(z => Math.max(0.85, z - 0.08))}
              className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setZoomLevel(z => Math.min(1.25, z + 0.08))}
              className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={handleResetMouse}
              className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition"
              title="Reset View"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

        </div>

      </section>

      {/* LUXURY TEMPLATES EDITORIAL SHOWCASE (TAB: 15 THEMES) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <span className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase">
              Curated Aesthetic Gallery
            </span>
            <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
              15 Bespoke Themes for Distinct Tables.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-white/60 max-w-md font-light">
            Every dining room has its own soul. Switch effortlessly between velvet dark mode, organic earth, and high-contrast minimal.
          </p>
        </div>

        {/* Studio Grid of 15 Themes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_TEMPLATES.map((tmpl, idx) => (
            <div 
              key={tmpl.id}
              onClick={() => setSelectedTemplateIndex(idx)}
              className={`group p-6 rounded-[32px] bg-white/[0.03] hover:bg-white/[0.06] border transition-all duration-500 cursor-pointer relative overflow-hidden backdrop-blur-xl ${
                selectedTemplateIndex === idx 
                  ? 'border-emerald-400/60 shadow-[0_20px_50px_rgba(16,185,129,0.15)] scale-[1.01]'
                  : 'border-white/10 hover:border-white/25'
              }`}
            >
              <div className="w-full h-48 rounded-2xl overflow-hidden mb-5 relative">
                <img 
                  src={tmpl.thumbnail_url} 
                  alt={tmpl.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.85]"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-mono uppercase text-white tracking-wider">
                  {tmpl.tier === 'premium_plus' ? 'Plus Tier' : tmpl.tier}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white group-hover:text-emerald-300 transition-colors">
                    {tmpl.name}
                  </h3>
                  <span className="text-xs text-white/40 font-mono">0{idx + 1}</span>
                </div>
                <p className="text-xs text-white/60 font-light leading-relaxed">
                  {tmpl.description}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40 group-hover:text-white/80 transition-colors">
                <span className="capitalize">{tmpl.vibe}</span>
                <span className="flex items-center gap-1 font-mono text-emerald-400">
                  Inspect &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TABLETOP ECONOMICS & ROI SIMULATOR */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <div className="p-8 sm:p-14 rounded-[40px] bg-white/[0.03] backdrop-blur-2xl border border-white/15 shadow-2xl space-y-10">
          <div className="text-center space-y-3">
            <span className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase">
              Financial Stewardship
            </span>
            <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
              The Economics of Patient Craft.
            </h2>
            <p className="text-xs sm:text-sm text-white/60 max-w-xl mx-auto font-light">
              By replacing re-printed paper with instant digital speed and direct bank settlements, dining rooms retain significantly more margin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Sliders */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs tracking-wider uppercase text-white/80">
                  <span>Dining Capacity</span>
                  <span className="font-mono text-emerald-400">{tables} Tables</span>
                </div>
                <input 
                  type="range"
                  min="5"
                  max="120"
                  value={tables}
                  onChange={e => setTables(Number(e.target.value))}
                  className="w-full accent-emerald-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs tracking-wider uppercase text-white/80">
                  <span>Average Table Bill</span>
                  <span className="font-mono text-emerald-400">₹{avgTicket}</span>
                </div>
                <input 
                  type="range"
                  min="300"
                  max="4000"
                  step="50"
                  value={avgTicket}
                  onChange={e => setAvgTicket(Number(e.target.value))}
                  className="w-full accent-emerald-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>

              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs text-white/70 font-light">
                <p>&bull; Eliminates quarterly laminated menu reprint bills.</p>
                <p>&bull; 3x faster table turns with WhatsApp kitchen KOT dispatch.</p>
                <p>&bull; Direct UPI payments with zero aggregator commission cuts.</p>
              </div>
            </div>

            {/* Savings Display */}
            <div className="p-8 rounded-3xl bg-black/50 border border-white/15 text-center space-y-5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
                Annual Retained Profit
              </span>
              <div className="text-4xl sm:text-5xl font-light text-white tracking-tight font-mono">
                ₹{((tables * 4 * 30 * avgTicket * 0.14) + (tables * 500)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <p className="text-xs text-emerald-400/90 font-light">
                Projected annual operational capital recovered
              </p>
              <button
                onClick={() => onOpenAuth ? onOpenAuth('register') : null}
                className="w-full py-3.5 rounded-full bg-white text-slate-900 font-medium text-xs uppercase tracking-widest hover:bg-slate-200 transition shadow-xl"
              >
                Onboard Your Restaurant
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CARD DETAIL POPUP MODAL */}
      {activeCardModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveCardModal(null)}
        >
          <div 
            className="w-full max-w-lg bg-[#181c19] border border-white/20 rounded-[36px] p-8 text-white space-y-6 shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                Studio Note
              </span>
              <button 
                onClick={() => setActiveCardModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>

            {activeCardModal === 'ethos' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-light text-white">Let the wild lead.</h3>
                <p className="text-sm text-white/70 font-light leading-relaxed">
                  Great dining is sensory. When guests sit at your table, they deserve an interface that respects the ambiance, lighting, and pacing of the meal. SmartQR was engineered to disappear into the room, leaving only appetite, discovery, and effortless connection.
                </p>
              </div>
            )}

            {activeCardModal === 'fieldnote' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-light text-white">Field Note 07: After the Rain</h3>
                <p className="text-sm text-white/70 font-light leading-relaxed">
                  A study in rapid digital adaptation. How modern bistros across India transition from fragile paper menus to high-res, tactile culinary storytelling with zero diner friction.
                </p>
              </div>
            )}

            {activeCardModal === 'audio' && (
              <div className="space-y-4 text-center py-4">
                <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 mx-auto flex items-center justify-center text-emerald-400">
                  <Volume2 className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="text-xl font-light text-white">Ambient Dining Audio</h3>
                <p className="text-xs text-white/60 max-w-sm mx-auto font-light">
                  Gentle rain, wood embers, and soft ceramic tableware sounds for a tranquil tasting room.
                </p>
                <button
                  onClick={() => setIsAudioPlaying(p => !p)}
                  className="px-6 py-2.5 rounded-full bg-white text-slate-900 text-xs font-medium uppercase tracking-wider hover:bg-slate-200 transition"
                >
                  {isAudioPlaying ? 'Pause Soundscape' : 'Play Soundscape'}
                </button>
              </div>
            )}

            <button
              onClick={() => setActiveCardModal(null)}
              className="w-full py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium uppercase tracking-widest transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 py-10 px-6 text-center text-[11px] font-mono text-white/40 tracking-wider uppercase">
        <p>&copy; {new Date().getFullYear()} SMARTQR ATELIER &bull; THE SENIOR CRAFT OF RESTAURANT TECHNOLOGY</p>
      </footer>

    </div>
  );
};
