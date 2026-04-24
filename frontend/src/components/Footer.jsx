import { Link } from 'react-router-dom';
import { Phone, Mail, Instagram, Facebook, Linkedin, Send, MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="ft" id="footer">
      {/* === Wave divider (decorative) === */}
      <div className="ft__wave" aria-hidden="true">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,40 C240,100 480,0 720,50 C960,100 1200,20 1440,60 L1440,100 L0,100 Z" />
        </svg>
      </div>

      {/* === Main Footer Content === */}
      <div className="ft__body">
        <div className="container">
          <div className="ft__grid">
            {/* Col 1: Brand */}
            <div className="ft__col ft__col--brand">
              <Link to="/" className="ft__logo-link" onClick={scrollToTop}>
                <img src="/logo.png" alt="OGP" className="ft__logo-img" />
                <div className="ft__logo-text">
                  <span className="ft__logo-name">Original Grand Plast</span>
                  <span className="ft__logo-sub">{t('footerBrandSubtitle')}</span>
                </div>
              </Link>
              <p className="ft__about">{t('footerDesc')}</p>
              <div className="ft__social-row">
                {[
                  { href: 'https://t.me', icon: Send, label: 'Telegram', color: '#0088cc' },
                  { href: 'https://instagram.com', icon: Instagram, label: 'Instagram', color: '#E1306C' },
                  { href: 'https://facebook.com', icon: Facebook, label: 'Facebook', color: '#1877F2' },
                  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn', color: '#0A66C2' },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="ft__social" aria-label={s.label} style={{'--hover-color': s.color}}>
                    <s.icon size={17} />
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div className="ft__col ft__col--nav">
              <h4 className="ft__heading">{t('quickLinks')}</h4>
              <ul className="ft__nav">
                {[
                  { to: '/', label: t('home') },
                  { to: '/about', label: t('about') },
                  { to: '/products', label: t('products') },
                  { to: '/news', label: t('news') },
                  { to: '/contacts', label: t('contacts') },
                ].map(link => (
                  <li key={link.to}>
                    <Link to={link.to} className="ft__nav-link">
                      <ArrowRight size={13} className="ft__nav-arrow" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Contacts */}
            <div className="ft__col">
              <h4 className="ft__heading">{t('contactInfo')}</h4>
              <div className="ft__contacts">
                <a href="tel:+998996066333" className="ft__contact-card">
                  <div className="ft__contact-glow" style={{'--glow': '#00A651'}}></div>
                  <Phone size={18} className="ft__contact-icon" />
                  <div>
                    <small>{t('footerPhone')}</small>
                    <span>+998 99 606 63 33</span>
                  </div>
                </a>
                <a href="mailto:ogp-info@mail.ru" className="ft__contact-card">
                  <div className="ft__contact-glow" style={{'--glow': '#3B82F6'}}></div>
                  <Mail size={18} className="ft__contact-icon" />
                  <div>
                    <small>{t('footerEmail')}</small>
                    <span>ogp-info@mail.ru</span>
                  </div>
                </a>
                <div className="ft__contact-card ft__contact-card--static">
                  <div className="ft__contact-glow" style={{'--glow': '#F59E0B'}}></div>
                  <MapPin size={18} className="ft__contact-icon" />
                  <div>
                    <small>{t('footerAddress')}</small>
                    <span>{t('footerAddressValue')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
