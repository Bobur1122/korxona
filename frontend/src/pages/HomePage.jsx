import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, PhoneCall } from 'lucide-react';
import { api } from '../api';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

// Slide config (without text - text comes from translations)
const heroSlideConfig = [
  { id: 1, image: '/images/hero_slider/agro.png', titleKey: 'heroSlide1Title', subtitleKey: 'heroSlide1Subtitle', bgColor: '#064e3b', reverse: false, durationMs: 2000 },
  { id: 2, image: '/images/hero_slider/shrink.png', titleKey: 'heroSlide2Title', subtitleKey: 'heroSlide2Subtitle', bgColor: '#1e3a8a', reverse: true, durationMs: 2000 },
  { id: 3, image: '/images/hero_slider/build.png', titleKey: 'heroSlide3Title', subtitleKey: 'heroSlide3Subtitle', bgColor: '#171717', reverse: false, durationMs: 3000 },
  { id: 4, image: '/images/hero_slider/food.png', titleKey: 'heroSlide4Title', subtitleKey: 'heroSlide4Subtitle', bgColor: '#78350f', reverse: true, durationMs: 3000 },
  { id: 5, image: '/images/hero_slider/logic.png', titleKey: 'heroSlide5Title', subtitleKey: 'heroSlide5Subtitle', bgColor: '#312e81', reverse: false, durationMs: 2000 },
];

