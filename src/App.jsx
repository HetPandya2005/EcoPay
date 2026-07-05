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
import { ROUTES } from './utils/constants';

/* ─── Placeholder page wrappers (replaced in later phases) ── */
const Landing = () => <PagePlaceholder title="EcoPay" description="Landing page — Phase 6" />;
/* Login is now a full page component imported from ./pages/Login */
/* Signup is now a full page component imported from ./pages/Signup */
const Partners = () => <PagePlaceholder title="Partner Brands" description="Brands page — Phase 5" />;
/* Onboarding is now a full page component imported from ./pages/Onboarding */
/* KYC is now a full page component imported from ./pages/KYC */
const Earn = () => <PagePlaceholder title="Earn Credits" description="Earn page — Phase 4" />;
/* BuyCredits is now a full page component imported from ./pages/BuyCredits */
/* CreateRequest is now a full page component imported from ./pages/CreateRequest */
const Profile = () => <PagePlaceholder title="Profile" description="Profile page — Phase 6" />;
const SettingsPage = () => <PagePlaceholder title="Settings" description="Settings page — Phase 6" />;

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
                <Route path={ROUTES.PARTNERS} element={<Partners />} />
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
                <Route path={ROUTES.EARN} element={<Earn />} />
                <Route path={ROUTES.BUY_CREDITS} element={<BuyCreditsPage />} />
                <Route path={ROUTES.CREATE_REQUEST} element={<CreateRequest />} />
                <Route path={ROUTES.PROFILE} element={<Profile />} />
                <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
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
