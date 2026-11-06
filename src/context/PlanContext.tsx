import React, { createContext, useContext, useState, useEffect } from 'react';
import { SubscriptionPlan, PlanCode, Subscription, PaymentRecord } from '@/types';
import { 
  getStoredPlans, 
  saveStoredPlans, 
  getStoredSubscription, 
  saveStoredSubscription,
  recordPayment,
  getStoredPayments,
  DEFAULT_PLANS
} from '@/lib/supabase';
import confetti from 'canvas-confetti';

interface PlanContextType {
  plans: SubscriptionPlan[];
  currentSubscription: Subscription | null;
  payments: PaymentRecord[];
  isTrial: boolean;
  trialDaysRemaining: number;
  isTrialExpired: boolean;
  isSubscriptionActive: boolean;
  isUpgradeModalOpen: boolean;
  requiredTierForModal: PlanCode;
  openUpgradeModal: (requiredTier?: PlanCode) => void;
  closeUpgradeModal: () => void;
  updatePlanPricing: (planId: string, updates: Partial<SubscriptionPlan>) => void;
  canAccessTemplate: (templateTier: PlanCode) => boolean;
  canAccessFeature: (featureKey: 'food_images' | 'custom_branding' | 'multi_language' | 'table_qr' | 'analytics' | 'custom_qr_logo' | 'ordering' | 'upi_payment' | 'bulk_import' | 'review_booster') => boolean;
  upgradeSubscription: (targetPlanCode: PlanCode, cycle: 'monthly' | 'yearly', paymentDetails?: Partial<PaymentRecord>) => Promise<boolean>;
  scheduleDowngrade: (targetPlanCode: PlanCode) => void;
  cancelSubscription: () => void;
  refreshSubscription: (restaurantId: string) => void;
  simulateExpireTrial: () => void;
  resetTrial: () => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider: React.FC<{ children: React.ReactNode; currentRestaurantId: string }> = ({ 
  children,
  currentRestaurantId 
}) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(() => getStoredPlans());
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [requiredTierForModal, setRequiredTierForModal] = useState<PlanCode>('premium');

  useEffect(() => {
    refreshSubscription(currentRestaurantId);
  }, [currentRestaurantId]);

  const refreshSubscription = (restaurantId: string) => {
    if (!restaurantId) return;
    const sub = getStoredSubscription(restaurantId);
    setCurrentSubscription(sub);
    setPayments(getStoredPayments(restaurantId));
  };

  const openUpgradeModal = (requiredTier: PlanCode = 'premium') => {
    setRequiredTierForModal(requiredTier);
    setIsUpgradeModalOpen(true);
  };

  const closeUpgradeModal = () => {
    setIsUpgradeModalOpen(false);
  };

  // 7-Day Free Trial Computation
  const isTrial = Boolean(currentSubscription?.is_trial || currentSubscription?.status === 'trialing');
  const trialEndTime = currentSubscription?.trial_ends_at 
    ? new Date(currentSubscription.trial_ends_at).getTime() 
    : (currentSubscription ? new Date(currentSubscription.current_period_end).getTime() : 0);

  const msRemaining = trialEndTime - Date.now();
  const trialDaysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
  const isTrialExpired = Boolean((isTrial && msRemaining <= 0) || currentSubscription?.status === 'expired');
  const isSubscriptionActive = (currentSubscription?.status === 'active' || (isTrial && !isTrialExpired)) && !isTrialExpired;

  // Simulator helper to test trial expired state
  const simulateExpireTrial = () => {
    if (!currentSubscription) return;
    const expiredSub: Subscription = {
      ...currentSubscription,
      status: 'expired',
      is_trial: true,
      current_period_end: new Date(Date.now() - 3600000).toISOString(),
      trial_ends_at: new Date(Date.now() - 3600000).toISOString()
    };
    saveStoredSubscription(expiredSub);
    setCurrentSubscription(expiredSub);
  };

  // Simulator helper to reset back to a clean 7-day free trial
  const resetTrial = () => {
    if (!currentSubscription) return;
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const basicPlan = plans.find(p => p.code === 'basic') || DEFAULT_PLANS[0];
    const resetSub: Subscription = {
      ...currentSubscription,
      status: 'trialing',
      is_trial: true,
      plan_id: basicPlan.id,
      current_period_start: now.toISOString(),
      current_period_end: trialEnd.toISOString(),
      trial_ends_at: trialEnd.toISOString(),
      plan: basicPlan
    };
    saveStoredSubscription(resetSub);
    setCurrentSubscription(resetSub);
  };

  const updatePlanPricing = (planId: string, updates: Partial<SubscriptionPlan>) => {
    const updated = plans.map(p => p.id === planId ? { ...p, ...updates } : p);
    setPlans(updated);
    saveStoredPlans(updated);
    // Also update current subscription plan object if matched
    if (currentSubscription && currentSubscription.plan_id === planId) {
      const freshPlan = updated.find(p => p.id === planId);
      if (freshPlan) {
        setCurrentSubscription({ ...currentSubscription, plan: freshPlan });
      }
    }
  };

