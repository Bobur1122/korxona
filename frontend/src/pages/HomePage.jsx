import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, PhoneCall } from 'lucide-react';
import { api } from '../api';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

const heroSlides = [
  {
    id: 1,
    image: '/images/hero_slider/agro.png',
    title: "Agro-Plyonkalar bilan yuqori hosil",
    subtitle: "Issiqxonalaringiz uchun maxsus ishlab chiqilgan, UV-nurlari va murakkab ob-havodan himoya qiluvchi premium plyonkalar.",
    bgColor: "#064e3b",
    reverse: false
  },
  {
    id: 2,
    image: '/images/hero_slider/shrink.png',
    title: "Sanoat Termo Qadoqlash",
    subtitle: "Logistika jarayonida mahsulotlaringiz xavfsizligini 100% taminlang. Mustahkam va cho'ziluvchan termo plyonkalar.",
    bgColor: "#1e3a8a",
    reverse: true
  },
  {
    id: 3,
    image: '/images/hero_slider/build.png',
    title: "Qurilish va Gidroizolyatsiya",
    subtitle: "Kuchli va qalin qoplamalar bilan poydevor va tomlarni namlikdan mukammal asrang. Biz bilan inshootlaringiz uzoq umr ko'radi.",
    bgColor: "#171717",
    reverse: false
  },
  {
    id: 4,
    image: '/images/hero_slider/food.png',
    title: "Ishonchli va Ekologik toza",
    subtitle: "Oziq-ovqat sanoati uchun mutlaqo xavfsiz innovatsion qadoqlash plyonkalari. Mahsulot yangiligini uzoq muddat saqlaydi.",
    bgColor: "#78350f",
    reverse: true
  },
  {
    id: 5,
    image: '/images/hero_slider/logic.png',
    title: "Hamkorlik va Barqarorlik",
    subtitle: "O'zbekiston bo'ylab distribyutorlar tarmog'iga qo'shiling. Sifatli plyonka вЂ“ muvaffaqiyatli savdo garovi.",
    bgColor: "#312e81",
    reverse: false
  }
];

