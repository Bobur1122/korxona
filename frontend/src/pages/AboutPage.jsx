import { Target, Eye, Heart, Users, Award, Scissors, Clock, MapPin, Phone, Mail } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="fade-in">
      {/* Hero Banner */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, #1a1f3d 50%, var(--color-primary-light) 100%)',
        color: 'white',
        padding: 'var(--space-24) 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-40%', right: '-15%', width: 500, height: 500,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)', pointerEvents: 'none'
        }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="badge badge-accent" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex', background: 'rgba(99,102,241,0.2)', color: 'var(--color-accent-light)', border: '1px solid rgba(99,102,241,0.3)' }}>
            2014-yildan beri
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, var(--font-size-5xl))', fontWeight: 800, marginBottom: 'var(--space-4)', letterSpacing: '-0.03em' }}>
            Biz haqimizda
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 600, margin: '0 auto', fontSize: 'var(--font-size-lg)', lineHeight: 1.7 }}>
            Professional tikuvchilik sohasida 10 yildan ortiq tajriba. O'zbekistonning ishonchli va sifatli kiyim ishlab chiqaruvchisi.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="about-section" style={{ padding: 'var(--space-20) 0' }}>
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <span className="badge badge-accent" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>Bizning tarix</span>
              <h2>TikuvPro kompaniyasi haqida</h2>
              <p>
                TikuvPro — 2014-yilda Toshkent shahrida tashkil etilgan professional tikuvchilik kompaniyasi.
                O'n yildan ortiq faoliyatimiz davomida biz O'zbekistonning eng ishonchli kiyim ishlab chiqaruvchilaridan biriga aylandik.
              </p>
              <p>
                Zamonaviy Yaponiya va Germaniya jihozlari bilan jihozlangan ishlab chiqarish sexlarimizda 30 dan ortiq
                tajribali tikuvchi va dizaynerlar jamoamiz sizning brendingiz uchun mukammal kiyimlarni yaratishga qodir.
              </p>
              <p>
                Biz individual buyurtmalardan tortib, 10,000 donagacha bo'lgan ulgurji partiyalargacha — har qanday hajmdagi
                buyurtmalarni professional darajada bajaramiz. Har bir tikuv — bizning obro'yimiz.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginTop: 'var(--space-8)' }}>
                {[
                  { value: '500+', label: 'Bajarilgan buyurtmalar' },
                  { value: '50+', label: 'Doimiy mijozlar' },
                  { value: '30+', label: 'Malakali ustalar' },
                  { value: '10+', label: 'Yillik tajriba' }
                ].map((s, i) => (
                  <div key={i} style={{
                    padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)',
                    background: 'var(--color-accent-bg)', textAlign: 'center'
                  }}>
                    <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-accent)' }}>{s.value}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-8)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              textAlign: 'center',
              minHeight: 450,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', bottom: '-30%', left: '-20%', width: 300, height: 300,
                borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)'
              }}></div>
              <Scissors size={64} style={{ opacity: 0.3, marginBottom: 'var(--space-6)' }} />
              <div style={{ fontSize: 'var(--font-size-5xl)', fontWeight: 800, marginBottom: 'var(--space-2)', position: 'relative' }}>10+</div>
              <div style={{ fontSize: 'var(--font-size-lg)', opacity: 0.7, position: 'relative' }}>yillik tajriba</div>
              <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-6)', position: 'relative' }}>
                {[Award, Clock, Users].map((Icon, i) => (
                  <div key={i} style={{
                    width: 48, height: 48, borderRadius: 'var(--radius-lg)',
                    background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Icon size={20} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="badge badge-accent" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>Qadriyatlar</span>
            <h2 className="section-title" style={{ fontSize: 'var(--font-size-4xl)' }}>Missiya va qadriyatlarimiz</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Kompaniyamiz asosiy tamoyillari va maqsadlari
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-6)', maxWidth: 1100, margin: '0 auto' }}>
            {[
              { icon: Target, title: 'Missiyamiz', desc: "O'zbekiston tikuvchilik sanoatini jahon standartlariga olib chiqish va mahalliy brendlarni qo'llab-quvvatlash.", color: '#6366F1' },
              { icon: Eye, title: 'Vizyonimiz', desc: "Markaziy Osiyodagi eng ishonchli va innovatsion tikuvchilik brendiga aylanib, xalqaro bozorga chiqish.", color: '#10B981' },
              { icon: Heart, title: 'Qadriyatlar', desc: "Sifat, halollik, innovatsiya va mijozga hurmat — bizning har bir tikuvimizda aks etadi.", color: '#F59E0B' },
              { icon: Users, title: 'Jamoamiz', desc: "30+ malakali tikuvchi, 5 dizayner va 3 sifat nazoratchisi — sizga eng yaxshi xizmatni ko'rsatadi.", color: '#3B82F6' }
            ].map((item, i) => (
              <div key={i} className="mission-card" style={{ padding: 'var(--space-8)' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 'var(--radius-xl)',
                  background: `${item.color}15`, color: item.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 'var(--space-5)'
                }}>
                  <item.icon size={26} />
                </div>
                <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>{item.title}</h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we offer */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="badge badge-accent" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>Xizmatlar</span>
            <h2 className="section-title">Biz nimalar taklif qilamiz?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
            {[
              { title: "Buyurtma tikish", desc: "Sizning dizayn va talablaringiz bo'yicha maxsus kiyimlar tikish. Sketch taqdim qiling — biz amalga oshiramiz.", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=300&fit=crop" },
              { title: "Ulgurji ishlab chiqarish", desc: "100 donadan 10,000 donagacha partiyalarda sifatli kiyimlar ishlab chiqarish. Brendingiz etiketkasi bilan.", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=300&fit=crop" },
              { title: "Dizayn xizmati", desc: "Professional dizaynerlar jamoamiz sizning g'oyangizni real mahsulotga aylantiradi. Konsultatsiya bepul.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=300&fit=crop" }
            ].map((item, i) => (
              <div key={i} className="card" style={{ overflow: 'hidden' }}>
                <img src={item.image} alt={item.title} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                <div className="card-body" style={{ padding: 'var(--space-6)' }}>
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>{item.title}</h3>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Map */}
      <section className="section" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <span className="badge badge-accent" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>Manzil</span>
            <h2 className="section-title">Bizning manzil</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Toshkent shahridagi ofis va ishlab chiqarish binomiz
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)', alignItems: 'start' }}>
            <div>
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.254169893101!2d69.27927647605068!3d41.31115397131356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sTashkent%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1703147698761!5m2!1sen!2s"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="TikuvPro joylashuvi"
                ></iframe>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {[
                  { icon: MapPin, label: 'Manzil', value: "Toshkent sh., Yakkasaroy tumani, Shota Rustaveli ko'chasi, 45-uy", color: '#6366F1' },
                  { icon: Phone, label: 'Telefon', value: '+998 90 123 45 67', color: '#10B981' },
                  { icon: Mail, label: 'Email', value: 'info@tikuvpro.uz', color: '#3B82F6' },
                  { icon: Clock, label: 'Ish vaqti', value: 'Du-Sh: 09:00 - 18:00', color: '#F59E0B' }
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)',
                    padding: 'var(--space-5)', background: 'var(--color-bg)',
                    borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border-light)'
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 'var(--radius-lg)',
                      background: `${item.color}15`, color: item.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <item.icon size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
