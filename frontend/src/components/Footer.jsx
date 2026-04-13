import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer footer-custom" style={{ background: '#0F172A', color: '#F8FAFC', paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div className="container">
        <div className="footer-custom__row" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" className="footer-custom__brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>Original Grand Plast</span>
          </Link>
          <div className="footer-custom__nav" style={{ display: 'flex', gap: '1.5rem', fontWeight: 500 }}>
            <Link to="/" style={{ color: '#CBD5E1', textDecoration: 'none' }}>{t('home')}</Link>
            <Link to="/about" style={{ color: '#CBD5E1', textDecoration: 'none' }}>{t('about')}</Link>
            <Link to="/products" style={{ color: '#CBD5E1', textDecoration: 'none' }}>{t('products')}</Link>
            <Link to="/news" style={{ color: '#CBD5E1', textDecoration: 'none' }}>{t('news')}</Link>
            <Link to="/contacts" style={{ color: '#CBD5E1', textDecoration: 'none' }}>{t('contacts')}</Link>
          </div>
          <div className="footer-custom__contacts" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="tel:+998996066333" style={{ color: '#10B981', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={16} />
              +998 99 606 63 33
            </a>
            <span className="footer-custom__email" style={{ color: '#94A3B8' }}>ogp-info@mail.ru</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
