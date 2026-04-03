import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer" style={{ background: '#0F172A', color: '#F8FAFC', paddingTop: '4rem', paddingBottom: '2rem' }}>
      <div className="container">
        <div className="footer-simple" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>Original Grand Plast</span>
          </Link>
          <div className="footer-links-row" style={{ display: 'flex', gap: '1.5rem', fontWeight: 500 }}>
            <Link to="/" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Bosh sahifa</Link>
            <Link to="/about" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Biz haqimizda</Link>
            <Link to="/products" style={{ color: '#CBD5E1', textDecoration: 'none' }}>Mahsulotlar</Link>
          </div>
          <div className="footer-contact-row" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a href="tel:+998996066333" style={{ color: '#10B981', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={16} />
              +998 99 606 63 33
            </a>
            <span style={{ color: '#94A3B8' }}>info@grandplast.uz</span>
          </div>
        </div>
        <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', textAlign: 'center', color: '#64748B', fontSize: '0.875rem' }}>
          © {new Date().getFullYear()} Original Grand Plast MChJ. Toshkent, Uchtepa tumani. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  );
}
