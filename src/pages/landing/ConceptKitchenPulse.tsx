import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  QrCode, 
  Smartphone, 
  Send, 
  CreditCard, 
  Calculator, 
  Flame, 
  CheckCircle2, 
  Bell, 
  TrendingUp, 
  Zap, 
  ShoppingBag,
  RotateCcw
} from 'lucide-react';

interface ConceptProps {
  onSelectConcept?: (name: string) => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const ConceptKitchenPulse: React.FC<ConceptProps> = ({ onSelectConcept, onOpenAuth }) => {
  // Interactive 3-Step Simulator State
  const [simStep, setSimStep] = useState<1 | 2 | 3>(1);
  const [cartCount, setCartCount] = useState<number>(0);
  const [isOrderDispatched, setIsOrderDispatched] = useState<boolean>(false);
  const [isUpiCompleted, setIsUpiCompleted] = useState<boolean>(false);

  // ROI Calculator State
  const [dailyTables, setDailyTables] = useState<number>(60);
  const [avgBill, setAvgBill] = useState<number>(750);

  // Step 1: Scan
  const handleSimulateScan = () => {
    setSimStep(2);
    setCartCount(1);
  };

  // Step 2: WhatsApp Order
  const handleSimulateOrder = () => {
    setIsOrderDispatched(true);
    setSimStep(3);
  };

  // Step 3: UPI Pay
  const handleSimulateUpiPay = () => {
    setIsUpiCompleted(true);
    // Fire celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleResetSimulator = () => {
    setSimStep(1);
    setCartCount(0);
    setIsOrderDispatched(false);
    setIsUpiCompleted(false);
  };

  // ROI calculations
  // +15% more orders due to visual photos and instant re-ordering
  const extraMonthlyOrders = dailyTables * 30 * 0.15 * avgBill;
  const yearlyPrintingSaved = 36000;
  const netAnnualBoost = (extraMonthlyOrders * 12) + yearlyPrintingSaved;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-orange-500 selection:text-white relative overflow-hidden">
      {/* Ambient Warm Sunset Mesh Glows */}
      <div className="absolute top-12 left-1/3 w-[650px] h-[500px] bg-gradient-to-tr from-orange-500/15 via-amber-500/10 to-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>Interactive Dining Floor Simulator</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.08]">
              Speed Up Table Turnover. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400">
                Turn Every Table into A Live Cash Register.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-stone-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Diners scan QR codes, build their tabletop cart, dispatch orders to your kitchen via WhatsApp, and settle the bill instantly via Google Pay or PhonePe.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button 
                onClick={() => onOpenAuth ? onOpenAuth('register') : null}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-stone-950 font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-xl shadow-orange-500/25 transform active:scale-95"
              >
                <span>Start Free 14-Day Trial</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a 
                href="#roi-calc"
                className="px-5 py-3.5 rounded-2xl bg-stone-900/90 hover:bg-stone-800 text-stone-200 font-bold text-xs sm:text-sm border border-stone-800 transition flex items-center gap-2"
              >
                <Calculator className="w-4 h-4 text-orange-400" />
                <span>Calculate Your ROI</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-stone-900">
              <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800">
                <span className="text-xl sm:text-2xl font-black text-orange-400 block">+28%</span>
                <span className="text-[11px] text-stone-400">Faster Table Turnover</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800">
                <span className="text-xl sm:text-2xl font-black text-emerald-400 block">₹0</span>
                <span className="text-[11px] text-stone-400">Menu Printing Costs</span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-900/60 border border-stone-800">
                <span className="text-xl sm:text-2xl font-black text-amber-400 block">3 Sec</span>
                <span className="text-[11px] text-stone-400">UPI Instant Bill Pay</span>
              </div>
            </div>
          </div>

          {/* Right Column: Playable 3-Step Interactive Dining Simulator */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[360px] bg-stone-900/90 border-2 border-orange-500/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono uppercase font-bold text-white">Interactive Diner Simulator</span>
                </div>
                <button
                  onClick={handleResetSimulator}
                  className="p-1 rounded-lg text-stone-400 hover:text-white transition"
                  title="Reset Simulator"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress Stepper */}
              <div className="grid grid-cols-3 gap-1.5 my-3">
                <div className={`p-1.5 rounded-xl text-center text-[10px] font-bold transition ${simStep >= 1 ? 'bg-orange-500 text-stone-950' : 'bg-stone-800 text-stone-400'}`}>
                  1. Scan QR
                </div>
                <div className={`p-1.5 rounded-xl text-center text-[10px] font-bold transition ${simStep >= 2 ? 'bg-orange-500 text-stone-950' : 'bg-stone-800 text-stone-400'}`}>
                  2. Order Dish
                </div>
                <div className={`p-1.5 rounded-xl text-center text-[10px] font-bold transition ${simStep >= 3 ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-stone-400'}`}>
                  3. Pay UPI
                </div>
              </div>

              {/* Step Display Body */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 min-h-[320px] flex flex-col justify-between">
                {simStep === 1 && (
                  <div className="text-center py-6 space-y-4 animate-in fade-in">
                    <div className="w-28 h-28 mx-auto p-2 rounded-2xl bg-white shadow-xl flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-stone-900" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Table 5 • Bombay Bistro</h4>
                      <p className="text-xs text-stone-400 mt-1">Diner scans table QR with smartphone</p>
                    </div>
                    <button
                      onClick={handleSimulateScan}
                      className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-stone-950 font-black text-xs transition shadow-md"
                    >
                      Step 1: Tap to Simulate Scan &rarr;
                    </button>
                  </div>
                )}

                {simStep === 2 && (
                  <div className="space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-300">
                      <span>Chef's Daily Specials</span>
                      <span className="text-orange-400">Table 5</span>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-3">
                      <img 
                        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80" 
                        alt="" 
                        className="w-12 h-12 rounded-lg object-cover" 
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-xs text-white truncate">Truffle Burrata Pizza</h5>
                        <span className="text-[10px] text-stone-400">San Marzano & wild rocket</span>
                        <span className="text-xs font-black text-orange-400 block">₹620</span>
                      </div>
                      <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded font-bold">1x Added</span>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-[11px] text-stone-400 space-y-1">
                      <div className="flex justify-between">
                        <span>Table 5 Cart</span>
                        <span className="font-bold text-white">₹620</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-emerald-400">
                        <span>GST 5% included</span>
                        <span>₹31</span>
                      </div>
                    </div>

                    <button
                      onClick={handleSimulateOrder}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Step 2: Dispatch WhatsApp Order &rarr;</span>
                    </button>
                  </div>
                )}

                {simStep === 3 && (
                  <div className="text-center py-4 space-y-3 animate-in fade-in">
                    {isUpiCompleted ? (
                      <div className="space-y-2 py-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                          <Check className="w-6 h-6" />
                        </div>
                        <h4 className="font-black text-white text-base">₹651 Received via UPI!</h4>
                        <p className="text-xs text-stone-400">
                          Table 5 bill settled seamlessly. Google review prompt dispatched!
                        </p>
                        <button
                          onClick={handleResetSimulator}
                          className="mt-3 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold"
                        >
                          Restart Simulator
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="p-3 rounded-xl bg-white shadow-md inline-block">
                          <QrCode className="w-24 h-24 text-stone-900 mx-auto" />
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase font-mono block">Table 5 Bill Total</span>
                          <span className="text-2xl font-black text-emerald-400">₹651.00</span>
                        </div>
                        <button
                          onClick={handleSimulateUpiPay}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Step 3: Tap to Pay with GPay / PhonePe</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE ROI CALCULATOR SECTION */}
      <section id="roi-calc" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-stone-900">
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-orange-400 font-bold">Interactive Earnings Calculator</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How Much Will SmartQR Make For You?</h2>
          <p className="text-xs sm:text-sm text-stone-400">Adjust the sliders to match your venue's size and watch your projected annual gain.</p>
        </div>

        <div className="p-8 rounded-3xl bg-stone-900/80 border border-stone-800 grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-2xl">
          {/* Sliders */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-stone-300">Average Daily Dine-in Tables</label>
                <span className="text-base font-black text-orange-400">{dailyTables} tables/day</span>
              </div>
              <input
                type="range"
                min="15"
                max="250"
                step="5"
                value={dailyTables}
                onChange={(e) => setDailyTables(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-stone-300">Average Bill Spend per Table</label>
                <span className="text-base font-black text-emerald-400">₹{avgBill}</span>
              </div>
              <input
                type="range"
                min="200"
                max="3000"
                step="50"
                value={avgBill}
                onChange={(e) => setAvgBill(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-xs text-stone-400 space-y-1">
              <span>✓ Based on 15% order boost from visual dish photography</span> <br />
              <span>✓ Eliminates menu reprint expenses (saves ₹36,000/yr)</span>
            </div>
          </div>

          {/* Result Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 border-2 border-orange-500/40 text-center space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-orange-400 font-bold">Estimated Annual Revenue Boost</span>
            <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400">
              ₹{Math.round(netAnnualBoost).toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-stone-400">
              Extra profit generated per year via faster table turnover, add-on sales, and zero print waste.
            </p>

            <button
              onClick={() => onOpenAuth ? onOpenAuth('register') : null}
              className="w-full py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-400 text-stone-950 font-black text-xs sm:text-sm transition shadow-lg shadow-orange-500/20"
            >
              Claim This Revenue Boost Now
            </button>
          </div>
        </div>
      </section>

      {/* Ready to Select Banner */}
      <div className="p-8 bg-stone-950 border-t border-stone-900 text-center font-sans">
        <button
          onClick={() => onSelectConcept ? onSelectConcept('Kitchen-Pulse') : null}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-stone-950 font-black text-sm transition shadow-xl shadow-orange-500/30 inline-flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>Select Concept 3 (Kitchen Pulse & Simulator)</span>
        </button>
      </div>
    </div>
  );
};