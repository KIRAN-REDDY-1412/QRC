import React, { useState, useEffect, useRef } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { usePlan } from '@/context/PlanContext';
import QRCode from 'qrcode';
import { 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Sparkles, 
  ExternalLink, 
  Lock, 
  QrCode as QrIcon,
  Crown,
  Image as ImageIcon,
  Type,
  Palette,
  Sliders,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

export const QRCodeStudio: React.FC = () => {
  const { currentRestaurant, tables } = useRestaurant();
  const { canAccessFeature, openUpgradeModal, currentSubscription } = usePlan();

  const [selectedTable, setSelectedTable] = useState<string>('main');
  const [copied, setCopied] = useState<boolean>(false);
  const [standeeStyle, setStandeeStyle] = useState<'modern' | 'royal' | 'minimal'>('modern');

  // QR Center Badge Controls (Premium & Plus Feature)
  const [centerStyle, setCenterStyle] = useState<'none' | 'logo' | 'name'>('logo');
  const [badgeShape, setBadgeShape] = useState<'circle' | 'rounded'>('circle');
  const [qrColor, setQrColor] = useState<string>('#0f172a');
  
  // Output states
  const [qrPngUrl, setQrPngUrl] = useState<string>('');
  const [qrSvg, setQrSvg] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!currentRestaurant) return null;

  const canUseTableQR = canAccessFeature('table_qr');
  const canUseCustomQR = canAccessFeature('custom_qr_logo');
  const currentPlanCode = currentSubscription?.plan?.code || 'free';

  // Construct permanent URL
  const origin = window.location.origin;
  const baseUrl = `${origin}/menu/${currentRestaurant.slug}`;
  const targetMenuUrl = selectedTable === 'main' ? baseUrl : `${baseUrl}?table=${encodeURIComponent(selectedTable)}`;

  // If user is on free plan, default centerStyle to 'none' if they don't have access
  useEffect(() => {
    if (!canUseCustomQR && centerStyle !== 'none') {
      setCenterStyle('none');
    } else if (canUseCustomQR && centerStyle === 'none') {
      // Auto-enable logo if available for premium users
      setCenterStyle('logo');
    }
  }, [canUseCustomQR]);

  useEffect(() => {
    generateStyledQRCode();
  }, [targetMenuUrl, currentRestaurant.slug, centerStyle, badgeShape, qrColor, canUseCustomQR, currentRestaurant.logo_url, currentRestaurant.name]);

  const drawRoundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    if ((ctx as any).roundRect) {
      (ctx as any).roundRect(x, y, w, h, r);
    } else {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }
  };

  const drawInitialsBadge = (
    ctx: CanvasRenderingContext2D,
    name: string,
    center: number,
    halfBadge: number,
    badgeSize: number,
    shape: 'circle' | 'rounded',
    color: string
  ) => {
    ctx.save();
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    if (shape === 'circle') {
      ctx.arc(center, center, halfBadge, 0, Math.PI * 2);
    } else {
      drawRoundRect(ctx, center - halfBadge, center - halfBadge, badgeSize, badgeSize, 22);
    }
    ctx.fill();

    // Extract initials
    const words = name.trim().split(/\s+/).filter(Boolean);
    const initials = words.length >= 2 
      ? (words[0][0] + words[1][0]).toUpperCase() 
      : name.slice(0, 2).toUpperCase();

    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 68px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(initials, center, center - 14);

    // Short name banner underneath
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 18px "Plus Jakarta Sans", system-ui, sans-serif';
    const shortName = name.length > 11 ? name.slice(0, 9) + '…' : name;
    ctx.fillText(shortName.toUpperCase(), center, center + 44);

    ctx.restore();
  };

  const generateStyledQRCode = async () => {
    setIsGenerating(true);
    try {
      const canvas = document.createElement('canvas');
      const size = 1000;
      canvas.width = size;
      canvas.height = size;

      // 1. Generate base QR code on canvas with High Error Correction ('H' = 30% recovery)
      const effectiveQrColor = canUseCustomQR ? qrColor : '#0f172a';
      await QRCode.toCanvas(canvas, targetMenuUrl, {
        width: size,
        margin: 2,
        color: {
          dark: effectiveQrColor,
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      });

      // 2. Only overlay center badge if permitted by plan & user opted in
      if (canUseCustomQR && centerStyle !== 'none') {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const center = size / 2;
          const badgeSize = size * 0.22; // 22% of QR code width (well within the 30% H-level budget)
          const halfBadge = badgeSize / 2;
          const badgeRadius = badgeShape === 'circle' ? halfBadge : 24;

          // Outer shadow and white padding pad
          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
          ctx.shadowBlur = 18;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 4;

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          if (badgeShape === 'circle') {
            ctx.arc(center, center, halfBadge + 10, 0, Math.PI * 2);
          } else {
            drawRoundRect(ctx, center - halfBadge - 10, center - halfBadge - 10, badgeSize + 20, badgeSize + 20, badgeRadius + 4);
          }
          ctx.fill();
          ctx.restore();

          // Border ring in QR color or accent
          ctx.strokeStyle = effectiveQrColor;
          ctx.lineWidth = 6;
          ctx.beginPath();
          if (badgeShape === 'circle') {
            ctx.arc(center, center, halfBadge + 4, 0, Math.PI * 2);
          } else {
            drawRoundRect(ctx, center - halfBadge - 4, center - halfBadge - 4, badgeSize + 8, badgeSize + 8, badgeRadius + 2);
          }
          ctx.stroke();

          // Draw Logo Image or Name/Initials
          if (centerStyle === 'logo' && currentRestaurant.logo_url) {
            try {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject();
                img.src = currentRestaurant.logo_url!;
              });

              ctx.save();
              ctx.beginPath();
              if (badgeShape === 'circle') {
                ctx.arc(center, center, halfBadge, 0, Math.PI * 2);
              } else {
                drawRoundRect(ctx, center - halfBadge, center - halfBadge, badgeSize, badgeSize, badgeRadius);
              }
              ctx.clip();
              ctx.drawImage(img, center - halfBadge, center - halfBadge, badgeSize, badgeSize);
              ctx.restore();
            } catch (err) {
              // Fallback to stylized initials if remote image fails CORS
              drawInitialsBadge(ctx, currentRestaurant.name, center, halfBadge, badgeSize, badgeShape, effectiveQrColor);
            }
          } else {
            // Stylized restaurant name / initials monogram
            drawInitialsBadge(ctx, currentRestaurant.name, center, halfBadge, badgeSize, badgeShape, effectiveQrColor);
          }
        }
      }

      // 3. Export PNG Data URL
      const dataUrl = canvas.toDataURL('image/png');
      setQrPngUrl(dataUrl);

      // 4. Generate SVG string for download
      const svgString = await QRCode.toString(targetMenuUrl, {
        type: 'svg',
        margin: 2,
        color: {
          dark: effectiveQrColor,
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      });
      setQrSvg(svgString);

    } catch (err) {
      console.error('QR code generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(targetMenuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = () => {
    if (!qrPngUrl) return;
    const link = document.createElement('a');
    link.download = `${currentRestaurant.slug}-custom-qr-${selectedTable}.png`;
    link.href = qrPngUrl;
    link.click();
  };

  const handleDownloadSvg = () => {
    if (!qrSvg) return;
    const blob = new Blob([qrSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${currentRestaurant.slug}-qr-${selectedTable}.svg`;
    link.href = url;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const colorPresets = [
    { name: 'Charcoal Black', hex: '#0f172a' },
    { name: 'Royal Gold', hex: '#d97706' },
    { name: 'Emerald Jade', hex: '#059669' },
    { name: 'Imperial Crimson', hex: '#be123c' },
    { name: 'Sapphire Navy', hex: '#1d4ed8' },
    { name: 'Espresso Bronze', hex: '#78350f' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <QrIcon className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
              Permanent QR Studio
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">QR Code Studio & Table Standee</h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
            Custom branded QR code with your restaurant logo or name in the center. Available exclusively for Premium and Premium Plus subscribers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`/menu/${currentRestaurant.slug}?replay_intro=true${selectedTable !== 'main' ? `&table=${encodeURIComponent(selectedTable)}` : ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
            title="Scan simulator: test the instant opening animation experience"
          >
            <Sparkles className="w-4 h-4" />
            <span>Test Live Scan</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
          <button
            onClick={handleCopyUrl}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-2 border border-slate-700"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied URL!' : 'Copy Menu URL'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print Standee</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-6">

          {/* QR Center Badge Feature (Premium / Plus Only) */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-white">QR Code Center Style</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 flex items-center gap-1 shadow-sm">
                    <Crown className="w-3 h-3" />
                    Premium & Plus
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Embed your restaurant logo or monogram in the middle of the QR code.
                </p>
              </div>
            </div>

            {/* Free Tier Lock Callout */}
            {!canUseCustomQR && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <Crown className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-amber-300">Unlock Center Logo & Restaurant Name in QR</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Your current plan ({currentPlanCode}) includes standard QR codes. Upgrade to <strong>Premium</strong> or <strong>Premium Plus</strong> to display your logo or restaurant name directly in the center of every QR code.
                  </p>
                  <button
                    onClick={() => openUpgradeModal('premium')}
                    className="mt-2.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-md"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>Upgrade to Premium to Unlock</span>
                  </button>
                </div>
              </div>
            )}

            {/* Center Style Radio Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Center Graphic</label>
              <div className="grid grid-cols-3 gap-2">
                {/* Option 1: None (Available to all) */}
                <button
                  type="button"
                  onClick={() => setCenterStyle('none')}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                    centerStyle === 'none'
                      ? 'bg-emerald-500/10 border-emerald-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold block text-white">None (Classic)</span>
                  <span className="text-[10px] text-slate-500 mt-1 block">Standard clean QR</span>
                  {centerStyle === 'none' && <Check className="w-3.5 h-3.5 text-emerald-400 mt-2" />}
                </button>

                {/* Option 2: Restaurant Logo */}
                <button
                  type="button"
                  onClick={() => {
                    if (!canUseCustomQR) {
                      openUpgradeModal('premium');
                    } else {
                      setCenterStyle('logo');
                    }
                  }}
                  className={`p-3 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                    centerStyle === 'logo'
                      ? 'bg-amber-500/15 border-amber-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  } ${!canUseCustomQR ? 'opacity-85' : ''}`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-amber-400" />
                        Logo
                      </span>
                      {!canUseCustomQR && <Lock className="w-3 h-3 text-amber-400" />}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Restaurant logo in middle</span>
                  </div>
                  {centerStyle === 'logo' && <Check className="w-3.5 h-3.5 text-amber-400 mt-2" />}
                </button>

                {/* Option 3: Restaurant Name */}
                <button
                  type="button"
                  onClick={() => {
                    if (!canUseCustomQR) {
                      openUpgradeModal('premium');
                    } else {
                      setCenterStyle('name');
                    }
                  }}
                  className={`p-3 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                    centerStyle === 'name'
                      ? 'bg-amber-500/15 border-amber-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  } ${!canUseCustomQR ? 'opacity-85' : ''}`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1">
                        <Type className="w-3 h-3 text-amber-400" />
                        Name
                      </span>
                      {!canUseCustomQR && <Lock className="w-3 h-3 text-amber-400" />}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Monogram & name badge</span>
                  </div>
                  {centerStyle === 'name' && <Check className="w-3.5 h-3.5 text-amber-400 mt-2" />}
                </button>
              </div>
            </div>

            {/* Customization Details (When centerStyle is enabled) */}
            {canUseCustomQR && centerStyle !== 'none' && (
              <div className="space-y-4 pt-3 border-t border-slate-800 animate-in fade-in">
                {/* Badge Shape */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">Badge Shape</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBadgeShape('circle')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                        badgeShape === 'circle'
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      Circular Badge
                    </button>
                    <button
                      type="button"
                      onClick={() => setBadgeShape('rounded')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                        badgeShape === 'rounded'
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      Rounded Square
                    </button>
                  </div>
                </div>

                {/* QR Code Foreground Color */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">QR Code Color Palette</label>
                  <div className="flex flex-wrap items-center gap-2">
                    {colorPresets.map(c => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setQrColor(c.hex)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                          qrColor === c.hex
                            ? 'bg-slate-800 text-white border-white'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c.hex }} />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Table Selector & Standee Style */}
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider block">
                Target QR Destination
              </label>
              {!canUseTableQR && (
                <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Table QRs in Premium Plus
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tableSel"
                    checked={selectedTable === 'main'}
                    onChange={() => setSelectedTable('main')}
                    className="accent-emerald-500"
                  />
                  <span className="text-xs font-bold text-white">Main Restaurant QR (All Tables)</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold">Standard</span>
              </label>

              {tables.map(tbl => (
                <label 
                  key={tbl.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    canUseTableQR 
                      ? selectedTable === tbl.table_number
                        ? 'bg-slate-900 border-emerald-500'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-900/30 border-slate-800/50 opacity-60'
                  }`}
                  onClick={(e) => {
                    if (!canUseTableQR) {
                      e.preventDefault();
                      openUpgradeModal('premium_plus');
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="tableSel"
                      disabled={!canUseTableQR}
                      checked={selectedTable === tbl.table_number}
                      onChange={() => setSelectedTable(tbl.table_number)}
                      className="accent-emerald-500"
                    />
                    <span className="text-xs font-bold text-white">{tbl.table_number}</span>
                    <span className="text-[10px] text-slate-500">({tbl.section_name})</span>
                  </div>
                  {!canUseTableQR && <Lock className="w-3.5 h-3.5 text-amber-400" />}
                </label>
              ))}
            </div>

            {/* Standee Frame Style Selector */}
            <div className="pt-3 border-t border-slate-800">
              <label className="text-xs font-bold text-white block mb-2">Standee Card Theme</label>
              <div className="grid grid-cols-3 gap-2">
                {(['modern', 'royal', 'minimal'] as const).map(style => (
                  <button
                    key={style}
                    onClick={() => setStandeeStyle(style)}
                    className={`py-2 text-xs font-bold rounded-xl capitalize transition ${
                      standeeStyle === style
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Downloads */}
            <div className="pt-4 border-t border-slate-800 flex gap-2">
              <button
                onClick={handleDownloadPng}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-700 shadow-md"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download PNG (High-Res)</span>
              </button>
              <button
                onClick={handleDownloadSvg}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-700 shadow-md"
              >
                <Download className="w-4 h-4 text-indigo-400" />
                <span>Vector SVG</span>
              </button>
            </div>
          </div>
        </div>

        {/* Printable Standee Preview Column */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-mono text-slate-400">TABLETOP STANDEE PREVIEW (A5 / 4x6")</span>
            <div className="flex items-center gap-2">
              {canUseCustomQR && centerStyle !== 'none' && (
                <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Custom Center: {centerStyle === 'logo' ? 'Logo' : 'Name'}
                </span>
              )}
              <span className="text-[10px] text-emerald-400 font-bold">READY TO PRINT</span>
            </div>
          </div>

          {/* PRINTABLE STANDEE ELEMENT */}
          <div
            id="printable-qr-standee"
            className={`w-full max-w-sm rounded-3xl p-8 flex flex-col items-center justify-between text-center shadow-2xl transition duration-300 ${
              standeeStyle === 'royal'
                ? 'bg-gradient-to-b from-[#2a160f] to-[#1a0d09] text-[#faedd4] border-4 border-[#b8860b]'
                : standeeStyle === 'minimal'
                ? 'bg-white text-slate-900 border border-slate-200'
                : 'bg-white text-slate-900 border-4 border-emerald-600'
            }`}
          >
            {/* Standee Brand Top */}
            <div className="space-y-2">
              {currentRestaurant.logo_url && (
                <img
                  src={currentRestaurant.logo_url}
                  alt=""
                  className="w-16 h-16 rounded-2xl mx-auto object-cover shadow-md border-2 border-white"
                />
              )}
              <h2 className="text-xl font-extrabold tracking-tight uppercase">
                {currentRestaurant.name}
              </h2>
              <p className="text-xs opacity-75 font-medium">
                {currentRestaurant.tagline || 'Scan to browse full digital menu'}
              </p>
            </div>

            {/* QR Center Graphic */}
            <div className="my-6 p-4 rounded-3xl bg-white shadow-xl border border-slate-100 flex flex-col items-center relative">
              {isGenerating ? (
                <div className="w-60 h-60 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : qrPngUrl ? (
                <img
                  src={qrPngUrl}
                  alt="Restaurant QR Code"
                  className="w-60 h-60 object-contain rounded-2xl"
                />
              ) : null}

              <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Point Camera & Scan
              </span>
            </div>

            {/* Table Number Badge & Instructions */}
            <div className="space-y-1.5">
              <div className="inline-block px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-emerald-100 text-emerald-800">
                {selectedTable === 'main' ? 'Welcome Guests' : selectedTable}
              </div>
              <p className="text-[10px] opacity-70">
                No app download required • Instant contactless ordering
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};