import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { PlanProvider } from './context/PlanContext';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { CustomerMenu } from './pages/CustomerMenu';

// Owner Dashboard Layout & Pages
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { RestaurantProfile } from './pages/dashboard/RestaurantProfile';
import { MenuManagement } from './pages/dashboard/MenuManagement';
import { MenuDesignStudio } from './pages/dashboard/MenuDesignStudio';
import { TemplateMarketplace } from './pages/dashboard/TemplateMarketplace';
import { QRCodeStudio } from './pages/dashboard/QRCodeStudio';
import { TablesManagement } from './pages/dashboard/TablesManagement';
import { AnalyticsView } from './pages/dashboard/AnalyticsView';
import { LanguagesManager } from './pages/dashboard/LanguagesManager';
import { SubscriptionBilling } from './pages/dashboard/SubscriptionBilling';
import { SettingsView } from './pages/dashboard/SettingsView';

// Super Admin Layout & Pages
import { AdminLayout } from './layouts/AdminLayout';
import { AdminOverview } from './pages/admin/AdminOverview';
import { RestaurantsList } from './pages/admin/RestaurantsList';
import { PlanPricingManager } from './pages/admin/PlanPricingManager';
import { TemplateAccessManager } from './pages/admin/TemplateAccessManager';

// Inner wrapper to supply currentRestaurantId to PlanProvider
const AppRoutes: React.FC = () => {
  const { currentRestaurant } = useRestaurant();
  const currentRestaurantId = currentRestaurant?.id || '';

  return (
    <PlanProvider currentRestaurantId={currentRestaurantId}>
      <Routes>
        {/* Public SaaS Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Public Mobile-First Customer QR Menu (No Auth Needed!) */}
        <Route path="/menu/:restaurantSlug" element={<CustomerMenu />} />

        {/* Restaurant Owner Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="profile" element={<RestaurantProfile />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="design" element={<MenuDesignStudio />} />
          <Route path="templates" element={<TemplateMarketplace />} />
          <Route path="qr-code" element={<QRCodeStudio />} />
          <Route path="tables" element={<TablesManagement />} />
          <Route path="analytics" element={<AnalyticsView />} />
          <Route path="languages" element={<LanguagesManager />} />
          <Route path="billing" element={<SubscriptionBilling />} />
          <Route path="settings" element={<SettingsView />} />
        </Route>

        {/* Super Admin Command Center */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="restaurants" element={<RestaurantsList />} />
          <Route path="pricing" element={<PlanPricingManager />} />
          <Route path="templates" element={<TemplateAccessManager />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PlanProvider>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RestaurantProvider>
          <AppRoutes />
        </RestaurantProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
