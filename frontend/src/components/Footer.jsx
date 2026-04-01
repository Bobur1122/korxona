import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-simple">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <img src="/logo.png" alt="Original Grand Plast" style={{ height: 36, width: 'auto', objectFit: 'contain' }} />
          </Link>
          <div className="footer-links-row">
            <Link to="/" className="footer-link">Bosh sahifa</Link>
            <Link to="/about" className="footer-link">Biz haqimizda</Link>
            <Link to="/products" className="footer-link">Mahsulotlar</Link>
          </div>
          <div className="footer-contact-row">
            <a href="tel:+998996066333" style={{ color: 'inherit', textDecoration: 'none' }}>
              <Phone size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              +998 99 606 63 33
            </a>
            <span>ogp-info@mail.ru</span>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Original Grand Plast MChJ. Toshkent, Uchtepa tumani. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  );
}
