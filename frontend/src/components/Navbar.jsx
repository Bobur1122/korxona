import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: '/', label: 'Bosh sahifa' },
    { to: '/about', label: 'Biz haqimizda' },
    { to: '/products', label: 'Mahsulotlar' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Original Grand Plast" style={{ height: 38, width: 'auto', objectFit: 'contain' }} />
        </Link>

        <nav className="nav-links">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${isActive(link.to) ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
            >
              Admin Panel
            </Link>
          )}
        </nav>

        <div className="nav-actions">
          <Link to="/cart" className="cart-btn" id="cart-button">
            <ShoppingCart size={20} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          {user ? (
            <Link to="/profile" className="btn btn-ghost" id="profile-button">
              <User size={18} />
              {user.name.split(' ')[0]}
            </Link>
          ) : (
            <Link to="/login" className="btn btn-primary" id="login-button">
              Kirish
            </Link>
          )}

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            id="mobile-menu-toggle"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="mobile-nav open">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${isActive(link.to) ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="nav-link" onClick={() => setMobileOpen(false)}>
              Admin Panel
            </Link>
          )}
          {!user && (
            <Link to="/login" className="btn btn-primary" onClick={() => setMobileOpen(false)} style={{ marginTop: 'var(--space-4)' }}>
              Kirish
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
