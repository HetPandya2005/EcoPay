/* =========================================================
   DashboardLayout.jsx — Layout for private/app pages
   Features: Sidebar navigation, header, responsive
   ========================================================= */

import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Coins, TrendingUp, PlusCircle,
  Store, User, Settings, LogOut, Menu, X, Bell, Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEconomy } from '../../context/EconomyContext';
import { NAV_ITEMS, ROUTES } from '../../utils/constants';
import './DashboardLayout.css';

const ICON_MAP = {
  LayoutDashboard, Coins, TrendingUp, PlusCircle, Store, User, Settings,
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { contributorLevel, unreadNotifications } = useEconomy();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="dashboard-layout">
      {/* ── Sidebar ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="sidebar__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <Zap className="sidebar__logo-icon" size={24} />
            <span className="sidebar__logo-text">EcoPay</span>
          </div>
          <button
            className="sidebar__close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar__nav">
          {NAV_ITEMS.map(item => {
            const Icon = ICON_MAP[item.icon];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                {Icon && <Icon size={20} />}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">{user?.name || 'User'}</span>
              <span className="sidebar__user-level">
                {contributorLevel.icon} {contributorLevel.name}
              </span>
            </div>
          </div>
          <button className="sidebar__logout" onClick={handleLogout} aria-label="Logout">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="dashboard-layout__main">
        {/* Header */}
        <header className="dashboard-header">
          <button
            className="dashboard-header__menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div className="dashboard-header__right">
            <button className="dashboard-header__notif" aria-label="Notifications">
              <Bell size={20} />
              {unreadNotifications > 0 && (
                <span className="dashboard-header__notif-badge">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="dashboard-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
