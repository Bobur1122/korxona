import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Newspaper,
  ChevronLeft, ChevronRight, LogOut, Home, Menu, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/products', icon: Package, label: 'Mahsulotlar' },
  { to: '/admin/news', icon: Newspaper, label: 'Yangiliklar' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Buyurtmalar' },
  { to: '/admin/users', icon: Users, label: 'Foydalanuvchilar' },
  { to: '/admin/promo', icon: Tag, label: 'Promokodlar' },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close mobile sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  return (
    <div className="admin-layout">
      {/* Mobile top bar */}
      <div className="admin-mobile-toggle">
        <button onClick={() => setMobileOpen(!mobileOpen)} id="mobile-sidebar-toggle">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <img src="/logo.png" alt="OGP" className="admin-mobile-logo" />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="admin-mobile-overlay" onClick={() => setMobileOpen(false)}></div>
      )}

      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <img src="/logo.png" alt="OGP" className="sidebar-brand admin-sidebar-logo" />
          <button
            className="sidebar-toggle"
            onClick={() => {
              if (window.innerWidth <= 768) {
                setMobileOpen(false);
              } else {
                setCollapsed(!collapsed);
              }
            }}
            id="sidebar-toggle"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-link ${isActive(item) ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
              onClick={() => { if (window.innerWidth <= 768) setMobileOpen(false); }}
            >
              <item.icon size={20} />
              <span className="sidebar-link-text">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div style={{ padding: '0 var(--space-3)', marginTop: 'auto' }}>
          <Link
            to="/"
            className="sidebar-link"
            title={collapsed ? 'Saytga qaytish' : undefined}
            onClick={() => { if (window.innerWidth <= 768) setMobileOpen(false); }}
          >
            <Home size={20} />
            <span className="sidebar-link-text">Saytga qaytish</span>
          </Link>
          <button
            onClick={() => { logout(); if (window.innerWidth <= 768) setMobileOpen(false); }}
            className="sidebar-link"
            style={{ width: '100%' }}
            title={collapsed ? 'Chiqish' : undefined}
            id="admin-logout"
          >
            <LogOut size={20} />
            <span className="sidebar-link-text">Chiqish</span>
          </button>
        </div>
      </aside>

      <main className={`admin-main ${collapsed ? 'collapsed' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
}
