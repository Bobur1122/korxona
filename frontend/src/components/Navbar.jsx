import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, ChevronDown, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect, useRef } from 'react';

const LANG_LABELS = { uz: "O'zbekcha", ru: 'Russian', en: 'English' };
const LANG_FLAGS = { uz: 'UZ', ru: 'RU', en: 'EN' };

export default function Navbar() {
  const { user, isBackoffice, backofficePath } = useAuth();
  const { totalItems } = useCart();
  const { language, changeLanguage, t } = useLanguage();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const langRef = useRef(null);
  const searchRef = useRef(null);

  // Scroll detection for blur effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close lang dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const links = [
    { to: '/', label: t('home') },
    { to: '/about', label: t('about') },
    { to: '/products', label: t('products') },
    { to: '/news', label: t('news') },
    { to: '/contacts', label: t('contacts') },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`gp-header ${scrolled ? 'gp-header--scrolled' : ''} ${location.pathname !== '/' ? 'gp-header--light-page' : ''}`} id="main-header">
      <div className="gp-header__inner">
        {/* Logo - far left */}
        <Link to="/" className="gp-header__logo" id="header-logo">
          <img src="/logo.png" alt="Original Grand Plast" />
        </Link>

        {/* Navigation - right next to logo */}
        <nav className="gp-header__nav" id="main-nav">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`gp-header__nav-link ${isActive(link.to) ? 'gp-header__nav-link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          {isBackoffice && backofficePath && (
            <Link
              to={backofficePath}
              className={`gp-header__nav-link ${location.pathname.startsWith(backofficePath) ? 'gp-header__nav-link--active' : ''}`}
            >
              {t('adminPanel')}
            </Link>
          )}
        </nav>

        {/* Right side actions */}
        <div className="gp-header__actions">
          {/* Search */}
          <div className="gp-header__search-wrap" ref={searchRef}>
            <button
              className="gp-header__icon-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
              id="search-toggle"
            >
              <Search size={18} />
            </button>
            {searchOpen && (
              <div className="gp-header__search-dropdown">
                <input
                  type="text"
                  placeholder={t('search')}
                  className="gp-header__search-input"
                  autoFocus
                  id="header-search-input"
                />
              </div>
            )}
          </div>

          {/* Login / Profile */}
          {user ? (
            <Link to="/profile" className="gp-header__icon-btn gp-header__user-btn" id="profile-button">
              <User size={18} />
            </Link>
          ) : (
            <Link to="/login" className="gp-header__icon-btn" id="login-button">
              <User size={18} />
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" className="gp-header__icon-btn gp-header__cart-btn" id="cart-button">
            <ShoppingCart size={18} />
            {totalItems > 0 && <span className="gp-header__cart-badge">{totalItems}</span>}
          </Link>

          {/* Language Switcher */}
          <div className="gp-header__lang" ref={langRef}>
            <button
              className="gp-header__lang-btn"
              onClick={() => setLangDropdown(!langDropdown)}
              id="language-switcher"
            >
              <Globe size={16} />
              <span className="gp-header__lang-code">{language.toUpperCase()}</span>
              <ChevronDown size={14} className={`gp-header__lang-chevron ${langDropdown ? 'gp-header__lang-chevron--open' : ''}`} />
            </button>
            {langDropdown && (
              <div className="gp-header__lang-dropdown">
                {Object.entries(LANG_LABELS).map(([code, label]) => (
                  <button
                    key={code}
                    className={`gp-header__lang-option ${language === code ? 'gp-header__lang-option--active' : ''}`}
                    onClick={() => { changeLanguage(code); setLangDropdown(false); }}
                  >
                    <span className="gp-header__lang-flag">{LANG_FLAGS[code]}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="gp-header__mobile-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            id="mobile-menu-toggle"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <nav className="gp-header__mobile-nav">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`gp-header__mobile-link ${isActive(link.to) ? 'gp-header__mobile-link--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isBackoffice && backofficePath && (
            <Link to={backofficePath} className="gp-header__mobile-link" onClick={() => setMobileOpen(false)}>
              {t('adminPanel')}
            </Link>
          )}

          {/* Mobile language switcher */}
          <div className="gp-header__mobile-lang">
            {Object.entries(LANG_LABELS).map(([code, label]) => (
              <button
                key={code}
                className={`gp-header__mobile-lang-btn ${language === code ? 'gp-header__mobile-lang-btn--active' : ''}`}
                onClick={() => { changeLanguage(code); }}
              >
                {LANG_FLAGS[code]} {code.toUpperCase()}
              </button>
            ))}
          </div>

          {!user && (
            <Link to="/login" className="btn btn-primary" onClick={() => setMobileOpen(false)} style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}>
              {t('login')}
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
