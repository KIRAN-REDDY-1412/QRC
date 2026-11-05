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
  Crown
} from 'lucide-react';

export const QRCodeStudio: React.FC = () => {
  const { currentRestaurant, tables } = useRestaurant();
  const { canAccessFeature, openUpgradeModal, currentSubscription } = usePlan();

  const [qrSvg, setQrSvg] = useState<string>('');
  const [qrPngUrl, setQrPngUrl] = useState<string>('');
  const [selectedTable, setSelectedTable] = useState<string>('main');
  const [copied, setCopied] = useState<boolean>(false);
  const [standeeStyle, setStandeeStyle] = useState<'minimal' | 'royal' | 'modern'>('modern');

  if (!currentRestaurant) return null;

  const canUseTableQR = canAccessFeature('table_qr');
  const isPremiumPlus = currentSubscription?.plan?.code === 'premium_plus';

  // Construct permanent URL
  const origin = window.location.origin;
  const baseUrl = `${origin}/menu/${currentRestaurant.slug}`;
  const targetMenuUrl = selectedTable === 'main' ? baseUrl : `${baseUrl}?table=${encodeURIComponent(selectedTable)}`;

  useEffect(() => {
    generateQRCodes();
  }, [targetMenuUrl, currentRestaurant.slug]);

  const generateQRCodes = async () => {
    try {
      // Generate SVG string
      const svgString = await QRCode.toString(targetMenuUrl, {
        type: 'svg',
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      });
      setQrSvg(svgString);

      // Generate Data URL for PNG download
      const pngDataUrl = await QRCode.toDataURL(targetMenuUrl, {
        margin: 2,
        width: 800,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      });
      setQrPngUrl(pngDataUrl);
    } catch (err) {
      console.error('QR code generation error:', err);
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
    link.download = `${currentRestaurant.slug}-qr-${selectedTable}.png`;
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

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <QrIcon className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
              Permanent QR Generator
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">QR Code Studio & Standee</h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
            Download vector SVG or ultra-high resolution PNG for your dining tables, counter flyers, and table tents.
          </p>
        </div>

        <div className="flex items-center gap-2">
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
        <div className="lg:col-span-5 space-y-6">
          {/* Table Selector */}
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
              <label className="text-xs font-bold text-white block mb-2">Standee Frame Style</label>
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
                className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-700"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>PNG (Raster)</span>
              </button>
              <button
                onClick={handleDownloadSvg}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-700"
              >
                <Download className="w-4 h-4 text-indigo-400" />
                <span>SVG (Vector)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Printable Standee Preview Column */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 px-2">
            <span className="text-xs font-mono text-slate-400">TABLETOP STANDEE PREVIEW (A5 / 4x6")</span>
            <span className="text-[10px] text-emerald-400 font-bold">READY TO PRINT</span>
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
                  className="w-16 h-16 rounded-2xl mx-auto object-cover shadow-md"
                />
              )}
              <h2 className="text-xl font-extrabold tracking-tight uppercase">
                {currentRestaurant.name}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {currentRestaurant.tagline || 'Scan to browse full digital menu'}
              </p>
            </div>

            {/* QR Center Graphic */}
            <div className="my-6 p-4 rounded-2xl bg-white shadow-lg border border-slate-100 flex flex-col items-center">
              {qrPngUrl && (
                <img
                  src={qrPngUrl}
                  alt="Restaurant QR Code"
                  className="w-56 h-56 object-contain"
                />
              )}
              <span className="mt-2 text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Point Camera & Scan
              </span>
            </div>

            {/* Table Number Badge & Instructions */}
            <div className="space-y-1">
              <div className="inline-block px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-emerald-100 text-emerald-800">
                {selectedTable === 'main' ? 'Welcome Guests' : selectedTable}
              </div>
              <p className="text-[10px] text-slate-400">
                No app installation required • Instant contactless ordering
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
