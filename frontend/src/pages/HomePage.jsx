import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, Scissors, Award, Truck, Shield, Star, CheckCircle, Zap } from 'lucide-react';
import { api } from '../api';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.getProducts('limit=8').then(res => setFeatured(res.data)).catch(() => {});
  }, []);

  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="hero" style={{ padding: 'var(--space-24) 0 var(--space-20)' }}>
        <div className="container">
          <div className="hero-content" style={{ maxWidth: 700 }}>
            <div className="hero-badge">
              <Star size={14} /> O'zbekistonning yetakchi tikuvchilik brendi
            </div>
            <h1>
              Sifat va uslubning <span className="accent">mukammal</span> uyg'unligi
            </h1>
            <p>
              TikuvPro — zamonaviy texnologiyalar va tajribali ustalar jamoasi bilan sizning brendingiz uchun
              yuqori sifatli kiyimlarni ishlab chiqaramiz. Har bir tikuv — san'at asari.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg" id="hero-cta-products">
                Mahsulotlarni ko'rish <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }} id="hero-cta-about">
                Biz haqimizda
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-value">500+</div>
                <div className="hero-stat-label">Bajarilgan buyurtmalar</div>
              </div>
              <div>
                <div className="hero-stat-value">50+</div>
                <div className="hero-stat-label">Doimiy mijozlar</div>
              </div>
              <div>
                <div className="hero-stat-value">10+</div>
                <div className="hero-stat-label">Yillik tajriba</div>
              </div>
              <div>
                <div className="hero-stat-value">30+</div>
                <div className="hero-stat-label">Malakali ustalar</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by section */}
      <section style={{ padding: 'var(--space-10) 0', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-light)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', fontWeight: 500, marginBottom: 'var(--space-5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Bizga ishonch bildirgan kompaniyalar
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-12)', flexWrap: 'wrap', opacity: 0.4 }}>
            {['ARTEL', 'UZTEX', 'SAG', 'CLASSIC', 'MILLIY STYLE'].map(name => (
              <span key={name} style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--color-primary)' }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="badge badge-accent" style={{ marginBottom: 'var(--space-4)', display: 'inline-block' }}>Afzalliklar</span>
            <h2 className="section-title" style={{ fontSize: 'var(--font-size-4xl)' }}>Nega aynan TikuvPro?</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Bizning kompaniya sifat, tezlik va ishonchlilik bilan ajralib turadi
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
            {[
              { icon: Award, title: 'Yuqori sifat', desc: 'Faqat sifatli materiallar va zamonaviy texnologiyalar ishlatiladi. Har bir mahsulot nazorat qilinadi.', color: '#6366F1' },
              { icon: Truck, title: 'Tezkor yetkazish', desc: "Buyurtmangizni qisqa muddatda tayyorlab, O'zbekiston bo'ylab yetkazib beramiz. 3-5 ish kuni.", color: '#10B981' },
              { icon: Scissors, title: 'Maxsus dizayn', desc: "Sizning talablaringizga mos individual dizayn yaratamiz. Sketchdan tayyor mahsulotgacha.", color: '#F59E0B' },
              { icon: Shield, title: 'Kafolat', desc: "Barcha mahsulotlarimizga 30 kunlik qaytarish kafolati. Sifatga to'liq javob beramiz.", color: '#3B82F6' },
              { icon: Zap, title: "Tezkor ishlab chiqarish", desc: "Zamonaviy jihozlar tufayli katta hajmdagi buyurtmalarni ham qisqa vaqtda bajaramiz.", color: '#EF4444' },
              { icon: CheckCircle, title: "Hamyonbop narxlar", desc: "Yuqori sifat — qulay narxda. Ulgurji buyurtmalarga maxsus chegirmalar taqdim etamiz.", color: '#8B5CF6' }
            ].map((item, i) => (
              <div key={i} className="mission-card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 'var(--radius-xl)',
                  background: `${item.color}15`, color: item.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto var(--space-5)'
                }}>
                  <item.icon size={28} />
                </div>
                <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>{item.title}</h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div>
              <span className="badge badge-accent" style={{ marginBottom: 'var(--space-3)', display: 'inline-block' }}>Katalog</span>
              <h2 className="section-title">Mashhur mahsulotlar</h2>
              <p className="section-subtitle">Eng ko'p sotilayotgan yuqori sifatli kiyimlarimiz</p>
            </div>
            <Link to="/products" className="btn btn-outline" id="view-all-products">
              Barchasini ko'rish <ArrowRight size={16} />
            </Link>
          </div>
          {featured.length > 0 ? (
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)'
            }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{
                  background: 'var(--color-bg)',
                  borderRadius: 'var(--radius-xl)',
                  height: 380,
                  animation: 'pulse 2s ease-in-out infinite',
                  border: '1px solid var(--color-border-light)'
                }}></div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="badge badge-accent" style={{ marginBottom: 'var(--space-4)', display: 'inline-block' }}>Jarayon</span>
            <h2 className="section-title" style={{ fontSize: 'var(--font-size-3xl)' }}>Qanday buyurtma berish mumkin?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-8)', maxWidth: 1000, margin: '0 auto' }}>
            {[
              { step: '01', title: "Ro'yxatdan o'ting", desc: "Saytda hisob yarating va shaxsiy kabinet oling" },
              { step: '02', title: 'Mahsulot tanlang', desc: "Katalogimizdan o'zingizga mos kiyimlarni tanlang" },
              { step: '03', title: 'Buyurtma bering', desc: "Savatga qo'shing va buyurtmani rasmiy qiling" },
              { step: '04', title: 'Qabul qiling', desc: "Biz tayyorlaymiz va manzilingizga yetkazamiz" }
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 'var(--radius-full)',
                  background: 'var(--color-accent)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto var(--space-4)',
                  fontSize: 'var(--font-size-lg)', fontWeight: 800
                }}>
                  {item.step}
                </div>
                <h3 style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>{item.title}</h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="badge badge-accent" style={{ marginBottom: 'var(--space-4)', display: 'inline-block' }}>Fikrlar</span>
            <h2 className="section-title">Mijozlarimiz nima deydi?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
            {[
              { name: 'Aziz Karimov', role: 'Tadbirkor', text: "TikuvPro bilan 3 yildan ortiq hamkorlik qilamiz. Sifat har doim yuqori, muddatga rioya qilishadi. Tavsiya qilaman!" },
              { name: 'Nilufar Rahimova', role: 'Dizayner', text: "Maxsus dizayndagi kiyimlarni buyurtma qildim. Natija kutgandan ham yaxshi chiqdi. Professional jamoa!" },
              { name: 'Bobur Aliyev', role: 'Do\'kon egasi', text: "Ulgurji buyurtmalar uchun eng yaxshi tanlov. Narxlar hamyonbop, sifat ajoyib. Doimo o'z vaqtida yetkazishadi." }
            ].map((item, i) => (
              <div key={i} style={{
                background: 'var(--color-bg)', borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-6)', border: '1px solid var(--color-border-light)'
              }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 'var(--space-4)' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="#F59E0B" color="#F59E0B" />)}
                </div>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-5)', fontSize: 'var(--font-size-sm)' }}>
                  "{item.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 'var(--radius-full)',
                    background: 'var(--color-accent-bg)', color: 'var(--color-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 'var(--font-size-sm)'
                  }}>
                    {item.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{item.name}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{item.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, #1a1f3d 50%, var(--color-primary-light) 100%)',
        color: 'white', textAlign: 'center', padding: 'var(--space-20) 0',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-50%', right: '-10%', width: 500, height: 500,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)', pointerEvents: 'none'
        }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 800, marginBottom: 'var(--space-4)', letterSpacing: '-0.03em' }}>
            Buyurtma berishga tayyormisiz?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 500, margin: '0 auto var(--space-8)', fontSize: 'var(--font-size-lg)' }}>
            Hoziroq ro'yxatdan o'ting va o'zingizga kerakli mahsulotni buyurtma qiling. Birinchi buyurtmaga 10% chegirma!
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg" id="cta-register">
              Ro'yxatdan o'tish <ArrowRight size={18} />
            </Link>
            <Link to="/products" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              Katalogni ko'rish
            </Link>
          </div>
          <p style={{ marginTop: 'var(--space-6)', fontSize: 'var(--font-size-sm)', color: 'rgba(255,255,255,0.4)' }}>
            🏷️ Promokod: YANGI10 — birinchi buyurtmaga 10% chegirma
          </p>
        </div>
      </section>
    </div>
  );
}
