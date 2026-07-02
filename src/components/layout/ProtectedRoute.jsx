/* =========================================================
   ProtectedRoute.jsx — Route guard for authenticated pages
   Handles auth check, onboarding, and KYC redirects
   ========================================================= */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show nothing while loading auth state
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-screen__spinner" />
      </div>
    );
  }

  // Not logged in → send to login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Logged in but hasn't completed onboarding (and not currently on onboarding page)
  if (!user.onboardingComplete && location.pathname !== ROUTES.ONBOARDING) {
    return <Navigate to={ROUTES.ONBOARDING} replace />;
  }

  // Onboarding done but KYC not verified (and not currently on KYC page)
  if (
    user.onboardingComplete &&
    user.kycStatus !== 'verified' &&
    location.pathname !== ROUTES.KYC
  ) {
    return <Navigate to={ROUTES.KYC} replace />;
  }

  return children;
}
