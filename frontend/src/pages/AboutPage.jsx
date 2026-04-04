import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="cta-section" style={{ padding: 'calc(var(--space-24) + 60px) 0 var(--space-20)', textAlign: 'center' }}>
        <div className="hero-bg-glow hero-glow-1"></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-badge" style={{ background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.3)' }}>
            2005 yildan beri faoliyat yuritmoqda
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, var(--font-size-5xl))', fontWeight: 800, marginBottom: 'var(--space-4)', letterSpacing: '-0.03em' }}>
            Original Grand Plast MChJ
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 650, margin: '0 auto', fontSize: 'var(--font-size-lg)', lineHeight: 1.7 }}>
            2005-yildan buyon polietilen va polimer materiallari ishlab chiqaruvchi Markaziy Osiyodagi yetakchi korxona. O'zbekistonda birinchi bo'lib 12 metrli uch qatlamli plyonkani taqdim etgan innovatsion zavod.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="section" style={{ padding: 'var(--space-20) 0' }}>
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <span className="badge badge-accent" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>Tarix</span>
              <h2>Korxona haqida</h2>
              <p>
                <strong>Original Grand Plast MChJ</strong> 2005 yilda Toshkent shahrida tashkil topgan bo'lib, asosiy faoliyat 
                yo'nalishi polietilen plyonka va qadoqlash materiallari ishlab chiqarishdir. Korxona ilk yillarida turli xil 
                polietilen mahsulotlar (paketlar, plyonkalar) ishlab chiqarishga ixtisoslashdi.
              </p>
              <p>
                <strong>2013-yilda</strong> korxonamiz O'zbekiston sanoatida inqilobiy qadam tashladi — mamlakatimizda birinchi marotaba 
                uch qatlamli, kengligi <strong>12 metrga</strong> yetuvchi issiqxona plyonkalarini ishlab chiqarishni yo'lga qo'ydi. 
                Bu texnologiya agrar sektorga yirik hajmdagi issiqxonalarni choklarsiz va mustahkam qoplash imkonini berdi.
              </p>
              <p>
                Bizning muvaffaqiyatimiz zamonaviy texnologiyalarga asoslangan. Ishlab chiqarish liniyalarimiz Ispaniya, Koreya, Xitoy va Turkiyaning 
                eng ilg'or uskunalari bilan jihozlangan. Xom-ashyo sifatida esa dunyo gigantlari bo'lmish <strong>Repsol (Ispaniya)</strong>, 
                <strong>Lotte Chemical (Koreya)</strong> va <strong>Sinopec (Xitoy)</strong> mahsulotlaridan foydalanamiz.
              </p>
              <p>
                Bundan tashqari, biz gidroizolyatsiya sohasida ham o'z so'zimizni aytdik. <strong>"ROOF COVER"</strong> brendi ostida ishlab chiqarilayotgan 
                rulonli tom yopish materiallari va bitum-polimer mastikalari bugungi kunda qurilish bozorida yuqori sifat standarti hisoblanadi.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginTop: 'var(--space-8)' }}>
                {[
                  { value: '2005', label: 'Tashkil etilgan' },
                  { value: '12m', label: 'Max plyonka kengligi' },
                  { value: '3 qatlamli', label: 'Texnologiya' },
                  { value: '5+', label: 'Mahsulot turi' }
                ].map((s, i) => (
                  <div key={i} className="feature-card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-accent)' }}>{s.value}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #022c22 0%, var(--color-primary) 50%, #065F46 100%)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-8)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              color: 'white', textAlign: 'center', minHeight: 400, position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', bottom: '-30%', left: '-20%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.2), transparent 70%)' }}></div>
              <div style={{ fontSize: 80, opacity: 0.08, position: 'absolute', top: 20, right: 20, fontWeight: 900, letterSpacing: '-0.05em' }}>OGP</div>
              <div style={{ position: 'relative', marginBottom: 'var(--space-6)' }}>
                <div style={{ fontSize: 'var(--font-size-5xl)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>Original</div>
                <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--color-accent-light)', letterSpacing: '-0.02em' }}>Grand Plast</div>
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.4 }}>2005 yildan beri • Toshkent</div>
              <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-3) var(--space-5)', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-full)', fontSize: 'var(--font-size-xs)', border: '1px solid rgba(255,255,255,0.15)' }}>
                O'zbekistonda №1 issiqxona plyonkasi
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="badge badge-accent" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>Faoliyat</span>
            <h2 className="section-title">Asosiy yo'nalishlar</h2>
          </div>
          <div className="features-grid">
            {[
              { emoji: '🌿', title: 'Issiqxona plyonkasi', desc: 'Kuchli UV nurlanishga chidamli, uch qatlamli polietilen plyonka. 12 m gacha kenglik.' },
              { emoji: '📦', title: 'Termo-usadoz plyonka', desc: 'Issiq bilan ishlov berilganda tavlanib, mahsulotlarni mustahkam o\'rashda qo\'llaniladi.' },
              { emoji: '🛍️', title: 'Polietilen paketlar', desc: 'Banklar uchun pulni vakuum bilan o\'rash sumkalari va turli hajmdagi paketlar.' },
              { emoji: '💧', title: 'PET kapsulalar', desc: 'Suv va yog\' idishlari uchun 28-140 gramm oralig\'idagi qopqoq materiallari.' },
              { emoji: '🏗️', title: 'ROOF COVER — Gidroizolyatsiya', desc: 'Rulonli tom yopish va gidroizolyatsiya materiallari. Issiq va sovuqqa o\'ta chidamli, uzoq umr ko\'ruvchi qoplamalar.' },
              { emoji: '⚫', title: 'Bitum-polimer mastika', desc: 'Gidroizolyatsiya va hermetizatsiya ishlari uchun yuqori adgeziyali polimer mastikalar.' }
            ].map((item, i) => (
              <div key={i} className="feature-card">
                <div style={{ fontSize: 36, marginBottom: 'var(--space-3)', lineHeight: 1 }}>{item.emoji}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <span className="badge badge-accent" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>Qadriyatlar</span>
            <h2 className="section-title">Missiya va maqsad</h2>
          </div>
          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {[
              { emoji: '🎯', title: 'Missiyamiz', desc: 'Zamonaviy texnologiyalar va sifatli xomashyolardan foydalanib, mijozlarga foydali va arzon qadoqlash yechimlarini taqdim etish.' },
              { emoji: '💎', title: 'Qadriyatlarimiz', desc: 'Sifat, ishonchlilik va innovatsiyalar. Har bir hamkor bilan uzoq muddatli hamkorlikni saqlashga intilamiz.' },
              { emoji: '🌱', title: 'Ekologiya', desc: 'Chiqindilarni kamaytirish va qayta ishlash imkoniyatlariga e\'tibor qaratamiz.' },
              { emoji: '🤝', title: 'Individual yondashuv', desc: 'Har bir mijoz bilan alohida ishlash. Katta partiyalar uchun maxsus narx shartlari.' }
            ].map((item, i) => (
              <div key={i} className="feature-card">
                <div style={{ fontSize: 36, marginBottom: 'var(--space-3)', lineHeight: 1 }}>{item.emoji}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <span className="badge badge-accent" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>Aloqa</span>
            <h2 className="section-title">Biz bilan bog'laning</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Savollaringiz bo'lsa yoki buyurtma bermoqchi bo'lsangiz — murojaat qiling
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-8)', alignItems: 'start' }}>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.254169893101!2d69.27927647605068!3d41.31115397131356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sTashkent%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1703147698761!5m2!1sen!2s"
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="Original Grand Plast manzili"
              ></iframe>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { emoji: '📍', label: 'Manzil', value: "Toshkent sh., Uchtepa tumani, Foziltepa ko'chasi, 9-uy" },
                { emoji: '📞', label: 'Telefon', value: '+998 99 606 63 33' },
                { emoji: '📞', label: 'Telefon 2', value: '+998 99 818 63 33' },
                { emoji: '📞', label: 'Telefon 3', value: '+998 99 828 63 33' },
                { emoji: '📧', label: 'Email', value: 'ogp-info@mail.ru' },
                { emoji: '🌐', label: 'Veb-sayt', value: 'ogp.uz' },
                { emoji: '🕐', label: 'Ish vaqti', value: 'Du-Ju: 08:00 - 18:00' }
              ].map((item, i) => (
                <div key={i} className="feature-card" style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>{item.emoji}</div>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 500 }}>{item.label}</div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" style={{ padding: 'var(--space-16) 0' }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>
            Hamkorlik qilishga tayyormisiz?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 'var(--space-6)' }}>
            Mahsulotlar, narxlar va yetkazib berish haqida batafsil ma'lumot uchun qo'ng'iroq qiling
          </p>
          <a href="tel:+998996066333" className="btn btn-primary btn-lg">
            <Phone size={18} /> Qo'ng'iroq qilish
          </a>
        </div>
      </section>
    </div>
  );
}