export default function HomePage() {
  const { t } = useLanguage();
  const [featured, setFeatured] = useState([]);
  const [currentHeroBlock, setCurrentHeroBlock] = useState(0);
  const heroSlides = heroSlideConfig.map((slide) => ({
    ...slide,
    title: t(slide.titleKey),
    subtitle: t(slide.subtitleKey),
  }));

  useEffect(() => {
    let alive = true;

    const fetchFeatured = () => {
      api.getProducts('limit=8')
        .then(res => { if (alive) setFeatured(res.data); })
        .catch(() => { });
    };

    fetchFeatured();
    const refreshInterval = setInterval(fetchFeatured, 60000);

    return () => {
      alive = false;
      clearInterval(refreshInterval);
    };
  }, []);

  // Carousel timer — each slide gets its own custom duration
  useEffect(() => {
    const duration = heroSlideConfig[currentHeroBlock]?.durationMs || 5000;
    const timer = setTimeout(() => {
      setCurrentHeroBlock((prev) => (prev + 1) % heroSlideConfig.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentHeroBlock]);

  return (
    <div className="fade-in" style={{ backgroundColor: 'var(--color-primary)' }}>
      <style>{`
        .split-slide-container {
           position: relative;
           width: 100%;
           height: 100vh;
           min-height: 600px;
           overflow: hidden;
           margin-top: 0;
           background: #0F172A;
           isolation: isolate;
           z-index: 1;
        }
        .split-slide { 
           display: flex; 
           height: 100%; 
           width: 100%; 
        }
        .split-text { 
           flex: 1; 
           display: flex; 
           align-items: center; 
           justify-content: center; 
           padding: 6% 4%; 
           color: white; 
           position: relative;
           z-index: 2;
        }
        .split-image { 
           flex: 1; 
           position: relative; 
           overflow: hidden; 
        }
        @media (max-width: 900px) {
           .split-slide { flex-direction: column-reverse !important; justify-content: flex-end; }
           .split-text { flex: 0 0 55%; padding: 40px 20px; align-items: flex-start; }
           .split-image { flex: 0 0 45%; }
        }

        /* ====== PREMIUM TECH CARDS — Compact Brand Style ====== */
        .tech-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) {
          .tech-cards-grid { grid-template-columns: 1fr; gap: 16px; }
        }
        @media (min-width: 901px) and (max-width: 1100px) {
          .tech-cards-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .tech-brand-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .tech-brand-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,166,81,0.15);
          border-color: rgba(0,166,81,0.25);
        }

        .tech-brand-card__img {
          width: 100%;
          height: 140px;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .tech-brand-card:hover .tech-brand-card__img {
          transform: scale(1.05);
        }
        .tech-brand-card__img-wrap {
          overflow: hidden;
          position: relative;
        }
        .tech-brand-card__img-wrap::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: linear-gradient(to top, #fff, transparent);
          pointer-events: none;
        }

        .tech-brand-card__body {
          padding: 16px 18px 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .tech-brand-card__title {
          font-size: 1rem;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 6px;
          letter-spacing: -0.01em;
        }
        .tech-brand-card__desc {
          font-size: 0.8rem;
          color: #64748B;
          line-height: 1.5;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .tech-brand-card__specs {
          background: #F8FAFC;
          border: 1px solid #F1F5F9;
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 12px;
        }
        .tech-brand-card__spec-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
          font-size: 0.75rem;
        }
        .tech-brand-card__spec-row:not(:last-child) {
          border-bottom: 1px solid #E2E8F0;
          padding-bottom: 6px;
          margin-bottom: 6px;
        }
        .tech-brand-card__spec-label {
          color: #94A3B8;
          font-weight: 500;
        }
        .tech-brand-card__spec-value {
          font-weight: 700;
          color: #0F172A;
          font-size: 0.75rem;
        }
        .tech-brand-card__spec-value--accent {
          color: #E60000;
        }

        .tech-brand-card__link {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #00A651;
          font-weight: 700;
          font-size: 0.8rem;
          text-decoration: none;
          transition: gap 0.25s ease;
        }
        .tech-brand-card__link:hover {
          gap: 10px;
        }
      `}</style>

      {/* 5-SLIDE FULL SCREEN SPLIT HERO */}
      <section className="split-slide-container">
        {heroSlides.map((slide, idx) => {
          const isActive = idx === currentHeroBlock;
          return (
            <div key={slide.id} style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: isActive ? 1 : 0,
              visibility: isActive ? 'visible' : 'hidden',
              transition: 'opacity 0.8s ease-in-out',
              zIndex: isActive ? 2 : 1
            }}>
              <div className="split-slide" style={{ flexDirection: slide.reverse ? 'row-reverse' : 'row' }}>

                {/* TEXT SIDE */}
                <div className="split-text" style={{ background: slide.bgColor }}>
                  <div style={{ maxWidth: 650, transform: isActive ? 'translateY(0)' : 'translateY(30px)', transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)', transitionDelay: '0.2s', opacity: isActive ? 1 : 0 }}>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, paddingRight: '20px' }}>{slide.title}</h2>
                    <p style={{ fontSize: '1.25rem', color: '#E2E8F0', lineHeight: 1.7, marginBottom: 40, paddingRight: '40px' }}>{slide.subtitle}</p>
                    <Link to="/products" style={{ background: 'transparent', color: '#FFF', border: '2px solid rgba(255,255,255,0.8)', padding: '14px 40px', borderRadius: 50, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: '1.05rem', transition: 'all 0.3s ease', textDecoration: 'none', letterSpacing: 1, textTransform: 'uppercase' }} onMouseOver={e => { e.currentTarget.style.background = '#FFF'; e.currentTarget.style.color = slide.bgColor; }} onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#FFF'; }}>{t('moreParams')} <ArrowRight size={20} /></Link>
                  </div>
                </div>

                {/* IMAGE SIDE */}
                <div className="split-image">
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: isActive ? 'scale(1)' : 'scale(1.1)',
                    transition: 'transform 2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }} />
                </div>

              </div>
            </div>
          );
        })}

        {/* Custom Indicators */}
        <div style={{ position: 'absolute', bottom: 40, left: 0, width: '100%', zIndex: 3, display: 'flex', justifyContent: 'center', gap: 12 }}>
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHeroBlock(idx)}
              style={{
                width: currentHeroBlock === idx ? 40 : 12,
                height: 12,
                borderRadius: 12,
                background: currentHeroBlock === idx ? '#FFF' : 'rgba(255,255,255,0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: 0
              }}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>



      {/* TECHNICAL SOLUTIONS — Compact Premium Brand Cards */}
      <section className="section home-tech" id="about">
        <div className="container">
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 850, color: '#0F172A', marginBottom: 8, letterSpacing: '-0.02em' }}>{t('techSolutions')}</h2>
            <p style={{ fontSize: '0.95rem', color: '#64748B', maxWidth: 600 }}>
              {t('techDesc')}
            </p>
          </div>

          <div className="tech-cards-grid">
            {/* Card 1 — Agro */}
            <div className="tech-brand-card">
              <div className="tech-brand-card__img-wrap">
                <img className="tech-brand-card__img" src="/images/greenhouse.png" alt="Issiqxona plyonkasi" />
              </div>
              <div className="tech-brand-card__body">
                <h3 className="tech-brand-card__title">{t('agroTitle')}</h3>
                <p className="tech-brand-card__desc">{t('agroDesc')}</p>
                <div className="tech-brand-card__specs">
                  <div className="tech-brand-card__spec-row">
                    <span className="tech-brand-card__spec-label">{t('agroSpecWidthLabel')}</span>
                    <span className="tech-brand-card__spec-value">{t('agroSpecWidthValue')}</span>
                  </div>
                  <div className="tech-brand-card__spec-row">
                    <span className="tech-brand-card__spec-label">{t('agroSpecUvLabel')}</span>
                    <span className="tech-brand-card__spec-value">{t('agroSpecUvValue')}</span>
                  </div>
                  <div className="tech-brand-card__spec-row">
                    <span className="tech-brand-card__spec-label">{t('agroSpecLightLabel')}</span>
                    <span className="tech-brand-card__spec-value">{t('agroSpecLightValue')}</span>
                  </div>
                </div>
                <Link to="/products" className="tech-brand-card__link">{t('moreParams')} <ArrowRight size={14} /></Link>
              </div>
            </div>

            {/* Card 2 — Thermo */}
            <div className="tech-brand-card">
              <div className="tech-brand-card__img-wrap">
                <img className="tech-brand-card__img" src="/images/hero_shrink.png" alt="Termo Qadoqlash" />
              </div>
              <div className="tech-brand-card__body">
                <h3 className="tech-brand-card__title">{t('thermoTitle')}</h3>
                <p className="tech-brand-card__desc">{t('thermoDesc')}</p>
                <div className="tech-brand-card__specs">
                  <div className="tech-brand-card__spec-row">
                    <span className="tech-brand-card__spec-label">{t('thermoSpecStretchLabel')}</span>
                    <span className="tech-brand-card__spec-value">{t('thermoSpecStretchValue')}</span>
                  </div>
                  <div className="tech-brand-card__spec-row">
                    <span className="tech-brand-card__spec-label">{t('thermoSpecShrinkLabel')}</span>
                    <span className="tech-brand-card__spec-value">{t('thermoSpecShrinkValue')}</span>
                  </div>
                  <div className="tech-brand-card__spec-row">
                    <span className="tech-brand-card__spec-label">{t('thermoSpecDensityLabel')}</span>
                    <span className="tech-brand-card__spec-value">{t('thermoSpecDensityValue')}</span>
                  </div>
                </div>
                <Link to="/products" className="tech-brand-card__link">{t('moreParams')} <ArrowRight size={14} /></Link>
              </div>
            </div>

            {/* Card 3 — Logistics */}
            <div className="tech-brand-card">
              <div className="tech-brand-card__img-wrap">
                <img className="tech-brand-card__img" src="/images/logistics.png" alt="Sanoat logistika" />
              </div>
              <div className="tech-brand-card__body">
                <h3 className="tech-brand-card__title">{t('logisticsTitle')}</h3>
                <p className="tech-brand-card__desc">{t('logisticsDesc')}</p>
                <div className="tech-brand-card__specs">
                  <div className="tech-brand-card__spec-row">
                    <span className="tech-brand-card__spec-label">{t('logisticsSpecSeamLabel')}</span>
                    <span className="tech-brand-card__spec-value tech-brand-card__spec-value--accent">{t('logisticsSpecSeamValue')}</span>
                  </div>
                  <div className="tech-brand-card__spec-row">
                    <span className="tech-brand-card__spec-label">{t('logisticsSpecLoadLabel')}</span>
                    <span className="tech-brand-card__spec-value">{t('logisticsSpecLoadValue')}</span>
                  </div>
                  <div className="tech-brand-card__spec-row">
                    <span className="tech-brand-card__spec-label">{t('logisticsSpecIndustryLabel')}</span>
                    <span className="tech-brand-card__spec-value">{t('logisticsSpecIndustryValue')}</span>
                  </div>
                </div>
                <Link to="/products" className="tech-brand-card__link">{t('moreParams')} <ArrowRight size={14} /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG EXCERPT */}
      <section className="section" style={{ background: '#F8FAFC' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{t('onlineCatalog')}</h2>
            </div>
            <Link to="/products" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8, borderColor: '#0F172A', color: '#0F172A', fontWeight: 600 }}>
              {t('fullList')} <ArrowRight size={16} />
            </Link>
          </div>
          {featured.length > 0 ? (
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div className="products-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="skeleton-card" style={{ background: '#E2E8F0', height: 350, borderRadius: 8 }}></div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HAMKORLAR — COMPACT MARQUEE */}
      <section style={{ padding: '48px 0', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div className="container" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center' }}>{t('partnersTitle')}</h3>
        </div>
        <div className="partners-marquee">
          <div className="partners-marquee__track">
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="partners-marquee__set">
                <div className="partners-marquee__item">
                  <img src="/images/partners/lotte.svg" alt="Lotte Chemical" />
                </div>
                <div className="partners-marquee__item">
                  <img src="/images/partners/sinopec.svg" alt="Sinopec Group" />
                </div>
                <div className="partners-marquee__item">
                  <img src="/images/partners/repsol.svg" alt="Repsol SA" />
                </div>
                <div className="partners-marquee__item">
                  <img src="/images/partners/shurtan.svg" alt="Shurtan GCC" />
                </div>
                <div className="partners-marquee__item">
                  <img src="/images/partners/lotte.svg" alt="Lotte Chemical" />
                </div>
                <div className="partners-marquee__item">
                  <img src="/images/partners/sinopec.svg" alt="Sinopec Group" />
                </div>
                <div className="partners-marquee__item">
                  <img src="/images/partners/repsol.svg" alt="Repsol SA" />
                </div>
                <div className="partners-marquee__item">
                  <img src="/images/partners/shurtan.svg" alt="Shurtan GCC" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', borderTop: '4px solid #00A651', background: '#0B1220' }}>
        <div
          style={{
            position: 'relative',
            minHeight: 540,
            backgroundImage: 'url(/images/b2b/b2b.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(110deg, rgba(2,6,23,0.88) 0%, rgba(2,6,23,0.45) 55%, rgba(2,6,23,0.84) 100%)',
            }}
          />

          <div className="container" style={{  position: 'relative', padding: '110px 0 90px' }}>
            <div style={{ maxWidth: 410 }}>
              <h2 style={{
                margin: '0 0 14px',
                fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                fontWeight: 900,
                lineHeight: 1.05,
                color: '#fff',
              }}>
                {t('ctaTitle')}
              </h2>

              <p style={{
                margin: 0,
                maxWidth: 720,
                fontSize: '1.2rem',
                lineHeight: 1.65,
                color: '#CBD5E1',
              }}>
                {t('ctaDesc')}
              </p>

              <div style={{
                marginTop: 22,
                display: 'flex',
                gap: 14,
                flexWrap: 'wrap',
                alignItems: 'center'
              }}>
                <a
                  href="tel:+998996066333"
                  className="btn btn-ghost"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 18px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.16)',
                    color: '#fff'
                  }}
                >
                  <PhoneCall size={18} /> +998 99 606 63 33
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
