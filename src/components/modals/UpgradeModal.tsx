import React, { useState } from 'react';
import { usePlan } from '@/context/PlanContext';
import { useRestaurant } from '@/context/RestaurantContext';
import { useAuth } from '@/context/AuthContext';
import { PlanCode, SubscriptionPlan } from '@/types';
import { initiateRazorpayPayment } from '@/services/razorpay';
import { Check, Crown, Sparkles, X, ShieldCheck, Zap } from 'lucide-react';

export const UpgradeModal: React.FC = () => {
  const { 
    isUpgradeModalOpen, 
    closeUpgradeModal, 
    requiredTierForModal, 
    plans, 
    currentSubscription,
    upgradeSubscription 
  } = usePlan();

  const { currentRestaurant } = useRestaurant();
  const { user } = useAuth();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedPlanCode, setSelectedPlanCode] = useState<PlanCode>(() => {
    return requiredTierForModal === 'basic' ? 'basic' : 'premium';
  });
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isUpgradeModalOpen) return null;

  // Filter to the 2 official plans: Basic and Premium
  const displayPlans = plans.filter(p => p.code === 'basic' || p.code === 'premium');
  const activeSelectedPlan = displayPlans.find(p => p.code === selectedPlanCode) || displayPlans[1] || displayPlans[0];

  const handleUpgrade = async (plan: SubscriptionPlan) => {
    setIsProcessing(true);
    const priceToPay = billingCycle === 'yearly' ? plan.yearly_price : plan.monthly_price;
    try {
      await initiateRazorpayPayment({
        amountInINR: priceToPay,
        planName: plan.name,
        restaurantName: currentRestaurant?.name || 'My Restaurant',
        userEmail: user?.email || 'owner@restaurant.in',
        userPhone: user?.phone || '+919820012345',
        onSuccess: async (paymentId, orderId) => {
          await upgradeSubscription(plan.code, billingCycle, {
            gateway_payment_id: paymentId,
            gateway_order_id: orderId,
            payment_gateway: 'razorpay'
          });
          setIsProcessing(false);
          closeUpgradeModal();
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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="relative bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-5 sm:p-8 text-white shadow-2xl overflow-hidden my-auto">
        {/* Glow behind modal */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeUpgradeModal}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SmartQR Subscription Plans</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Choose The Best Plan For Your Restaurant
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Both plans shown in one frame. Pick monthly or save with yearly billing.
          </p>

          {/* Master Billing Cycle Toggle */}
          <div className="mt-4 inline-flex items-center p-1 bg-slate-950 rounded-2xl border border-slate-800">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 text-xs font-bold rounded-xl transition ${
                billingCycle === 'monthly'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Yearly Billing</span>
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                billingCycle === 'yearly' ? 'bg-slate-950 text-amber-400' : 'bg-amber-400/20 text-amber-300'
              }`}>
                SAVE 25%
              </span>
            </button>
          </div>
        </div>

        {/* Both Plans Side-By-Side In One Frame */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          {displayPlans.map((plan) => {
            const isPremium = plan.code === 'premium';
            const isCurrent = currentSubscription?.plan?.code === plan.code;
            const monthlyEquivalent = Math.round(plan.yearly_price / 12);

            return (
              <div
                key={plan.id}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-all relative ${
                  isPremium
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-amber-500/70 shadow-xl ring-1 ring-amber-500/30'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                {isPremium && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-full shadow-md flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    <span>Most Popular &bull; Full Suite</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Current Plan
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mb-4 min-h-[32px]">
                    {plan.description}
                  </p>

                  {/* Dual Price Box (Both Yearly and Monthly Shown Together in Frame) */}
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 mb-5">
                    {/* Monthly Option */}
                    <div 
                      onClick={() => setBillingCycle('monthly')}
                      className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        billingCycle === 'monthly'
                          ? 'bg-slate-800/90 border-amber-400/50'
                          : 'bg-transparent border-transparent hover:bg-slate-800/40'
                      }`}
                    >
                      <div>
                        <span className="text-[11px] font-bold text-slate-300 block">Monthly Rate</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-white">₹{plan.monthly_price}</span>
                          <span className="text-[10px] text-slate-400">/ month</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Billed monthly</span>
                    </div>

                    {/* Yearly Option */}
                    <div 
                      onClick={() => setBillingCycle('yearly')}
                      className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                        billingCycle === 'yearly'
                          ? 'bg-amber-500/10 border-amber-500/60'
                          : 'bg-transparent border-transparent hover:bg-slate-800/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-amber-300 block">Yearly Rate</span>
                          <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded">
                            Save 25%
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-amber-300">₹{monthlyEquivalent}</span>
                          <span className="text-[10px] text-slate-400">/ month</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-bold text-white block">₹{plan.yearly_price.toLocaleString('en-IN')}</span>
                        <span className="text-[9px] text-slate-400 block">billed annually</span>
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 mb-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Included in {plan.name}:
                    </span>
                    {plan.features.slice(0, 6).map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${isPremium ? 'text-amber-400' : 'text-emerald-400'}`} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => handleUpgrade(plan)}
                    disabled={isProcessing}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                      isPremium
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-amber-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    } ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Connecting to Gateway...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>
                          {isCurrent 
                            ? `Renew ${plan.name} (${billingCycle === 'yearly' ? `₹${plan.yearly_price}/yr` : `₹${plan.monthly_price}/mo`})`
                            : `Select ${plan.name} (${billingCycle === 'yearly' ? `₹${plan.yearly_price}/yr` : `₹${plan.monthly_price}/mo`})`}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Guarantee */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Secure Checkout via Razorpay (UPI, Credit Cards, NetBanking)</span>
          </div>
          <button
            onClick={closeUpgradeModal}
            className="text-slate-500 hover:text-slate-300 transition"
          >
            Close window
          </button>
        </div>
      </div>
    </div>
  );
};
