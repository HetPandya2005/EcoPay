/* =========================================================
   AuthLayout.jsx — Layout for Login/Signup/Onboarding/KYC
   Centered card on gradient background
   ========================================================= */

import { Outlet } from 'react-router-dom';
import './AuthLayout.css';

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-layout__bg" />
      <div className="auth-layout__glow auth-layout__glow--1" />
      <div className="auth-layout__glow auth-layout__glow--2" />
      <main className="auth-layout__content">
        <Outlet />
      </main>
    </div>
  );
}