  // Hierarchy check: basic (all standard) < premium (all 15 luxury templates)
  const canAccessTemplate = (templateTier: PlanCode): boolean => {
    if (isTrialExpired) return false;
    const currentPlanCode = currentSubscription?.plan?.code || 'basic';
    if (currentPlanCode === 'premium' || currentPlanCode === 'premium_plus') return true;
    return templateTier === 'basic' || templateTier === 'free';
  };

  const canAccessFeature = (featureKey: 'food_images' | 'custom_branding' | 'multi_language' | 'table_qr' | 'analytics' | 'custom_qr_logo' | 'ordering' | 'upi_payment' | 'bulk_import' | 'review_booster'): boolean => {
    if (isTrialExpired) return false;
    const plan = currentSubscription?.plan;
    if (!plan) return false;
    switch (featureKey) {
      case 'food_images':
        return plan.allow_food_images;
      case 'custom_branding':
        return plan.remove_saas_branding;
      case 'multi_language':
        return plan.allow_multi_language;
      case 'table_qr':
        return plan.allow_table_qr;
      case 'analytics':
        return true;
      case 'custom_qr_logo':
      case 'ordering':
      case 'upi_payment':
      case 'bulk_import':
      case 'review_booster':
        return plan.code === 'premium' || plan.code === 'premium_plus';
      default:
        return false;
    }
  };

  const upgradeSubscription = async (
    targetPlanCode: PlanCode, 
    cycle: 'monthly' | 'yearly',
    paymentDetails?: Partial<PaymentRecord>
  ): Promise<boolean> => {
    const targetPlan = plans.find(p => p.code === targetPlanCode);
    if (!targetPlan) return false;

    const amount = cycle === 'yearly' ? targetPlan.yearly_price : targetPlan.monthly_price;
    const periodDays = cycle === 'yearly' ? 365 : 30;

    const newSubscription: Subscription = {
      id: `sub-${Date.now()}`,
      restaurant_id: currentRestaurantId,
      plan_id: targetPlan.id,
      status: 'active',
      is_trial: false,
      trial_ends_at: undefined,
      billing_cycle: cycle,
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + periodDays * 86400000).toISOString(),
      auto_renew: true,
      plan: targetPlan
    };

    saveStoredSubscription(newSubscription);
    setCurrentSubscription(newSubscription);

    // Record payment audit entry
    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      restaurant_id: currentRestaurantId,
      plan_id: targetPlan.id,
      amount,
      currency: 'INR',
      payment_gateway: paymentDetails?.payment_gateway || 'razorpay_sandbox',
      gateway_order_id: paymentDetails?.gateway_order_id || `order_${Math.random().toString(36).substring(7).toUpperCase()}`,
      gateway_payment_id: paymentDetails?.gateway_payment_id || `pay_${Math.random().toString(36).substring(7).toUpperCase()}`,
      status: 'success',
      invoice_number: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      billing_cycle: cycle,
      created_at: new Date().toISOString()
    };
    recordPayment(newPayment);
    setPayments(prev => [newPayment, ...prev]);

    // Delightful celebration effect
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    closeUpgradeModal();
    return true;
  };

  const scheduleDowngrade = (targetPlanCode: PlanCode) => {
    if (!currentSubscription) return;
    const targetPlan = plans.find(p => p.code === targetPlanCode);
    if (!targetPlan) return;

    // Preserves access until period end, then switches
    const updatedSub: Subscription = {
      ...currentSubscription,
      status: 'downgrade_scheduled',
      scheduled_downgrade_plan_id: targetPlan.id,
      auto_renew: false
    };

    saveStoredSubscription(updatedSub);
    setCurrentSubscription(updatedSub);
  };

  const cancelSubscription = () => {
    if (!currentSubscription) return;
    const basicPlan = plans.find(p => p.code === 'basic') || DEFAULT_PLANS[0];
    const updatedSub: Subscription = {
      ...currentSubscription,
      status: 'downgrade_scheduled',
      scheduled_downgrade_plan_id: basicPlan.id,
      auto_renew: false
    };
    saveStoredSubscription(updatedSub);
    setCurrentSubscription(updatedSub);
  };

  return (
    <PlanContext.Provider
      value={{
        plans,
        currentSubscription,
        payments,
        isTrial,
        trialDaysRemaining,
        isTrialExpired,
        isSubscriptionActive,
        isUpgradeModalOpen,
        requiredTierForModal,
        openUpgradeModal,
        closeUpgradeModal,
        updatePlanPricing,
        canAccessTemplate,
        canAccessFeature,
        upgradeSubscription,
        scheduleDowngrade,
        cancelSubscription,
        refreshSubscription,
        simulateExpireTrial,
        resetTrial
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) throw new Error('usePlan must be used within a PlanProvider');
  return context;
};
