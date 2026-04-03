import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, Globe, ShieldCheck, Factory, PlaySquare, FileText, Cpu, PenTool, CheckCircle, Award } from 'lucide-react';
import { api } from '../api';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.getProducts('limit=8').then(res => setFeatured(res.data)).catch(() => {});
  }, []);

  return (
    <div className="fade-in">
      {/* ENTERPRISE HERO */}
      <section className="hero" style={{ background: 'transparent' }}>
        <div className="hero-bg-glow hero-glow-1"></div>
        <div className="hero-bg-glow hero-glow-2"></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-content" style={{ maxWidth: 850, textAlign: 'left', margin: 0 }}>
            <div className="hero-badge" style={{ background: 'rgba(30, 41, 59, 0.8)', color: 'var(--color-text-secondary)', border: '1px solid rgba(255,255,255,0.1)'}}>
              <Globe size={16} className="text-info" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6, color: '#0EA5E9' }} />
              Xalqaro standartlardagi qadoqlash integratsiyasi
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, var(--font-size-5xl))', lineHeight: 1.1 }}>
              Sanoat va Qishloq Xo'jaligi Uchun <br/>
              <span className="accent" style={{ background: 'linear-gradient(90deg, #10B981 0%, #00A651 100%)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                Innovatsion Plyonkalar
              </span>
            </h1>
            <p style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-text-secondary)', maxWidth: 650, marginTop: 'var(--space-6)' }}>
              2005 yildan beri Markaziy Osiyodagi eng yirik polimer materiallari ishlab chiqaruvchi zavodlaridan biri. Uch qatlamli kogeztruziya, 12 metrgacha kenglik va ISO 9001 kafolati.
            </p>
            <div className="hero-actions" style={{ justifyContent: 'flex-start', marginTop: 'var(--space-8)' }}>
              <Link to="/products" className="btn btn-primary btn-lg" style={{ background: 'var(--color-accent)', color: '#0F172A' }}>
                Katalogni o'rganish <ArrowRight size={18} />
              </Link>
              <a href="#company" className="btn btn-lg btn-glass">
                Kompaniya profili
              </a>
            </div>
            
            <div className="hero-stats" style={{ justifyContent: 'flex-start', gap: 'var(--space-12)', marginTop: 'var(--space-12)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 'var(--space-8)' }}>
              <div>
                <div className="hero-stat-value" style={{ color: '#F8FAFC' }}>7500+</div>
                <div className="hero-stat-label">Tonna / yiliga ishlab chiqarish</div>
              </div>
              <div>
                <div className="hero-stat-value" style={{ color: '#F8FAFC' }}>12m</div>
                <div className="hero-stat-label">Uch qatlamli plyonka kengligi</div>
              </div>
              <div>
                <div className="hero-stat-value" style={{ color: '#F8FAFC' }}>15+</div>
                <div className="hero-stat-label">Export davlatlari (Rossiya, MDH)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES & CERTIFICATIONS */}
      <section className="section" style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-10)', alignItems: 'center' }}>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-6)' }}>
              <h3 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: 2 }}>Ishonchli Hamkor</h3>
              <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><ShieldCheck size={24} className="text-info" color="#0EA5E9" /> <span style={{ fontWeight: 600 }}>ISO 9001:2015</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><Award size={24} className="text-warning" color="#F59E0B" /> <span style={{ fontWeight: 600 }}>O'zDSt 2824:2014</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><CheckCircle size={24} className="text-success" color="#10B981" /> <span style={{ fontWeight: 600 }}>EAC Sertifikati</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNICAL SOLUTIONS */}
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: 'var(--space-12)' }}>
            <span className="section-badge">Texnologik Yechimlar</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              <h2 className="section-title">Sanoat uchun maxsus plyonkalar</h2>
              <p className="section-subtitle" style={{ margin: 0, textAlign: 'right' }}>
                Fizik-mexanik ko'rsatkichlari yuqori bo'lgan, iqlim <br/>sharoitlariga chidamli qoplamalar
              </p>
            </div>
          </div>
          
          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
            {/* Prod 1 */}
            <div className="card" style={{ padding: 'var(--space-8)' }}>
               <h3 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-4)', color: 'var(--color-text)' }}>Agro / Issiqxona Komplekslari</h3>
               <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>Zavodimiz qalinligi 100 dan 200 mikrongacha bo'lgan ko'p qatlamli UV, IR va EVA qo'shimchali plyonkalarni ishlab chiqaradi.</p>
               <div style={{ background: 'rgba(0,0,0,0.2)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Maksimal kenglik:</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-accent-light)' }}>12 Metrgacha</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>UV Kafolat:</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>3-5 Yil</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Yorug'lik o'tkazuvchanlik:</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>88-92%</span>
                  </div>
               </div>
               <Link to="/products" className="btn btn-ghost" style={{ width: '100%' }}>Parametrlarni ko'rish</Link>
            </div>

            {/* Prod 2 */}
            <div className="card" style={{ padding: 'var(--space-8)' }}>
               <h3 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-4)', color: 'var(--color-text)' }}>Termo Qadoqlash (Shrink)</h3>
               <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>Guruhli va palletli qadoqlash uchun mo'ljallangan, avtomat uzatgichli liniyalar uchun ideal deformatsiya kuchi bo'lgan texnik plyonkalar.</p>
               <div style={{ background: 'rgba(0,0,0,0.2)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Uzilishdagi cho'zilish:</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-info)' }}>≥ 350% MD</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Termik siqilish:</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>T 50-70% / K 30-50%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Zichlik (Density):</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>0.920 - 0.925 g/cm³</span>
                  </div>
               </div>
               <Link to="/products" className="btn btn-ghost" style={{ width: '100%' }}>Parametrlarni ko'rish</Link>
            </div>
            
            {/* Prod 3 */}
            <div className="card" style={{ padding: 'var(--space-8)' }}>
               <h3 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-4)', color: 'var(--color-text)' }}>Bozor va Bank Tizimi Paketi</h3>
               <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>Og'ir yuk ko'tarishga mo'ljallangan va xavfsizlik (vakuumli bank sumkalari) uchun eng kuchli ekstrudirovka qilingan polimer qopchalar.</p>
               <div style={{ background: 'rgba(0,0,0,0.2)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', marginBottom: 'var(--space-6)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Payvand choki kuchi:</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-error)' }}>Plexus texnologiyasi</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Chidamli yuk:</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>35 Kggacha</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Vakuum muhr:</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>Mavjud (Bank uchun)</span>
                  </div>
               </div>
               <Link to="/products" className="btn btn-ghost" style={{ width: '100%' }}>Parametrlarni ko'rish</Link>
            </div>
          </div>
        </div>
      </section>

      {/* MANUFACTURING INFRASTRUCTURE */}
      <section id="company" className="section section-alt" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'center' }}>
            <div>
              <span className="section-badge">Infratuzilma</span>
              <h2 className="section-title" style={{ fontSize: 'var(--font-size-4xl)' }}>Modernlashtirilgan Ishlab Chiqarish Bazasiga Egamiz</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-6)' }}>
                Zavod hududida oxirgi avlod Bandera (Italiya) va Macchi (Italiya) ekstruziya usskunalari o'rnatilgan bo'lib, ular xatogarchiliklarsiz to'liq avtomatik tarzda ishlaydi. 
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                <li style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  <div className="feature-icon-wrap small" style={{ margin: 0, flexShrink: 0, background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}><Cpu size={20} /></div>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>Avtomatlashtirilgan Dozatorlar</h4>
                    <p style={{ color: 'var(--color-text-muted)' }}>Material va stabilizatorlarni 99.9% aniqlik bilan tayyorlash.</p>
                  </div>
                </li>
                <li style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  <div className="feature-icon-wrap small" style={{ margin: 0, flexShrink: 0, background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}><PlaySquare size={20} /></div>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>Laboratoriya Nazorati</h4>
                    <p style={{ color: 'var(--color-text-muted)' }}>Koreya litsenziyasi asosida uzilish, Dart-drop va kimyoviy chidamlilik testlari.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div style={{ padding: 'var(--space-8)', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, background: 'radial-gradient(circle at 80% 20%, rgba(0,166,81,0.15) 0%, transparent 60%)' }}></div>
              <h3 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--space-6)', position: 'relative' }}>Xom Ashyo va Yetkazib Beruvchilar</h3>
              <p style={{ color: 'var(--color-text-secondary)', position: 'relative' }}>Biz dunyoning yetakchi polimer gigantlari xom ashyolaridan foydalanamiz, bu barqaror sifatning kalitidir:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-6)', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                   <span>Lotte Chemical (Koreya)</span> <span style={{ color: 'var(--color-accent)' }}>LDPE, LLDPE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                   <span>Sinopec (Xitoy)</span> <span style={{ color: 'var(--color-accent)' }}>Masterbatch</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                   <span>Repsol (Ispaniya)</span> <span style={{ color: 'var(--color-accent)' }}>EVA & UV Stabilizers</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) 0' }}>
                   <span>Shurtan GKM (O'zbekiston)</span> <span style={{ color: 'var(--color-accent)' }}>HDPE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG EXCERPT */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-8)' }}>
            <div>
              <span className="section-badge">Maxsulotlar Katalokgi</span>
              <h2 className="section-title">Yangi va Ommabop Maxsulotlar</h2>
            </div>
            <Link to="/products" className="btn btn-outline" id="view-all-products">
              Barcha maxsulotlar <ArrowRight size={16} />
            </Link>
          </div>
          {featured.length > 0 ? (
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div className="products-grid">
              {[1,2,3,4].map(i => (
                <div key={i} className="skeleton-card" style={{ background: 'rgba(255,255,255,0.05)' }}></div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* GLOBAL LOGISTICS */}
      <section className="section section-alt" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
            <span className="section-badge">Logistika va Eksport</span>
            <h2 className="section-title">Chegara bilmas yetkazib berish tizimi</h2>
            <p className="section-subtitle" style={{ margin: '0 auto var(--space-12)' }}>O'zimizning avtopark va temir yo'l shaxobchamiz orqali MXX (MDH) mamlakatlariga yirik hajmdagi vagon/furalarda eksport qilamiz.</p>
            
            <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div className="card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
                <h3 style={{ fontSize: 'var(--font-size-3xl)', color: 'var(--color-text)' }}>Rossiya</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>Markaziy hududlar va Sibir</p>
              </div>
              <div className="card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
                <h3 style={{ fontSize: 'var(--font-size-3xl)', color: 'var(--color-text)' }}>Qozog'iston</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>Olmaota va janubiy hududlar</p>
              </div>
              <div className="card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
                <h3 style={{ fontSize: 'var(--font-size-3xl)', color: 'var(--color-text)' }}>Qirg'iziston</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>Bishkek va Issiqko'l</p>
              </div>
              <div className="card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
                <h3 style={{ fontSize: 'var(--font-size-3xl)', color: 'var(--color-text)' }}>Tojikiston</h3>
                <p style={{ color: 'var(--color-text-muted)' }}>Dushanbe va So'g'd</p>
              </div>
            </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" style={{ background: 'var(--color-primary-light)', padding: 'calc(var(--space-20) * 1.5) 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="hero-bg-glow hero-glow-1"></div>
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, var(--font-size-5xl))', fontWeight: 800, marginBottom: 'var(--space-4)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Korporativ va Ulgurji Savdo Uchun <br/> <span style={{ color: 'var(--color-accent)' }}>Katalog va Narxnoma Oling</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 650, margin: '0 auto var(--space-8)', fontSize: 'var(--font-size-lg)' }}>
            Bizning dilerlik dasturimiz va eksport logistikasi haqida batafsil ma'lumot olish uchun sotuv bo'limimizga bevosita murojaat qiling. Biz har bir yirik buyurtmachi bilan individual shartnoma tuzamiz.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:ogp-info@mail.ru" className="btn btn-primary btn-lg" style={{ background: 'var(--color-accent)', color: '#0F172A' }}>
              <FileText size={18} /> Kommercheskiy Taklif Olish
            </a>
            <a href="tel:+998996066333" className="btn btn-lg btn-glass">
              Boshqaruv Ofisi: +998 99 606 63 33
            </a>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-8)', display: 'flex', justifyContent: 'center', gap: 'var(--space-4)' }}>
            <span>Manzil: Toshkent sh., Uchtepa t., Foziltepa 9</span> • 
            <span>INN: 205 843 129</span> • 
            <span>Sayt: OGP.UZ</span>
          </p>
        </div>
      </section>
    </div>
  );
}