export default function HomePage() {
  const { t } = useLanguage();
  const [featured, setFeatured] = useState([]);
  const [currentHeroBlock, setCurrentHeroBlock] = useState(0);

  useEffect(() => {
    let alive = true;

    const fetchFeatured = () => {
      api.getProducts('limit=8')
        .then(res => { if (alive) setFeatured(res.data); })
        .catch(() => { });
    };

    fetchFeatured();
    const refreshInterval = setInterval(fetchFeatured, 60000);

    // Carousel logic
    const interval = setInterval(() => {
      setCurrentHeroBlock((prev) => (prev + 1) % heroSlides.length);
    }, 10000); // Change every 15 seconds

    return () => {
      alive = false;
      clearInterval(interval);
      clearInterval(refreshInterval);
    };
  }, []);

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
           z-index: 10;
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
              zIndex: isActive ? 5 : 1
            }}>
              <div className="split-slide" style={{ flexDirection: slide.reverse ? 'row-reverse' : 'row' }}>

                {/* TEXT SIDE */}
                <div className="split-text" style={{ background: slide.bgColor }}>
                  <div style={{ maxWidth: 650, transform: isActive ? 'translateY(0)' : 'translateY(30px)', transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)', transitionDelay: '0.2s', opacity: isActive ? 1 : 0 }}>
                    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, paddingRight: '20px' }}>{slide.title}</h2>
                    <p style={{ fontSize: '1.25rem', color: '#E2E8F0', lineHeight: 1.7, marginBottom: 40, paddingRight: '40px' }}>{slide.subtitle}</p>
                    <Link to="/products" style={{ background: 'transparent', color: '#FFF', border: '2px solid rgba(255,255,255,0.8)', padding: '14px 40px', borderRadius: 50, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: '1.05rem', transition: 'all 0.3s ease', textDecoration: 'none', letterSpacing: 1, textTransform: 'uppercase' }} onMouseOver={e => { e.currentTarget.style.background = '#FFF'; e.currentTarget.style.color = slide.bgColor; }} onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#FFF'; }}>Batafsil ma'lumot <ArrowRight size={20} /></Link>
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
        <div style={{ position: 'absolute', bottom: 40, left: 0, width: '100%', zIndex: 20, display: 'flex', justifyContent: 'center', gap: 12 }}>
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



      {/* TECHNICAL SOLUTIONS */}
      <section className="section home-tech" id="about">
        <div className="container">
          <div className="home-tech__head" style={{ marginBottom: 36 }}>
            <h2 className="home-tech__title" style={{ fontSize: '2.1rem', fontWeight: 850, color: '#0F172A', marginBottom: 12 }}>{t('techSolutions')}</h2>
            <p className="home-tech__subtitle" style={{ fontSize: '1.05rem', color: '#475569', maxWidth: 800 }}>
              {t('techDesc')}
            </p>
          </div>

          <div className="features-grid home-tech__grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18, alignItems: 'stretch' }}>
            {/* Prod 1 */}
            <div className="home-tech-card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
              <img src="/images/greenhouse.png" alt="Issiqxona plyonkasi" style={{ width: '100%', height: 180, objectFit: 'cover', borderBottom: '1px solid #E2E8F0' }} />
              <div className="home-tech-card__body" style={{ padding: 20, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 className="home-tech-card__title" style={{ fontSize: '1.25rem', fontWeight: 850, color: '#0F172A', marginBottom: 12 }}>{t('agroTitle')}</h3>
                <p style={{ color: '#475569', marginBottom: 16, lineHeight: 1.6, fontSize: 15 }}>{t('agroDesc')}</p>
                <div className="home-tech-card__specs" style={{ background: '#F8FAFC', padding: 16, borderRadius: 8, marginBottom: 16, border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 8, marginBottom: 8 }}>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>{t('agroSpecWidthLabel')}:</span>
                    <span style={{ fontWeight: 800, color: '#0F172A' }}>{t('agroSpecWidthValue')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 8, marginBottom: 8 }}>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>{t('agroSpecUvLabel')}:</span>
                    <span style={{ fontWeight: 800, color: '#0F172A' }}>{t('agroSpecUvValue')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>{t('agroSpecLightLabel')}:</span>
                    <span style={{ fontWeight: 800, color: '#0F172A' }}>{t('agroSpecLightValue')}</span>
                  </div>
                </div>
                <Link to="/products" style={{ marginTop: 'auto', color: '#00A651', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>{t('moreParams')} <ArrowRight size={16} /></Link>
              </div>
            </div>

            {/* Prod 2 */}
            <div className="home-tech-card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
              <img src="/images/hero_shrink.png" alt="Termo Qadoqlash" style={{ width: '100%', height: 180, objectFit: 'cover', borderBottom: '1px solid #E2E8F0' }} />
              <div className="home-tech-card__body" style={{ padding: 20, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 className="home-tech-card__title" style={{ fontSize: '1.25rem', fontWeight: 850, color: '#0F172A', marginBottom: 12 }}>{t('thermoTitle')}</h3>
                <p style={{ color: '#475569', marginBottom: 16, lineHeight: 1.6, fontSize: 15 }}>{t('thermoDesc')}</p>
                <div className="home-tech-card__specs" style={{ background: '#F8FAFC', padding: 16, borderRadius: 8, marginBottom: 16, border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 8, marginBottom: 8 }}>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>{t('thermoSpecStretchLabel')}:</span>
                    <span style={{ fontWeight: 800, color: '#0F172A' }}>{t('thermoSpecStretchValue')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 8, marginBottom: 8 }}>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>{t('thermoSpecShrinkLabel')}:</span>
                    <span style={{ fontWeight: 800, color: '#0F172A' }}>{t('thermoSpecShrinkValue')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>{t('thermoSpecDensityLabel')}:</span>
                    <span style={{ fontWeight: 800, color: '#0F172A' }}>{t('thermoSpecDensityValue')}</span>
                  </div>
                </div>
                <Link to="/products" style={{ marginTop: 'auto', color: '#00A651', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>{t('moreParams')} <ArrowRight size={16} /></Link>
              </div>
            </div>

            {/* Prod 3 */}
            <div className="home-tech-card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
              <img src="/images/logistics.png" alt="Bozor paketi" style={{ width: '100%', height: 180, objectFit: 'cover', borderBottom: '1px solid #E2E8F0' }} />
              <div className="home-tech-card__body" style={{ padding: 20, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 className="home-tech-card__title" style={{ fontSize: '1.25rem', fontWeight: 850, color: '#0F172A', marginBottom: 12 }}>{t('logisticsTitle')}</h3>
                <p style={{ color: '#475569', marginBottom: 16, lineHeight: 1.6, fontSize: 15 }}>{t('logisticsDesc')}</p>
                <div className="home-tech-card__specs" style={{ background: '#F8FAFC', padding: 16, borderRadius: 8, marginBottom: 16, border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 8, marginBottom: 8 }}>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>{t('logisticsSpecSeamLabel')}:</span>
                    <span style={{ fontWeight: 800, color: '#E60000' }}>{t('logisticsSpecSeamValue')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 8, marginBottom: 8 }}>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>{t('logisticsSpecLoadLabel')}:</span>
                    <span style={{ fontWeight: 800, color: '#0F172A' }}>{t('logisticsSpecLoadValue')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>{t('logisticsSpecIndustryLabel')}:</span>
                    <span style={{ fontWeight: 800, color: '#0F172A' }}>{t('logisticsSpecIndustryValue')}</span>
                  </div>
                </div>
                <Link to="/products" style={{ marginTop: 'auto', color: '#00A651', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>{t('moreParams')} <ArrowRight size={16} /></Link>
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
                Katta hajmli buyurtmalar uchun ishlab chiqaruvchidan to'g'ridan-to'g'ri
              </h2>

              <p style={{
                margin: 0,
                maxWidth: 720,
                fontSize: '1.2rem',
                lineHeight: 1.65,
                color: '#CBD5E1',
              }}>
                Individual narxlar, barqaror yetkazib berish, eksport hujjatlari va logistika yordami — hammasi bir joyda.
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
