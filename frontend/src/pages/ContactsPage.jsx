import { Phone, Mail, MapPin, Clock, Globe, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useState } from 'react';

export default function ContactsPage() {
  const { t } = useLanguage();
  const [formSent, setFormSent] = useState(false);

  const contactItems = [
    { icon: MapPin, label: t('address'), value: t('addressValue'), color: '#00A651' },
    { icon: Phone, label: t('phone'), value: '+998 99 606 63 33', href: 'tel:+998996066333', color: '#0EA5E9' },
    { icon: Phone, label: `${t('phone')} 2`, value: '+998 99 818 63 33', href: 'tel:+998998186333', color: '#0EA5E9' },
    { icon: Phone, label: `${t('phone')} 3`, value: '+998 99 828 63 33', href: 'tel:+998998286333', color: '#0EA5E9' },
    { icon: Mail, label: t('email'), value: 'ogp-info@mail.ru', href: 'mailto:ogp-info@mail.ru', color: '#F59E0B' },
    { icon: Globe, label: t('website'), value: 'ogp.uz', href: 'https://ogp.uz', color: '#8B5CF6' },
    { icon: Clock, label: t('workHours'), value: t('workHoursValue'), color: '#EF4444' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => setFormSent(false), 3000);
  };

  return (
    <div className="fade-in">
      {/* Hero */}
      <section style={{
        background: '#0F172A', color: '#fff',
        padding: 'calc(var(--header-height) + 60px) 0 60px',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: 8 }}>{t('contactTitle')}</h1>
          <p style={{ color: '#94A3B8', fontSize: '1.125rem', maxWidth: 600, margin: '0 auto' }}>{t('contactSubtitle')}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
            {/* Contact Info Cards */}
            <div>
              <div style={{ display: 'grid', gap: 12 }}>
                {contactItems.map((item, i) => (
                  <a key={i} href={item.href || '#'} style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 20px', background: '#F8FAFC',
                    border: '1px solid #E2E8F0', borderRadius: 12,
                    textDecoration: 'none', color: 'inherit',
                    transition: 'all 0.2s ease'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = item.color; e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: `${item.color}15`, color: item.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <item.icon size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#0F172A' }}>{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div style={{
              background: '#F8FAFC', border: '1px solid #E2E8F0',
              borderRadius: 16, padding: 32
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 4, color: '#0F172A' }}>{t('sendMessage')}</h3>
              <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: 24 }}>{t('contactSubtitle')}</p>
              
              {formSent ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#00A651' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(0,166,81,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Send size={24} />
                  </div>
                  <h4>Xabaringiz yuborildi!</h4>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">{t('yourName')}</label>
                    <input type="text" className="form-input" placeholder={t('yourName')} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">{t('email')}</label>
                      <input type="email" className="form-input" placeholder={t('yourEmail')} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t('phone')}</label>
                      <input type="tel" className="form-input" placeholder={t('yourPhone')} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('message')}</label>
                    <textarea className="form-input" rows={4} placeholder={t('message')} required></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px 24px' }}>
                    <Send size={16} /> {t('send')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section style={{ background: '#F8FAFC', padding: '60px 0' }}>
        <div className="container">
          <div style={{
            borderRadius: 16, overflow: 'hidden', border: '1px solid #E2E8F0',
            height: 400, boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
          }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.254169893101!2d69.27927647605068!3d41.31115397131356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sTashkent%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1703147698761!5m2!1sen!2s"
              width="100%" height="100%" style={{ border: 0 }}
              allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              title="Original Grand Plast"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
