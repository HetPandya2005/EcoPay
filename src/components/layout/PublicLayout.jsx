/* =========================================================
   PublicLayout.jsx — Layout for public pages (Landing, etc.)
   Full-width, no sidebar, with animated background
   ========================================================= */

import { Outlet } from 'react-router-dom';
import './PublicLayout.css';

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <div className="public-layout__bg" />
      <main className="public-layout__content">
        <Outlet />
      </main>
    </div>
  );
}
