/* =========================================================
   App.jsx — Root application component
   Routing structure per Architecture V2
   ========================================================= */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EconomyProvider } from './context/EconomyContext';
import { ToastProvider } from './components/ui/Toast';

import PublicLayout from './components/layout/PublicLayout';
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

import PagePlaceholder from './pages/PagePlaceholder';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import KYC from './pages/KYC';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateRequest from './pages/CreateRequest';
import BuyCreditsPage from './pages/BuyCredits';
import PartnerBrands from './pages/PartnerBrands';
import EarnCredits from './pages/EarnCredits';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import { ROUTES } from './utils/constants';
/* Login is now a full page component imported from ./pages/Login */
/* Signup is now a full page component imported from ./pages/Signup */
/* Partner Brands is now a full page component imported from ./pages/PartnerBrands */
/* Onboarding is now a full page component imported from ./pages/Onboarding */
/* KYC is now a full page component imported from ./pages/KYC */
/* EarnCredits is now a full page component imported from ./pages/EarnCredits */
/* BuyCredits is now a full page component imported from ./pages/BuyCredits */
/* CreateRequest is now a full page component imported from ./pages/CreateRequest */
/* Profile is now a full page component imported from ./pages/Profile */
/* Settings is now a full page component imported from ./pages/Settings */

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EconomyProvider>
          <ToastProvider>
            <Routes>
              {/* ── Public Routes ── */}
              <Route element={<PublicLayout />}>
                <Route path={ROUTES.LANDING} element={<Landing />} />
                <Route path={ROUTES.PARTNERS} element={<PartnerBrands />} />
              </Route>

              {/* ── Auth Routes ── */}
              <Route element={<AuthLayout />}>
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.SIGNUP} element={<Signup />} />
              </Route>

              {/* ── Protected Routes (require auth) ── */}
              <Route element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                <Route path={ROUTES.EARN} element={<EarnCredits />} />
                <Route path={ROUTES.BUY_CREDITS} element={<BuyCreditsPage />} />
                <Route path={ROUTES.CREATE_REQUEST} element={<CreateRequest />} />
                <Route path={ROUTES.PARTNERS} element={<PartnerBrands />} />
                <Route path={ROUTES.PROFILE} element={<Profile />} />
                <Route path={ROUTES.SETTINGS} element={<Settings />} />
              </Route>

              {/* ── Onboarding & KYC (auth required but no dashboard layout) ── */}
              <Route element={<AuthLayout />}>
                <Route path={ROUTES.ONBOARDING} element={<Onboarding />} />
                <Route path={ROUTES.KYC} element={<KYC />} />
              </Route>

              {/* ── Catch-all ── */}
              <Route path="*" element={<Navigate to={ROUTES.LANDING} replace />} />
            </Routes>
          </ToastProvider>
        </EconomyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
