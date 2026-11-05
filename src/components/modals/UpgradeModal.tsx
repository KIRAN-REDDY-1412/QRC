import React, { useState } from 'react';
import { usePlan } from '@/context/PlanContext';
import { useRestaurant } from '@/context/RestaurantContext';
import { useAuth } from '@/context/AuthContext';
import { PlanCode } from '@/types';
import { initiateRazorpayPayment } from '@/services/razorpay';
import { Check, Crown, Sparkles, X, ShieldCheck } from 'lucide-react';

export const UpgradeModal: React.FC = () => {
  const { 
    isUpgradeModalOpen, 
    closeUpgradeModal, 
    requiredTierForModal, 
    plans, 
    upgradeSubscription 
  } = usePlan();

  const { currentRestaurant } = useRestaurant();
  const { user } = useAuth();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isUpgradeModalOpen) return null;

  const targetPlan = plans.find(p => p.code === requiredTierForModal) || plans[1];
  const isPremiumPlus = requiredTierForModal === 'premium_plus';

  const monthlyPrice = targetPlan.monthly_price;
  const yearlyPrice = targetPlan.yearly_price;
  const activePrice = billingCycle === 'yearly' ? yearlyPrice : monthlyPrice;

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      await initiateRazorpayPayment({
        amountInINR: activePrice,
        planName: targetPlan.name,
        restaurantName: currentRestaurant?.name || 'My Restaurant',
        userEmail: user?.email || 'owner@restaurant.in',
        userPhone: user?.phone || '+919820012345',
        onSuccess: async (paymentId, orderId) => {
          await upgradeSubscription(targetPlan.code, billingCycle, {
            gateway_payment_id: paymentId,
            gateway_order_id: orderId,
            payment_gateway: 'razorpay'
          });
          setIsProcessing(false);
        },
        onDismiss: () => {
          setIsProcessing(false);
        }
      });
    } catch (err) {
      console.error('Payment checkout error:', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="relative bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 md:p-8 text-white shadow-2xl overflow-hidden">
        {/* Glow behind modal */}
        <div className={`absolute top-0 right-0 w-64 h-64 ${isPremiumPlus ? 'bg-amber-500/20' : 'bg-emerald-500/20'} rounded-full blur-3xl pointer-events-none`} />

        {/* Close Button */}
        <button
          onClick={closeUpgradeModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`p-2 rounded-xl ${isPremiumPlus ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
            {isPremiumPlus ? <Crown className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
          </div>
          <span className="text-xs font-mono uppercase tracking-widest font-bold text-slate-400">
            Subscription Required
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Unlock {targetPlan.name}
        </h2>
        <p className="text-xs md:text-sm text-slate-400 mt-1 leading-relaxed">
          {targetPlan.description}
        </p>

        {/* Billing Cycle Toggle */}
        <div className="mt-6 bg-slate-800/80 p-1.5 rounded-2xl flex items-center border border-slate-700/60">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              billingCycle === 'monthly'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Yearly Billing</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
              SAVE {targetPlan.yearly_discount_percent}%
            </span>
          </button>
        </div>

        {/* Price Display in INR ₹ */}
        <div className="my-6 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-baseline justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Configured Plan Rate</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-black text-white">₹{activePrice.toLocaleString('en-IN')}</span>
              <span className="text-xs text-slate-400">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Instant Activation
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Cancel or switch anytime</span>
          </div>
        </div>

        {/* Included Features List */}
        <div className="space-y-2.5 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
            What's included in this tier:
          </span>
          {targetPlan.features.slice(0, 5).map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
              <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5 flex-shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>{feat}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleUpgrade}
            disabled={isProcessing}
            className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm transition-all shadow-xl flex items-center justify-center gap-2 ${
              isPremiumPlus
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold'
            } ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Launching Checkout...</span>
              </>
            ) : (
              <>
                <span>Upgrade Now for ₹{activePrice.toLocaleString('en-IN')}</span>
              </>
            )}
          </button>
          <button
            onClick={closeUpgradeModal}
            disabled={isProcessing}
            className="py-3.5 px-6 rounded-2xl font-semibold text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition text-center"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};
