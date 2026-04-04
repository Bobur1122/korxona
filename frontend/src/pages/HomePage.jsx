import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, Globe, ShieldCheck, Factory, FileText, CheckCircle, Award } from 'lucide-react';
import { api } from '../api';
import ProductCard from '../components/ProductCard';

const heroImages = [
  '/images/extrusion.png',
  '/images/hero_shrink.png',
  '/images/hero_agro.png',
  '/images/hero_logistics.png'
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [currentHeroBlock, setCurrentHeroBlock] = useState(0);

  useEffect(() => {
    api.getProducts('limit=8').then(res => setFeatured(res.data)).catch(() => {});
    
    // Carousel logic
    const interval = setInterval(() => {
      setCurrentHeroBlock((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fade-in" style={{ backgroundColor: 'var(--color-primary)' }}>
      {/* MASSIVE ENTERPRISE HERO WITH CAROUSEL */}
      <section style={{ 
        position: 'relative', 
        height: '90vh', 
        minHeight: '600px',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#0F172A',
        overflow: 'hidden',
        paddingTop: 'calc(var(--header-height) + var(--space-20))' /* INCREASED SPACE FROM HEADER */,
        paddingBottom: 'var(--space-24)' /* SPACE FROM MAIN CONTENT */
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

        <div className="container" style={{ position: 'relative', zIndex: 10, width: '100%', padding: '0 var(--space-4)', display: 'flex', flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 900, textAlign: 'left', margin: 'auto 0' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 8,
              padding: '6px 16px', 
              background: 'rgba(255,255,255,0.1)', 
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '9999px',
              color: '#F8FAFC',
              fontWeight: 600,
              fontSize: '0.875rem',
              marginBottom: 24,
              textTransform: 'uppercase',
              letterSpacing: 1.5
            }}>
              <Globe size={16} color="#0EA5E9" />
              Xalqaro standartlardagi ishlab chiqarish
            </div>
            
            <h1 style={{ 
              fontSize: 'clamp(3rem, 6vw, 4.5rem)', 
              lineHeight: 1.1, 
              color: '#FFFFFF',
              fontWeight: 800,
              letterSpacing: '-1px',
              fontFamily: 'var(--font-family)'
            }}>
              Sanoat va Agrosanoat Uchun <br/>
              <span style={{ color: '#10B981' }}>Innovatsion Polimer </span> 
              Yechimlar
            </h1>
            
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#CBD5E1', 
              maxWidth: 750, 
              marginTop: 24,
              lineHeight: 1.6
            }}>
              2005-yildan buyon Markaziy Osiyo agrosanoati uchun premium polimer materiallar ishlab chiqaruvchi. O'zbekistonda birinchi bo'lib 12 metrlik uch qavatli issiqxona plyonkalarini joriy etgan texnologik yetakchi.
            </p>
            
            <div style={{ display: 'flex', gap: 16, marginTop: 40, flexWrap: 'wrap' }}>
              <Link to="/products" className="btn btn-primary btn-lg" style={{ 
                padding: '18px 40px',
                fontSize: '1.125rem',
                gap: 12
              }}>
                Mahsulotlar Katalogi <ArrowRight size={22} />
              </Link>
              <a href="#about" className="btn btn-outline btn-lg" style={{ 
                padding: '18px 40px',
                fontSize: '1.125rem',
                color: '#FFFFFF',
                borderColor: 'rgba(255,255,255,0.3)'
              }}>
                Korxona Haqida
              </a>
            </div>

            {/* EYE-CATCHING MINI STATS WITHIN HERO */}
            <div style={{ 
              display: 'flex', 
              gap: 40, 
              marginTop: 60, 
              padding: '24px', 
              background: 'rgba(255,255,255,0.03)', 
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(8px)',
              width: 'fit-content'
            }}>
               <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>2005-yil</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 }}>Tashkil Topgan</div>
               </div>
               <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }}></div>
               <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>12 Metr</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 }}>Max Kenglik (Record)</div>
               </div>
               <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }}></div>
               <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>3 Qavatli</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 }}>High-Tech Plyonka</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES & CERTIFICATIONS (CLEAN WHITE) */}
      <section className="section" style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 40 }}>
            <div>
              <h3 style={{ fontSize: '1rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Ishonchli Hamkor</h3>
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ShieldCheck size={28} color="#0F172A" /> <span style={{ fontWeight: 700, fontSize: '1.25rem', color: '#0F172A' }}>ISO 9001:2015</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Award size={28} color="#0F172A" /> <span style={{ fontWeight: 700, fontSize: '1.25rem', color: '#0F172A' }}>O'zDSt 2824:2014</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={28} color="#0F172A" /> <span style={{ fontWeight: 700, fontSize: '1.25rem', color: '#0F172A' }}>EAC Sertifikati</span></div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 40, borderLeft: '1px solid #CBD5E1', paddingLeft: 40 }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#00A651', lineHeight: 1 }}>7500+</div>
                <div style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 600, marginTop: 4, textTransform: 'uppercase' }}>Tonna Yillik Quvvat</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#00A651', lineHeight: 1 }}>20+</div>
                <div style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 600, marginTop: 4, textTransform: 'uppercase' }}>Yillik Tajriba</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNICAL SOLUTIONS */}
      <section className="section" id="about">
        <div className="container">
          <div style={{ marginBottom: 60 }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>Texnologik Yechimlar.</h2>
            <p style={{ fontSize: '1.25rem', color: '#475569', maxWidth: 800 }}>
              Fizik-mexanik ko'rsatkichlari eng yuqori bo'lgan, global sanoat talablariga javob beruvchi 3 tabaqali polimer turlari.
            </p>
          </div>
          
          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 32, alignItems: 'stretch' }}>
            {/* Prod 1 */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
               <img src="/images/greenhouse.png" alt="Issiqxona plyonkasi" style={{ width: '100%', height: 240, objectFit: 'cover', borderBottom: '1px solid #E2E8F0' }} />
               <div style={{ padding: 32, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                 <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>Agrosanoat Komplekslari</h3>
                 <p style={{ color: '#475569', marginBottom: 24, lineHeight: 1.6 }}>Zavodimiz qalinligi 100 dan 200 mikrongacha bo'lgan ko'p qatlamli UV, IR va EVA qo'shimchali plyonkalarni ishlab chiqaradi.</p>
                 <div style={{ background: '#F8FAFC', padding: 24, borderRadius: 8, marginBottom: 24, border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 8, marginBottom: 8 }}>
                      <span style={{ color: '#64748B', fontWeight: 500 }}>Maksimal kenglik:</span>
                      <span style={{ fontWeight: 800, color: '#0F172A' }}>12 Metrgacha</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 8, marginBottom: 8 }}>
                      <span style={{ color: '#64748B', fontWeight: 500 }}>UV Kafolat:</span>
                      <span style={{ fontWeight: 800, color: '#0F172A' }}>3-5 Yil</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748B', fontWeight: 500 }}>Yorug'lik o'tkazuvchanlik:</span>
                      <span style={{ fontWeight: 800, color: '#0F172A' }}>88-92%</span>
                    </div>
                 </div>
                 <Link to="/products" style={{ marginTop: 'auto', color: '#00A651', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>Batafsil Parametrlar <ArrowRight size={16} /></Link>
               </div>
            </div>

            {/* Prod 2 */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
               <img src="/images/hero_shrink.png" alt="Termo Qadoqlash" style={{ width: '100%', height: 240, objectFit: 'cover', borderBottom: '1px solid #E2E8F0' }} />
               <div style={{ padding: 32, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                 <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>Termo Qadoqlash (Shrink)</h3>
                 <p style={{ color: '#475569', marginBottom: 24, lineHeight: 1.6 }}>Guruhli va palletli qadoqlash uchun mo'ljallangan, avtomat uzatgichli liniyalar uchun ideal deformatsiya kuchi bo'lgan texnik plyonkalar.</p>
                 <div style={{ background: '#F8FAFC', padding: 24, borderRadius: 8, marginBottom: 24, border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 8, marginBottom: 8 }}>
                      <span style={{ color: '#64748B', fontWeight: 500 }}>Uzilishdagi cho'zilish:</span>
                      <span style={{ fontWeight: 800, color: '#0F172A' }}>≥ 350% MD</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 8, marginBottom: 8 }}>
                      <span style={{ color: '#64748B', fontWeight: 500 }}>Termik siqilish:</span>
                      <span style={{ fontWeight: 800, color: '#0F172A' }}>T 50-70% / K 30-50%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748B', fontWeight: 500 }}>Zichlik (Density):</span>
                      <span style={{ fontWeight: 800, color: '#0F172A' }}>0.925 g/cm³</span>
                    </div>
                 </div>
                 <Link to="/products" style={{ marginTop: 'auto', color: '#00A651', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>Batafsil Parametrlar <ArrowRight size={16} /></Link>
               </div>
            </div>
            
            {/* Prod 3 */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
               <img src="/images/logistics.png" alt="Bozor paketi" style={{ width: '100%', height: 240, objectFit: 'cover', borderBottom: '1px solid #E2E8F0' }} />
               <div style={{ padding: 32, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                 <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: 16 }}>Sanoat Logistika Paketlari</h3>
                 <p style={{ color: '#475569', marginBottom: 24, lineHeight: 1.6 }}>Og'ir yuk tashish uchun xavfsizlik va mustahkamlikni ta'minlovchi ekstrudirovka qilingan polimer materiallar.</p>
                 <div style={{ background: '#F8FAFC', padding: 24, borderRadius: 8, marginBottom: 24, border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 8, marginBottom: 8 }}>
                      <span style={{ color: '#64748B', fontWeight: 500 }}>Payvand choki:</span>
                      <span style={{ fontWeight: 800, color: '#E60000' }}>Plexus texnologiyasi</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 8, marginBottom: 8 }}>
                      <span style={{ color: '#64748B', fontWeight: 500 }}>Chidamli yuk:</span>
                      <span style={{ fontWeight: 800, color: '#0F172A' }}>35 Kggacha</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748B', fontWeight: 500 }}>Soha:</span>
                      <span style={{ fontWeight: 800, color: '#0F172A' }}>B2B Export</span>
                    </div>
                 </div>
                 <Link to="/products" style={{ marginTop: 'auto', color: '#00A651', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>Batafsil Parametrlar <ArrowRight size={16} /></Link>
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
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Onlayn Katalog</h2>
            </div>
            <Link to="/products" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8, borderColor: '#0F172A', color: '#0F172A', fontWeight: 600 }}>
              To'liq Ro'yxat <ArrowRight size={16} />
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

      {/* MULTINATIONAL COMPONENTS */}
      <section className="section">
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', marginBottom: 60, textAlign: 'center' }}>Global Hamkorlarimiz va Xom Ashyo Tizimi</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, textAlign: 'center' }}>
             <div style={{ padding: 40, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8 }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00A651', marginBottom: 8 }}>Lotte Chemical</h4>
                <p style={{ color: '#64748B', fontWeight: 600, fontSize: '0.875rem' }}>Janubiy Koreya</p>
                <div style={{ fontSize: '0.75rem', marginTop: 12, color: '#94A3B8' }}>LDPE / LLDPE Bazaviy Polimerlar</div>
             </div>
             <div style={{ padding: 40, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8 }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#E60000', marginBottom: 8 }}>Sinopec Group</h4>
                <p style={{ color: '#64748B', fontWeight: 600, fontSize: '0.875rem' }}>Xitoy</p>
                <div style={{ fontSize: '0.75rem', marginTop: 12, color: '#94A3B8' }}>Masterbatch va Modifikatorlar</div>
             </div>
             <div style={{ padding: 40, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8 }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#D97706', marginBottom: 8 }}>Repsol SA</h4>
                <p style={{ color: '#64748B', fontWeight: 600, fontSize: '0.875rem' }}>Ispaniya</p>
                <div style={{ fontSize: '0.75rem', marginTop: 12, color: '#94A3B8' }}>Premium EVA va UV Stabilizatorlar</div>
             </div>
             <div style={{ padding: 40, background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8 }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563EB', marginBottom: 8 }}>Shurtan GCC</h4>
                <p style={{ color: '#64748B', fontWeight: 600, fontSize: '0.875rem' }}>O'zbekiston</p>
                <div style={{ fontSize: '0.75rem', marginTop: 12, color: '#94A3B8' }}>Yuqori sifatli HDPE xom-ashyosi</div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#0F172A', padding: '100px 0', borderTop: '4px solid #00A651', color: '#FFFFFF', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: 24, lineHeight: 1.1 }}>
            Katta hajmdagi B2B xaridlar uchun maxsus taklif
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: 700, margin: '0 auto 40px', fontSize: '1.25rem', lineHeight: 1.6 }}>
            "Original Grand Plast" korxonasi dilerlar, fermer xo'jaliklari va eksportyorlar uchun eng ma'qul narx va muddatlarda shartnoma tuzishni kafolatlaydi.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:info@grandplast.uz" style={{ 
                background: '#00A651', 
                color: '#FFFFFF', 
                padding: '16px 32px',
                borderRadius: '4px',
                fontWeight: 700,
                fontSize: '1.125rem',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
              <FileText size={20} /> Kommercheskiy Taklif So'rash
            </a>
            <a href="tel:+998996066333" style={{ 
                background: 'transparent', 
                color: '#FFFFFF', 
                padding: '16px 32px',
                borderRadius: '4px',
                fontWeight: 600,
                fontSize: '1.125rem',
                border: '1px solid rgba(255,255,255,0.2)',
              }}>
              Bosh Ofis: +998 99 606 63 33
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
