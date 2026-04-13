import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, FileText, PhoneCall, CheckCircle2 } from 'lucide-react';
import { api } from '../api';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

const heroImages = [
  '/images/extrusion.png',
  '/images/hero_shrink.png',
  '/images/hero_agro.png',
  '/images/hero_logistics.png'
];

export default function HomePage() {
  const { t } = useLanguage();
  const [featured, setFeatured] = useState([]);
  const [currentHeroBlock, setCurrentHeroBlock] = useState(0);

  useEffect(() => {
    api.getProducts('limit=6&sort=popular').then(res => setFeatured(res.data)).catch(() => {});
    
    // Carousel logic
    const interval = setInterval(() => {
      setCurrentHeroBlock((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fade-in" style={{ backgroundColor: 'var(--color-primary)' }}>
      {/* MASSIVE ENTERPRISE HERO WITH CAROUSEL */}
      <section className="home-hero" style={{
        position: 'relative', 
        height: 'auto', 
        minHeight: '85vh',
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        background: '#0F172A',
        overflow: 'hidden',
        paddingTop: 'calc(var(--header-height) + 80px)', 
        paddingBottom: '100px'
      }}>
        {/* Background Image Carousel with Overlay (Sliding Wheels/Koleso) */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: `${heroImages.length * 100}%`, height: '100%',
          display: 'flex',
          transition: 'transform 1.2s cubic-bezier(0.65, 0, 0.35, 1)',
          transform: `translateX(-${currentHeroBlock * (100 / heroImages.length)}%)`,
          zIndex: 1
        }}>
          {heroImages.map((imgSrc, idx) => (
            <div key={idx} style={{
              width: `${100 / heroImages.length}%`, height: '100%',
              backgroundImage: `url(${imgSrc})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
          ))}
        </div>
        
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to right, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.4) 100%)',
          zIndex: 2
        }} />

        <div className="container home-hero__container" style={{ position: 'relative', zIndex: 10, width: '100%', padding: '0 var(--space-4)', display: 'flex', flexWrap: 'wrap' }}>
          <div className="home-hero__content" style={{ maxWidth: 900, textAlign: 'left', margin: 'auto 0' }}>

            
            <h1 className="home-hero__title" style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', 
              lineHeight: 1.1, 
              color: '#FFFFFF',
              fontWeight: 800,
              letterSpacing: '-1px',
              fontFamily: 'var(--font-family)'
            }}>
              {t('heroTitle1')} <br/>
              <span style={{ color: '#10B981' }}>{t('heroTitle2')} </span> 
              {t('heroTitle3')}
            </h1>
            
            <p className="home-hero__subtitle" style={{
              fontSize: '1.25rem', 
              color: '#CBD5E1', 
              maxWidth: 750, 
              marginTop: 24,
              lineHeight: 1.6
            }}>
              {t('heroSubtitle')}
            </p>
            

          </div>
        </div>
      </section>



      {/* TECHNICAL SOLUTIONS */}
      <section className="section home-tech" id="about">
        <div className="container">
          <div className="home-tech__head" style={{ marginBottom: 60 }}>
            <h2 className="home-tech__title" style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>{t('techSolutions')}</h2>
            <p className="home-tech__subtitle" style={{ fontSize: '1.25rem', color: '#475569', maxWidth: 800 }}>
              {t('techDesc')}
            </p>
          </div>
          
          <div className="features-grid home-tech__grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, alignItems: 'stretch' }}>
            {/* Prod 1 */}
            <div className="home-tech-card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
               <img src="/images/greenhouse.png" alt="Issiqxona plyonkasi" style={{ width: '100%', height: 240, objectFit: 'cover', borderBottom: '1px solid #E2E8F0' }} />
               <div className="home-tech-card__body" style={{ padding: 32, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                 <h3 className="home-tech-card__title" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>{t('agroTitle')}</h3>
                 <p style={{ color: '#475569', marginBottom: 24, lineHeight: 1.6 }}>{t('agroDesc')}</p>
                 <div className="home-tech-card__specs" style={{ background: '#F8FAFC', padding: 24, borderRadius: 8, marginBottom: 24, border: '1px solid #E2E8F0' }}>
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
               <img src="/images/hero_shrink.png" alt="Termo Qadoqlash" style={{ width: '100%', height: 240, objectFit: 'cover', borderBottom: '1px solid #E2E8F0' }} />
               <div className="home-tech-card__body" style={{ padding: 32, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                 <h3 className="home-tech-card__title" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>{t('thermoTitle')}</h3>
                 <p style={{ color: '#475569', marginBottom: 24, lineHeight: 1.6 }}>{t('thermoDesc')}</p>
                 <div className="home-tech-card__specs" style={{ background: '#F8FAFC', padding: 24, borderRadius: 8, marginBottom: 24, border: '1px solid #E2E8F0' }}>
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
               <img src="/images/logistics.png" alt="Bozor paketi" style={{ width: '100%', height: 240, objectFit: 'cover', borderBottom: '1px solid #E2E8F0' }} />
               <div className="home-tech-card__body" style={{ padding: 32, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                 <h3 className="home-tech-card__title" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>{t('logisticsTitle')}</h3>
                 <p style={{ color: '#475569', marginBottom: 24, lineHeight: 1.6 }}>{t('logisticsDesc')}</p>
                 <div className="home-tech-card__specs" style={{ background: '#F8FAFC', padding: 24, borderRadius: 8, marginBottom: 24, border: '1px solid #E2E8F0' }}>
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
              {[1,2,3,4].map(i => (
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
      <section className="home-cta" style={{ background: '#0F172A', padding: '100px 0', borderTop: '4px solid #00A651', color: '#FFFFFF' }}>
        <div className="container">
          <div className="home-cta__shell">
            <h2 className="home-cta__title" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: 24, lineHeight: 1.1 }}>
              {t('b2bOffer')}
            </h2>

            <p className="home-cta__subtitle" style={{ color: '#94A3B8', maxWidth: 740, margin: '0 auto 40px', fontSize: '1.25rem', lineHeight: 1.6 }}>
              {t('b2bDesc')}
            </p>

            <div className="home-cta__benefits">
              <div className="home-cta__benefit"><CheckCircle2 size={16} /> {t('b2bBenefit1')}</div>
              <div className="home-cta__benefit"><CheckCircle2 size={16} /> {t('b2bBenefit2')}</div>
              <div className="home-cta__benefit"><CheckCircle2 size={16} /> {t('b2bBenefit3')}</div>
              <div className="home-cta__benefit"><CheckCircle2 size={16} /> {t('b2bBenefit4')}</div>
            </div>

            <div className="home-cta__actions" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="mailto:info@grandplast.uz" className="home-cta__btn home-cta__btn--primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={20} /> {t('requestOffer')}
              </a>
              <a href="tel:+998996066333" className="home-cta__btn home-cta__btn--ghost" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PhoneCall size={18} /> {t('headOffice')}: +998 99 606 63 33
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

