import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Newspaper,
  ChevronLeft, ChevronRight, LogOut, Home, Menu, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminLayout({ panelRole }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();
  const { t } = useLanguage();
  const currentRole = panelRole || user?.role || 'user';
  const panel = currentRole === 'admin' || currentRole === 'direktor' || currentRole === 'hodim'
    ? currentRole
    : 'admin';
  const basePath = panel === 'admin' ? '/admin' : panel === 'direktor' ? '/director' : '/hodim';

  const navItems = panel === 'admin'
    ? [
        { to: `${basePath}`, icon: LayoutDashboard, label: t('adminDashboard'), exact: true },
        { to: `${basePath}/products`, icon: Package, label: t('adminProducts') },
        { to: `${basePath}/news`, icon: Newspaper, label: t('adminNews') },
        { to: `${basePath}/orders`, icon: ShoppingCart, label: t('adminOrders') },
        { to: `${basePath}/users`, icon: Users, label: t('adminUsers') },
        { to: `${basePath}/promo`, icon: Tag, label: t('adminPromo') },
      ]
    : panel === 'direktor'
      ? [
          { to: `${basePath}`, icon: LayoutDashboard, label: t('adminDashboard'), exact: true },
          { to: `${basePath}/products`, icon: Package, label: t('adminProducts') },
          { to: `${basePath}/news`, icon: Newspaper, label: t('adminNews') },
          { to: `${basePath}/orders`, icon: ShoppingCart, label: t('adminOrders') },
        ]
      : [
          { to: `${basePath}/orders`, icon: ShoppingCart, label: t('adminOrders'), exact: true },
        ];

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

  // Force chart/layout recalculation when sidebar state changes.
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 320);
    return () => clearTimeout(timer);
  }, [collapsed, mobileOpen, location.pathname]);

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
            title={collapsed ? t('backToSite') : undefined}
            onClick={() => { if (window.innerWidth <= 768) setMobileOpen(false); }}
          >
            <Home size={20} />
            <span className="sidebar-link-text">{t('backToSite')}</span>
          </Link>
          <button
            onClick={() => { logout(); if (window.innerWidth <= 768) setMobileOpen(false); }}
            className="sidebar-link"
            style={{ width: '100%' }}
            title={collapsed ? t('logout') : undefined}
            id="admin-logout"
          >
            <LogOut size={20} />
            <span className="sidebar-link-text">{t('logout')}</span>
          </button>
        </div>
      </aside>

      <main className={`admin-main ${collapsed ? 'collapsed' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
}
