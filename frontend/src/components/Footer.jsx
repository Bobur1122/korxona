import { Link } from 'react-router-dom';
import { Phone, Mail, Instagram, Facebook, Linkedin, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const socials = [
    { href: 'https://t.me', label: t('socialTelegram'), icon: Send },
    { href: 'https://instagram.com', label: t('socialInstagram'), icon: Instagram },
    { href: 'https://facebook.com', label: t('socialFacebook'), icon: Facebook },
    { href: 'https://linkedin.com', label: t('socialLinkedin'), icon: Linkedin },
  ];

  return (
    <footer className="footer footer-custom">
      <div className="container">
        <div className="footer-custom__grid">
          <div className="footer-custom__brand-col">
            <Link to="/" className="footer-custom__brand">
              <img src="/logo.png" alt="Original Grand Plast" className="footer-custom__logo" />
              <span>Original Grand Plast</span>
            </Link>
            <p className="footer-custom__desc">{t('footerDesc')}</p>
          </div>

          <div className="footer-custom__links-col">
            <h4 className="footer-custom__title">{t('quickLinks')}</h4>
            <div className="footer-custom__links">
              <Link to="/">{t('home')}</Link>
              <Link to="/about">{t('about')}</Link>
              <Link to="/products">{t('products')}</Link>
              <Link to="/news">{t('news')}</Link>
              <Link to="/contacts">{t('contacts')}</Link>
            </div>
          </div>

          <div className="footer-custom__contacts-col">
            <h4 className="footer-custom__title">{t('contactInfo')}</h4>
            <a href="tel:+998996066333" className="footer-custom__contact">
              <Phone size={16} /> +998 99 606 63 33
            </a>
            <a href="mailto:ogp-info@mail.ru" className="footer-custom__contact footer-custom__email">
              <Mail size={16} /> ogp-info@mail.ru
            </a>
          </div>

          <div className="footer-custom__social-col">
            <h4 className="footer-custom__title">{t('followUs')}</h4>
            <div className="footer-custom__socials">
              {socials.map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label} className="footer-custom__social">
                  <item.icon size={20} strokeWidth={2.2} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

