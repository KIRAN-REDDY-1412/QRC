import React, { useState, useEffect, useRef } from 'react';
import { Restaurant, OpeningAnimationStyle } from '@/types';
import { Sparkles, Utensils, Crown, ChevronRight, Volume2, VolumeX } from 'lucide-react';

interface OpeningExperienceOverlayProps {
  restaurant: Restaurant;
  animationStyle?: OpeningAnimationStyle;
  duration?: number; // duration in seconds (e.g. 1.8)
  tagline?: string;
  showSkipButton?: boolean;
  soundEnabled?: boolean;
  tableLabel?: string;
  isPreview?: boolean;
  onComplete: () => void;
}

export const OpeningExperienceOverlay: React.FC<OpeningExperienceOverlayProps> = ({
  restaurant,
  animationStyle = 'gold_glow',
  duration = 1.8,
  tagline,
  showSkipButton = true,
  soundEnabled = false,
  tableLabel,
  isPreview = false,
  onComplete
}) => {
  const [phase, setPhase] = useState<'intro' | 'exiting' | 'done'>('intro');
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches && !isPreview) {
        onComplete();
        return;
      }
    }
  }, [isPreview, onComplete]);

  // Optional subtle synthesized audio chime (Web Audio API - zero external audio asset dependency)
  useEffect(() => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const playTone = (freq: number, start: number, stop: number, gainVal: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(gainVal, ctx.currentTime + start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + stop);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + stop);
      };

      // Shimmering harp-like chime chord
      playTone(523.25, 0.1, 1.2, 0.15); // C5
      playTone(659.25, 0.25, 1.4, 0.12); // E5
      playTone(783.99, 0.4, 1.6, 0.10); // G5
      playTone(1046.50, 0.55, 1.8, 0.08); // C6
    } catch {
      // Audio autoplay policy might silently block, ignore
    }
  }, [soundEnabled]);

  // Luxury / Gold Particles Canvas
  useEffect(() => {
    if (animationStyle !== 'luxury_particles' && animationStyle !== 'gold_glow') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let h = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;
    }> = [];

    const goldColors = ['#f59e0b', '#fbbf24', '#d97706', '#fef3c7', '#ffffff'];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -Math.random() * 0.8 - 0.2, // gently floating upward
        radius: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.7 + 0.2,
        color: goldColors[Math.floor(Math.random() * goldColors.length)]
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = h;
          p.x = Math.random() * w;
        }
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [animationStyle]);

  // Master Timer for the opening duration
  useEffect(() => {
    const totalMs = Math.max(1000, duration * 1000);
    
    // Start exit transition 500ms before duration completes
    const exitTimer = setTimeout(() => {
      setPhase('exiting');
    }, Math.max(600, totalMs - 500));

    // Fully complete and unmount
    const finishTimer = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, totalMs);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [duration, onComplete]);

  const handleSkip = () => {
    setPhase('exiting');
    setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 250);
  };

  if (phase === 'done') return null;

  const displayTagline = tagline || restaurant.tagline || 'Crafted With Passion & Culinary Excellence';

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none overflow-hidden transition-all duration-700 ease-out ${
        phase === 'exiting' 
          ? 'opacity-0 scale-105 pointer-events-none' 
          : 'opacity-100 scale-100 pointer-events-auto'
      }`}
      style={{
        background: animationStyle === 'minimal' 
          ? '#0f172a' 
          : animationStyle === 'cinematic'
          ? 'radial-gradient(circle at 50% 40%, #1e1b18 0%, #0c0b0a 100%)'
          : 'radial-gradient(circle at 50% 35%, #18191b 0%, #090a0b 100%)'
      }}
    >
      {/* Particle Shimmer Canvas */}
      {(animationStyle === 'luxury_particles' || animationStyle === 'gold_glow') && (
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 pointer-events-none z-0 opacity-80"
        />
      )}

      {/* Atmospheric Radial Aura Glow behind logo */}
      {animationStyle !== 'minimal' && (
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none blur-[90px] transition-all duration-1000 ${
            animationStyle === 'gold_glow' || animationStyle === 'luxury_particles'
              ? 'w-72 h-72 sm:w-96 sm:h-96 bg-amber-500/25 animate-pulse'
              : 'w-80 h-80 bg-orange-600/20'
          }`}
        />
      )}

      {/* Pulsing Concentric Aura Ring (for luxury_particles and cinematic) */}
      {(animationStyle === 'luxury_particles' || animationStyle === 'cinematic') && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-amber-400/20 animate-pulse pointer-events-none" />
      )}

      {/* Anamorphic Light Streak for Cinematic Style */}
      {animationStyle === 'cinematic' && (
        <div className="absolute top-1/2 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-300/60 to-transparent blur-[0.5px] pointer-events-none animate-pulse" />
      )}

      {/* Top Bar with Optional Skip Button & Table Badge */}
      <div className="absolute top-6 inset-x-6 flex items-center justify-between z-20">
        {tableLabel ? (
          <div className="px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-mono tracking-widest text-amber-300 uppercase shadow-lg">
            ✦ {tableLabel} ✦
          </div>
        ) : <div />}

        {showSkipButton && (
          <button
            onClick={handleSkip}
            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white/80 hover:text-white text-xs font-medium tracking-wider transition-all flex items-center gap-1 active:scale-95"
          >
            <span>Skip</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* CENTERPIECE: LOGO REVEAL & RESTAURANT BRANDING */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md mx-auto space-y-5 animate-fade-in">
        
        {/* LOGO CONTAINER WITH 3D ZOOM REVEAL */}
        <div className="relative group">
          {/* Glowing Outline Ring */}
          <div className={`absolute -inset-2 rounded-3xl blur-md opacity-75 transition-opacity ${
            animationStyle === 'minimal' 
              ? 'bg-slate-700/50' 
              : 'bg-gradient-to-tr from-amber-500 to-amber-300'
          }`} />

          {/* Logo Frame */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-900 border-2 border-white/20 shadow-2xl overflow-hidden flex items-center justify-center transform transition-transform duration-700 hover:scale-105">
            {restaurant.logo_url && !logoError ? (
              <img 
                src={restaurant.logo_url} 
                alt={restaurant.name}
                onLoad={() => setLogoLoaded(true)}
                onError={() => setLogoError(true)}
                className="w-full h-full object-cover transform transition-all duration-700 scale-100"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-amber-500 to-amber-600 flex flex-col items-center justify-center text-slate-950 font-black">
                <Utensils className="w-10 h-10 drop-shadow-md text-slate-950" />
              </div>
            )}
          </div>

          {/* Pure Veg Pill Indicator if applicable */}
          {restaurant.is_pure_veg && (
            <div className="absolute -bottom-2 inset-x-0 mx-auto w-max px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider shadow-md border border-emerald-400/50 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>100% PURE VEG</span>
            </div>
          )}
        </div>

        {/* RESTAURANT NAME (Animated Reveal) */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-4xl font-serif text-white tracking-wide font-bold drop-shadow-md">
            {restaurant.name}
          </h1>

          {/* Subtitle / Tagline */}
          <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed max-w-xs mx-auto italic font-serif">
            "{displayTagline}"
          </p>
        </div>

        {/* Elegant Animated Gold Divider / Shimmer Line */}
        <div className="w-32 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto rounded-full shadow-[0_0_8px_#f59e0b]" />

        {/* Subtle Animated Status Pill */}
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-amber-300/80 pt-2">
          <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
          <span>Opening Menu Experience...</span>
        </div>

      </div>

      {/* Subtle Bottom Watermark */}
      <div className="absolute bottom-6 inset-x-0 text-center z-10">
        <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase">
          Powered By SmartQR &bull; 0.4s Instant Contactless
        </span>
      </div>

    </div>
  );
};
