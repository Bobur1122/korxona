import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, Phone, Factory, Shield, Truck, Globe, Banknote, Handshake, Wrench, PhoneCall, Leaf, Package, ShoppingBag, Droplets, Building2, Circle, Star, Mail } from 'lucide-react';
import { api } from '../api';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.getProducts('limit=8').then(res => setFeatured(res.data)).catch(() => {});
  }, []);

  const productTypes = [
    { icon: <Leaf size={28} />, title: 'Issiqxona plyonkasi', desc: 'UV-barqaror, uch qatlamli polietilen plyonka. Kengligi 12 metrgacha — O\'zbekistonda birinchi va yagona. O\'simliklar uchun optimal mikroiqlim yaratadi, uzoq muddatli foydalanishga moslashtirilgan.', link: '/products' },
    { icon: <Package size={28} />, title: 'Termo-usadoz plyonka', desc: 'Issiq bilan ishlov berilganda qisqarib mahsulotni mustahkam o\'raydigan qadoqlash filmi. Sanoat, omborxonalar va chakana savdo uchun. Qalinligi 20-50 mikron.', link: '/products' },
    { icon: <ShoppingBag size={28} />, title: 'Polietilen paketlar', desc: 'Turli hajm va qalinlikda umumiy maqsadli paketlar. Banklar uchun pulni vakuum usuli bilan qadoqlash sumkalari — maxsus mustahkam qatlamga ega.', link: '/products' },
    { icon: <Droplets size={28} />, title: 'PET kapsulalar', desc: 'Suv va yog\' idishlari uchun egiluvchan qopqoq materiallari. 1 litr suv uchun ~28 gr, 5-10 litr yog\' uchun 84-140 gr. Sovuqqa va kimyoviy ta\'sirga chidamli.', link: '/products' },
    { icon: <Building2 size={28} />, title: 'Tom yopish materiallari', desc: '"Roof Cover" — yog\'och va metal damlamalar uchun rulonli gidroizolyatsiya materiali. Alyuminiy folga yoki oddiy variant. 1-1.5 m kenglikda.', link: '/products' },
    { icon: <Circle size={28} />, title: 'Bitum-polimer mastika', desc: 'Gidroizolyatsiya va hermetizatsiya uchun maxsus polimer aralashma. Qurilish va ta\'mirlash ishlarida keng qo\'llaniladi. 20 kg qadoqda.', link: '/products' }
  ];

  const advantages = [
    { icon: <Factory size={24} />, title: 'Zamonaviy uskunalar', desc: 'Yevropa va Osiyo texnologiyalari asosida jihozlangan ishlab chiqarish sexlari. Har bir bosqichda sifat nazorati.' },
    { icon: <Globe size={24} />, title: 'Import xomashyo', desc: 'Ispaniya, Koreya, Xitoy, Turkiya, Singapur va Rossiyadan keltirilgan yuqori sifatli materiallar.' },
    { icon: <Shield size={24} />, title: 'Texnik nazorat', desc: 'Barcha mahsulotlar tegishli texnik shartnomalarga mos kelishini kafolatlaymiz. Nazorat har bosqichda.' },
    { icon: <Truck size={24} />, title: 'Bepul yetkazish', desc: 'Toshkent ichida kuryer va pochta orqali bepul. Viloyatlarga kelishilgan transport bilan.' },
    { icon: <Banknote size={24} />, title: 'Moslashuvchan narx', desc: 'Katta partiyalar uchun maxsus chegirmalar. Doimiy mijozlarga VIP shartlar.' },
    { icon: <Handshake size={24} />, title: 'Individual yondashuv', desc: 'Har bir buyurtma alohida muzokara asosida. O\'lcham va xususiyatlar talabga binoan.' },
    { icon: <Wrench size={24} />, title: 'Professional maslahat', desc: 'Mahsulot tanlashda mutaxassislarimiz bepul maslahat berishadi.' },
    { icon: <PhoneCall size={24} />, title: '3 ta aloqa raqami', desc: '+998 99 606 63 33 / 818 63 33 / 828 63 33 — doim aloqadamiz.' }
  ];

  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-glow hero-glow-1"></div>
        <div className="hero-bg-glow hero-glow-2"></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-content" style={{ maxWidth: 750 }}>
            <div className="hero-badge">
              <Factory size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
              2005 yildan beri ishlab chiqarish • O'zbekistonda №1
            </div>
            <h1>
              <span className="accent">Original Grand Plast</span> — polietilen plyonka va qadoqlash materiallari ishlab chiqaruvchi
            </h1>
            <p>
              2013 yildan buyon O'zbekistonda yagona — kengligi 12 metrgacha bo'lgan uch qatlamli issiqxona plyonkasini 
              ishlab chiqaruvchi zamonaviy korxona. Ispaniya, Koreya, Turkiya va Singapurdan import qilingan yuqori sifatli 
              xomashyo asosida qishloq xo'jaligi, qurilish va sanoat uchun mahsulotlar tayyorlaymiz.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg" id="hero-cta-products">
                Katalogni ko'rish <ArrowRight size={18} />
              </Link>
              <a href="tel:+998996066333" className="btn btn-lg btn-glass" id="hero-cta-call">
                <Phone size={16} /> Bog'lanish
              </a>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-value">2005</div>
                <div className="hero-stat-label">Tashkil etilgan</div>
              </div>
              <div>
                <div className="hero-stat-value">12m</div>
                <div className="hero-stat-label">Plyonka kengligi</div>
              </div>
              <div>
                <div className="hero-stat-value">3</div>
                <div className="hero-stat-label">Qatlamli texnologiya</div>
              </div>
              <div>
                <div className="hero-stat-value">6+</div>
                <div className="hero-stat-label">Soha yo'nalishi</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Overview */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-badge">Mahsulotlar assortimenti</span>
            <h2 className="section-title" style={{ fontSize: 'var(--font-size-4xl)' }}>Ishlab chiqarish yo'nalishlari</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Qishloq xo'jaligi, qurilish, sanoat, oziq-ovqat va banklar uchun polietilen mahsulotlar
            </p>
          </div>
          <div className="features-grid">
            {productTypes.map((item, i) => (
              <Link key={i} to={item.link} className="feature-card" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                <div className="feature-icon-wrap">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <div style={{ marginTop: 'var(--space-4)', color: 'var(--color-accent)', fontWeight: 600, fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                  Batafsil <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="section section-alt">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-badge">Nima uchun biz?</span>
            <h2 className="section-title">Original Grand Plast afzalliklari</h2>
          </div>
          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {advantages.map((item, i) => (
              <div key={i} className="feature-card" style={{ cursor: 'default' }}>
                <div className="feature-icon-wrap small">{item.icon}</div>
                <h3 style={{ fontSize: 'var(--font-size-base)' }}>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div>
              <span className="section-badge">Katalog</span>
              <h2 className="section-title">Mahsulotlar</h2>
              <p className="section-subtitle">Barcha narxlar so'rov asosida kelishiladi. Katta partiyalarga chegirmalar.</p>
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
            <div className="products-grid">
              {[1,2,3,4].map(i => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section-alt">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-badge">Mijozlar fikri</span>
            <h2 className="section-title">Bizning mijozlarimiz aytadi</h2>
          </div>
          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {[
              { text: "Original Grand Plast plyonkalaridan foydalanib biz issiqxonadagi hosildorlikni oshirdik. Sifatli material tez yetkazildi, narxlari ham maqbul ekan.", name: "Karimbek", role: "Fermer xo'jaligi rahbari" },
              { text: "Shahar qurilishida Original Grand Plast tom materiallaridan foydalandik. \"Roof Cover\" plyonkasi qurilmani mukammal suv o'tkazmaydigan qilib berdi.", name: "Elmira", role: "Qurilish kompaniyasi menejeri" },
              { text: "Polietilen paketlaringiz juda mustahkam chiqdi – mahsulotlarimiz yetib kelguncha hech narsa buzilmadi. Ishi oson va professional.", name: "Javlon", role: "Logistika xodimi" }
            ].map((t, i) => (
              <div key={i} className="feature-card testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="var(--color-accent)" color="var(--color-accent)" />)}
                </div>
                <p style={{ fontStyle: 'italic', marginBottom: 'var(--space-4)', lineHeight: 1.8 }}>"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>{t.name}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Order */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-badge">Buyurtma jarayoni</span>
            <h2 className="section-title">Qanday buyurtma berish mumkin?</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>To'lov usullari: naqd pul, bank o'tkazmasi, UzCard, HUMO, Payme, Click</p>
          </div>
          <div className="steps-grid">
            {[
              { step: '01', title: "Bog'laning", desc: "Telefon, email yoki sayt orqali murojaat qiling" },
              { step: '02', title: 'Maslahat oling', desc: "Mutaxassis bilan mahsulot va o'lchamni tanlang" },
              { step: '03', title: 'Shartnoma tuzing', desc: "Hajm, narx va yetkazish shartlarini kelishing" },
              { step: '04', title: 'Qabul qiling', desc: "Toshkentda bepul yetkazib beramiz" }
            ].map((item, i) => (
              <div key={i} className="step-card">
                <div className="step-number">{item.step}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section-alt">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="section-badge">FAQ</span>
            <h2 className="section-title">Ko'p so'raladigan savollar</h2>
          </div>
          <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {[
              { q: "Original Grand Plast nima ishlab chiqaradi?", a: "Issiqxona plyonkasi, termo-usadoz plyonka, polietilen paketlar, PET kapsulalar, tom yopish materiallari va bitum-polimer mastika." },
              { q: "Minimal buyurtma miqdori qancha?", a: "Aniq belgilangan minimal buyurtma yo'q — har bir buyurtma hajmi alohida muzokara asosida belgilanadi." },
              { q: "Yetkazib berish shartlari qanday?", a: "Toshkentda kuryer yoki pochta orqali bepul. Viloyatlarga kelishilgan transport bilan yetkaziladi." },
              { q: "To'lov usullari?", a: "Naqd pul, bank o'tkazmasi, UzCard, HUMO, Payme, Click va Apelsin orqali to'lash mumkin." },
              { q: "Ish vaqtingiz?", a: "Dushanbadan jumagacha 08:00 — 18:00. Shanba va yakshanba dam olish kunlari." }
            ].map((item, i) => (
              <div key={i} className="feature-card faq-card">
                <h3 style={{ fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-2)', color: 'var(--color-primary)' }}>{item.q}</h3>
                <p style={{ margin: 0 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="hero-bg-glow hero-glow-1"></div>
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, var(--font-size-4xl))', fontWeight: 800, marginBottom: 'var(--space-4)', letterSpacing: '-0.03em' }}>
            Bepul maslahat va narx taklif oling
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 550, margin: '0 auto var(--space-6)', fontSize: 'var(--font-size-lg)' }}>
            Mutaxassislarimiz sizga eng mos mahsulot va narxni taklif qilishadi
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:+998996066333" className="btn btn-primary btn-lg">
              <Phone size={18} /> +998 99 606 63 33
            </a>
            <a href="tel:+998998186333" className="btn btn-lg btn-glass">
              <Phone size={16} /> +998 99 818 63 33
            </a>
            <a href="mailto:ogp-info@mail.ru" className="btn btn-lg btn-glass">
              <Mail size={16} /> ogp-info@mail.ru
            </a>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-6)' }}>
            Toshkent, Uchtepa tumani, Foziltepa ko'chasi, 9-uy • ogp.uz
          </p>
        </div>
      </section>
    </div>
  );
}
