import {
  Building2,
  Clock3,
  Droplets,
  Gem,
  Globe,
  Handshake,
  Leaf,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sprout,
  Target,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();

  const milestones = [
    {
      label: '2005',
      title: t('aboutMilestone1Title'),
      desc: t('aboutMilestone1Desc'),
      variant: 'outline',
    },
    {
      label: '2013',
      title: t('aboutMilestone2Title'),
      desc: t('aboutMilestone2Desc'),
      variant: 'accent',
    },
    {
      label: t('aboutMilestone3Label'),
      title: t('aboutMilestone3Title'),
      desc: t('aboutMilestone3Desc'),
      variant: 'secondary',
    },
  ];

  const activities = [
    { icon: Sprout, title: t('aboutActivity1Title'), desc: t('aboutActivity1Desc') },
    { icon: Package, title: t('aboutActivity2Title'), desc: t('aboutActivity2Desc') },
    { icon: ShoppingBag, title: t('aboutActivity3Title'), desc: t('aboutActivity3Desc') },
    { icon: Droplets, title: t('aboutActivity4Title'), desc: t('aboutActivity4Desc') },
    { icon: Building2, title: t('aboutActivity5Title'), desc: t('aboutActivity5Desc') },
    { icon: ShieldCheck, title: t('aboutActivity6Title'), desc: t('aboutActivity6Desc') },
  ];

  const values = [
    { icon: Target, title: t('aboutValue1Title'), desc: t('aboutValue1Desc') },
    { icon: Gem, title: t('aboutValue2Title'), desc: t('aboutValue2Desc') },
    { icon: Leaf, title: t('aboutValue3Title'), desc: t('aboutValue3Desc') },
    { icon: Handshake, title: t('aboutValue4Title'), desc: t('aboutValue4Desc') },
  ];

  const contacts = [
    { icon: MapPin, label: t('aboutContactAddressLabel'), value: t('aboutContactAddressValue') },
    { icon: Phone, label: t('aboutContactPhone1Label'), value: '+998 99 606 63 33' },
    { icon: Phone, label: t('aboutContactPhone2Label'), value: '+998 99 818 63 33' },
    { icon: Phone, label: t('aboutContactPhone3Label'), value: '+998 99 828 63 33' },
    { icon: Mail, label: t('aboutContactEmailLabel'), value: 'ogp-info@mail.ru' },
    { icon: Globe, label: t('aboutContactWebsiteLabel'), value: 'ogp.uz' },
    { icon: Clock3, label: t('aboutContactHoursLabel'), value: t('aboutContactHoursValue') },
  ];

  return (
    <div className="fade-in">
      <section
        style={{
          background: 'var(--color-primary-light)',
          borderBottom: '1px solid var(--color-border)',
          color: 'var(--color-text)',
          padding: 'calc(var(--header-height) + var(--space-20)) 0 var(--space-20)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="badge badge-accent" style={{ marginBottom: 'var(--space-4)' }}>
            {t('aboutHeroBadge')}
          </div>
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, var(--font-size-5xl))',
              fontWeight: 800,
              marginBottom: 'var(--space-4)',
              letterSpacing: '-0.03em',
            }}
          >
            Original Grand Plast MChJ
          </h1>
          <p
            style={{
              color: 'var(--color-text-secondary)',
              maxWidth: 650,
              margin: '0 auto',
              fontSize: 'var(--font-size-lg)',
              lineHeight: 1.7,
            }}
          >
            {t('aboutHeroDesc')}
          </p>
        </div>
      </section>

      <section className="section" style={{ padding: 'var(--space-20) 0' }}>
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <span className="badge badge-accent" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>
                {t('aboutHistoryBadge')}
              </span>
              <h2>{t('aboutHistoryTitle')}</h2>
              <p>{t('aboutStoryP1')}</p>
              <p>{t('aboutStoryP2')}</p>
              <p>{t('aboutStoryP3')}</p>
              <p>{t('aboutStoryP4')}</p>

              <div style={{ display: 'grid', gap: 'var(--space-6)', marginTop: 'var(--space-10)' }}>
                {milestones.map((item) => (
                  <div key={item.title} style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontWeight: 800,
                        fontSize: '1.25rem',
                        background:
                          item.variant === 'accent'
                            ? 'var(--color-accent)'
                            : item.variant === 'secondary'
                              ? 'var(--color-secondary)'
                              : 'var(--color-accent-bg)',
                        color: item.variant === 'outline' ? 'var(--color-accent)' : 'white',
                        border: item.variant === 'outline' ? '1px solid var(--color-accent)' : 'none',
                        boxShadow:
                          item.variant === 'accent' ? '0 4px 12px rgba(0, 166, 81, 0.3)' : 'none',
                      }}
                    >
                      {item.label}
                    </div>
                    <div>
                      <h4
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          marginBottom: '8px',
                          color: item.variant === 'accent' ? 'var(--color-accent)' : 'inherit',
                        }}
                      >
                        {item.title}
                      </h4>
                      <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #022c22 0%, var(--color-primary) 50%, #065F46 100%)',
                borderRadius: 'var(--radius-2xl)',
                padding: 'var(--space-8)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                textAlign: 'center',
                minHeight: 400,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: '-30%',
                  left: '-20%',
                  width: 300,
                  height: 300,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(22,163,74,0.2), transparent 70%)',
                }}
              />
              <div
                style={{
                  fontSize: 80,
                  opacity: 0.08,
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  fontWeight: 900,
                  letterSpacing: '-0.05em',
                }}
              >
                OGP
              </div>
              <div style={{ position: 'relative', marginBottom: 'var(--space-6)' }}>
                <div style={{ fontSize: 'var(--font-size-5xl)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>
                  Original
                </div>
                <div
                  style={{
                    fontSize: 'var(--font-size-3xl)',
                    fontWeight: 800,
                    color: 'var(--color-accent-light)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Grand Plast
                </div>
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.4 }}>{t('aboutSummaryMeta')}</div>
              <div
                style={{
                  marginTop: 'var(--space-6)',
                  padding: 'var(--space-3) var(--space-5)',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-size-xs)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                {t('aboutSummaryBadge')}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="badge badge-accent" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>
              {t('aboutActivitiesBadge')}
            </span>
            <h2 className="section-title">{t('aboutActivitiesTitle')}</h2>
          </div>
          <div className="features-grid">
            {activities.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="feature-card">
                  <div style={{ marginBottom: 'var(--space-3)', color: 'var(--color-accent)' }}>
                    <Icon size={34} strokeWidth={2.2} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="badge badge-accent" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>
              {t('aboutValuesBadge')}
            </span>
            <h2 className="section-title">{t('aboutValuesTitle')}</h2>
          </div>
          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {values.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="feature-card">
                  <div style={{ marginBottom: 'var(--space-3)', color: 'var(--color-accent)' }}>
                    <Icon size={34} strokeWidth={2.2} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <span className="badge badge-accent" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>
              {t('aboutContactBadge')}
            </span>
            <h2 className="section-title">{t('aboutContactTitle')}</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              {t('aboutContactSubtitle')}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--space-8)',
              alignItems: 'start',
            }}
          >
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.254169893101!2d69.27927647605068!3d41.31115397131356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sTashkent%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1703147698761!5m2!1sen!2s"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t('aboutMapTitle')}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {contacts.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={`${item.label}-${item.value}`}
                    className="feature-card"
                    style={{
                      textAlign: 'left',
                      padding: 'var(--space-3) var(--space-4)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-3)',
                    }}
                  >
                    <div style={{ color: 'var(--color-accent)', lineHeight: 1, flexShrink: 0 }}>
                      <Icon size={22} strokeWidth={2.2} />
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                        {item.label}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{item.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
