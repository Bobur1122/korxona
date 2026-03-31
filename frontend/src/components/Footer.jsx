import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo" style={{ color: 'white' }}>
              Tikuv<span style={{ color: 'var(--color-accent-light)' }}>Pro</span>
            </Link>
            <p>
              Professional tikuvchilik kompaniyasi. Yuqori sifatli kiyimlar ishlab chiqarish
              bo'yicha yetakchi korxona.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Sahifalar</h4>
            <Link to="/" className="footer-link">Bosh sahifa</Link>
            <Link to="/about" className="footer-link">Biz haqimizda</Link>
            <Link to="/products" className="footer-link">Mahsulotlar</Link>
          </div>

          <div>
            <h4 className="footer-title">Xizmatlar</h4>
            <span className="footer-link">Buyurtma tikish</span>
            <span className="footer-link">Ulgurji sotish</span>
            <span className="footer-link">Maxsus dizayn</span>
          </div>

          <div>
            <h4 className="footer-title">Aloqa</h4>
            <span className="footer-link">📞 +998 90 123 45 67</span>
            <span className="footer-link">✉️ info@tikuvpro.uz</span>
            <span className="footer-link">📍 Toshkent, O'zbekiston</span>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} TikuvPro. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  );
}
