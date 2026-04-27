import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Check, Ruler, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

const accessoryData = {
  'zajm-profil': {
    title: 'Zajm profil (Зажим профил)',
    subtitle: 'Issiqxona konstruksiyalari uchun galvaniz po\'lat profil',
    description: 'Issiqxona konstruksiyalarini mustahkam birlashtirish uchun maxsus ishlab chiqilgan galvanizlangan po\'lat zajm profil. Plyonkani profilga mahkamlash uchun ishlatiladi. Yuqori korroziyaga chidamlilik va uzoq xizmat muddati kafolatlanadi. Zigzag sim bilan birgalikda ishlatiladi.',
    heroImage: '/images/zajm_profil.jpg',
    unit: 'metr',
    unitLabel: 'Metr',
    pricePerUnit: 8000,
    specs: [
      { k: 'Material', v: 'Galvaniz po\'lat' },
      { k: 'Uzunlik', v: '2–6 m' },
      { k: 'Qalinlik', v: '0.5–1.5 mm' },
      { k: 'Rangi', v: 'Kumush' },
      { k: 'Qo\'llanish', v: 'Issiqxona' },
      { k: 'Xizmat muddati', v: '15+ yil' },
    ],
    features: [
      'Korroziyaga chidamli galvaniz qoplama',
      'Oson o\'rnatish imkoniyati',
      'Zigzag sim bilan birgalikda ishlatiladi',
      'Har qanday issiqxona turiga mos',
    ],
    relatedSlug: 'zigzag-sim',
    relatedTitle: 'Zigzag sim',
    relatedDesc: 'Zajm profil ichiga qo\'yiladigan sim',
  },
  'zigzag-sim': {
    title: 'Zigzag sim',
    subtitle: 'Zajm profil ichiga qo\'yiladigan prujinali sim',
    description: 'Issiqxona plyonkasini zajm profilga mustahkam mahkamlash uchun maxsus ishlab chiqilgan zigzag shaklidagi prujinali sim. Ventilyatsiya tizimini boshqarish va plyonkani tutib turish uchun eng ishonchli yechim. Qayta ishlatish mumkin.',
    heroImage: '/images/zigzag_sim.jpg',
    unit: 'metr',
    unitLabel: 'Metr',
    pricePerUnit: 3500,
    specs: [
      { k: 'Material', v: 'Prujinali po\'lat' },
      { k: 'Diametr', v: '2–3 mm' },
      { k: 'Shakli', v: 'Zigzag' },
      { k: 'Rangi', v: 'Qora / Yashil' },
      { k: 'Qo\'llanish', v: 'Zajm profil ichiga' },
      { k: 'Xizmat muddati', v: '10+ yil' },
    ],
    features: [
      'Zajm profil bilan ideal moslik',
      'Plyonkani teshmasdan mahkamlash',
      'Shamolga chidamli tutish kuchi',
      'Qayta ishlatish mumkin',
    ],
    relatedSlug: 'zajm-profil',
    relatedTitle: 'Zajm profil',
    relatedDesc: 'Issiqxona uchun galvaniz profil',
  },
  'pastdan-tomchilatib-sugorish': {
    title: 'Pastdan tomchilatib sug\'orish texnologiyasi',
    subtitle: 'Yer ostidan (root-zone) tomchilatib sug\'orish: tejamkor va aniq sug\'orish yechimi',
    description:
      'Pastdan tomchilatib sug\'orish (yer ostidan) tizimi suvni to\'g\'ridan-to\'g\'ri ildiz zonasiga yetkazadi. Natijada bug\'lanish kamayadi, tuproq namligi barqaror bo\'ladi va o\'g\'itni (fertigatsiya) aniq berish osonlashadi. Quyidagi katalogda 2 ta asosiy mahsulot bor: tomchilatish shlanglari (sistema) va suvni tortib keluvchi qalin magistral shlang/quvurlar.',
    heroImage: '/images/hero_slider/agro.png',
    specs: [
      { k: 'Sug\'orish turi', v: 'Yer ostidan tomchilatib' },
      { k: 'Tejamkorlik', v: 'Bug\'lanish kamayadi' },
      { k: 'Nazorat', v: 'Doza aniq' },
      { k: 'Moslik', v: 'Issiqxona / ochiq dala' },
      { k: 'Xizmat', v: 'Uzoq muddat' },
      { k: 'Katalog', v: '2 ta mahsulot' },
    ],
    features: [
      'Suv sarfini kamaytiradi va namlikni bir tekis taqsimlaydi',
      'Begona o\'tlar kamayadi (yuzaki namlik kam)',
      'Fertigatsiya uchun qulay: o\'g\'itni aniq beradi',
      'Tizimni avtomatlashtirish oson (taymer/klapan)',
    ],
    catalog: [
      {
        id: 'sistema',
        title: 'Tomchilatib sug\'orish sistemasi (oddiy shlanglar)',
        subtitle: 'Ildiz zonasiga suvni tomchi-tomchi beruvchi shlanglar',
        description:
          'Tomchilatib sug\'orish shlanglari o\'simlik qatorlari bo\'ylab yotqiziladi va har bir nuqtadan dozali suv beradi. Yer ostida ishlatishda namlik barqaror bo\'lib, bug\'lanish ancha kamayadi.',
        heroImage: '/images/products/agro.png',
        unit: 'metr',
        unitLabel: 'Metr',
        pricePerUnit: 4500,
        specs: [
          { k: 'Material', v: 'PE / Tomchilatish lenta' },
          { k: 'Qo\'llanish', v: 'Qator bo\'ylab' },
          { k: 'O\'rnatish', v: 'Yer usti / yer osti' },
        ],
      },
      {
        id: 'magistral',
        title: 'Magistral shlang/quvur (qalin turbali)',
        subtitle: 'Suvni manbadan sistema tomon tortib keluvchi qalin liniya',
        description:
          'Qalin magistral shlang yoki quvur suvni asosiy manbadan tomchilatish tarmog\'iga yetkazadi. Bosim barqarorligi va uzoq xizmat uchun qalin devorli variant tavsiya qilinadi.',
        heroImage: '/images/products/build.png',
        unit: 'metr',
        unitLabel: 'Metr',
        pricePerUnit: 12000,
        specs: [
          { k: 'Material', v: 'PE (qalin devor)' },
          { k: 'Vazifa', v: 'Magistral liniya' },
          { k: 'Afzallik', v: 'Bosim barqaror' },
        ],
      },
    ],
  },
};

export default function AccessoryDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const product = accessoryData[slug];

  const [quantity, setQuantity] = useState(10);
  const [orderOpen, setOrderOpen] = useState(false);
  const [selectedCatalogId, setSelectedCatalogId] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setQuantity(10);
    setOrderOpen(false);
    setSuccess(false);
    setSubmitError('');
    setSelectedCatalogId(accessoryData[slug]?.catalog?.[0]?.id || '');
    setActiveImage(accessoryData[slug]?.heroImage || accessoryData[slug]?.catalog?.[0]?.heroImage || '');
  }, [slug]);

  if (!product) {
    return (
      <div style={{ paddingTop: 'calc(var(--header-height, 72px) + 80px)', minHeight: '60vh', textAlign: 'center' }}>
        <h2 style={{ color: '#334155' }}>Mahsulot topilmadi</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 20 }}>Bosh sahifaga</Link>
      </div>
    );
  }

  const isCatalogPage = Array.isArray(product.catalog) && product.catalog.length > 0;
  const orderProduct = isCatalogPage
    ? (product.catalog.find((p) => p.id === selectedCatalogId) || product.catalog[0])
    : product;

  const zigzag = accessoryData['zigzag-sim'];
  const galleryImages = isCatalogPage
    ? [product.heroImage, ...product.catalog.map((p) => p.heroImage)].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i)
    : [product.heroImage].filter(Boolean);

  const totalPrice = orderProduct.pricePerUnit * quantity;

  const handleOrder = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!address.trim() || !phone.trim()) {
      setSubmitError('Manzil va telefon raqamini kiriting');
      return;
    }
    setSubmitting(true);
    try {
      await api.createOrder({
        items: [{ name: orderProduct.title, quantity, unit: orderProduct.unit, price: orderProduct.pricePerUnit }],
        totalAmount: totalPrice,
        shippingAddress: address,
        phone,
        notes: `${orderProduct.title} - ${quantity} ${orderProduct.unitLabel}. ${notes}`,
      });
      setSuccess(true);
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setSubmitting(false);
    }
  };

  const related = product.relatedSlug ? accessoryData[product.relatedSlug] : null;

  return (
    <div className="fade-in">
      <style>{`
        .acc-hero {
          position: relative;
          height: 55vh;
          min-height: 380px;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
        }
        .acc-hero-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 6s ease;
        }
        .acc-hero:hover .acc-hero-bg { transform: scale(1.04); }
        .acc-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.85) 100%);
        }
        .acc-hero-content {
          position: relative;
          z-index: 2;
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
          padding: 0 24px 48px;
        }
        .acc-hero-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: rgba(255,255,255,0.7);
          font-weight: 600;
          font-size: 0.85rem;
          text-decoration: none;
          margin-bottom: 16px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          transition: all 0.2s;
        }
        .acc-hero-back:hover { background: rgba(255,255,255,0.18); color: #fff; }
        .acc-hero-badge {
          display: inline-block;
          padding: 5px 14px;
          background: rgba(0,166,81,0.2);
          color: #4ADE80;
          font-weight: 700;
          font-size: 0.72rem;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 12px;
          border: 1px solid rgba(74,222,128,0.2);
        }
        .acc-hero-title {
          font-size: clamp(2rem, 4.5vw, 3.2rem);
          font-weight: 900;
          color: #fff;
          margin: 0 0 8px;
          line-height: 1.1;
        }
        .acc-hero-sub {
          font-size: 1.1rem;
          color: rgba(226,232,240,0.8);
          margin: 0;
          max-width: 600px;
        }

        .acc-body {
          max-width: 1100px;
          margin: -40px auto 0;
          padding: 0 24px 60px;
          position: relative;
          z-index: 3;
        }
        .acc-main-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 32px;
        }
        @media (max-width: 768px) {
          .acc-main-grid { grid-template-columns: 1fr; }
        }
        .acc-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          overflow: hidden;
        }
        .acc-card-inner { padding: 28px; }

        .acc-desc {
          font-size: 0.95rem;
          color: #475569;
          line-height: 1.75;
          margin-bottom: 24px;
        }
        .acc-specs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          margin-bottom: 24px;
        }
        @media (max-width: 500px) {
          .acc-specs-grid { grid-template-columns: 1fr 1fr; }
        }
        .acc-spec-item {
          padding: 14px;
          background: #F8FAFC;
          border-radius: 14px;
          border: 1px solid #F1F5F9;
          text-align: center;
        }
        .acc-spec-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 4px;
        }
        .acc-spec-value {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0F172A;
        }
        .acc-features-list { margin-bottom: 20px; }
        .acc-feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 0;
          font-size: 0.9rem;
          color: #334155;
          border-bottom: 1px solid #F1F5F9;
        }
        .acc-feature-item:last-child { border-bottom: none; }
        .acc-check-icon {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          background: #DCFCE7;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .acc-order-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          padding: 28px;
          position: sticky;
          top: calc(var(--header-height, 72px) + 20px);
        }
        .acc-order-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 20px;
        }
        .acc-price-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px;
          background: linear-gradient(135deg, #F0FDF4, #ECFDF5);
          border-radius: 14px;
          border: 1px solid #BBF7D0;
          margin-bottom: 20px;
        }
        .acc-price-label {
          font-size: 0.8rem;
          color: #64748B;
          font-weight: 600;
        }
        .acc-price-amount {
          font-size: 1.6rem;
          font-weight: 900;
          color: #15803D;
        }
        .acc-qty-section { margin-bottom: 20px; }
        .acc-qty-label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #475569;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .acc-qty-row {
          display: flex;
          align-items: center;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          overflow: hidden;
        }
        .acc-qty-btn {
          width: 48px;
          height: 48px;
          border: none;
          background: #F8FAFC;
          color: #334155;
          font-size: 1.3rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s;
        }
        .acc-qty-btn:hover { background: #E2E8F0; }
        .acc-qty-input {
          flex: 1;
          height: 48px;
          border: none;
          border-left: 1px solid #E2E8F0;
          border-right: 1px solid #E2E8F0;
          text-align: center;
          font-size: 1.05rem;
          font-weight: 700;
          color: #0F172A;
          outline: none;
          background: #fff;
        }
        .acc-total-box {
          padding: 14px 16px;
          background: #FFFBEB;
          border-radius: 12px;
          border: 1px solid #FDE68A;
          margin-bottom: 20px;
          text-align: center;
          font-size: 0.92rem;
          color: #92400E;
          font-weight: 700;
        }
        .acc-total-box strong {
          font-size: 1.3rem;
          color: #B45309;
        }
        .acc-buy-btn {
          width: 100%;
          padding: 16px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #00A651, #16A34A);
          color: #fff;
          font-size: 1.05rem;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(0,166,81,0.3);
        }
        .acc-buy-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(0,166,81,0.4); }
        .acc-buy-btn:active { transform: scale(0.99); }

        .acc-related {
          margin-top: 40px;
          padding: 24px;
          background: #F8FAFC;
          border-radius: 18px;
          border: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          gap: 20px;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
          text-decoration: none;
        }
        .acc-related:hover { border-color: #00A651; box-shadow: 0 4px 16px rgba(0,166,81,0.1); }
        .acc-related-img {
          width: 80px;
          height: 80px;
          border-radius: 14px;
          object-fit: cover;
          flex-shrink: 0;
        }
        .acc-related-info { flex: 1; }
        .acc-related-title { font-weight: 800; color: #0F172A; font-size: 1rem; margin: 0 0 4px; }
        .acc-related-desc { font-size: 0.85rem; color: #64748B; margin: 0; }

        .acc-catalog {
          margin-top: 30px;
        }
        .acc-catalog-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }
        .acc-catalog-title {
          margin: 0;
          font-size: 1.35rem;
          font-weight: 900;
          color: #0F172A;
        }
        .acc-catalog-sub {
          margin: 0;
          font-size: 0.92rem;
          color: #64748B;
          line-height: 1.5;
        }
        .acc-catalog-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        @media (max-width: 900px) {
          .acc-catalog-grid { grid-template-columns: 1fr; }
        }
        .acc-catalog-card {
          background: #fff;
          border-radius: 18px;
          border: 1px solid #E2E8F0;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
          cursor: pointer;
          transition: transform 0.15s, border-color 0.2s, box-shadow 0.2s;
        }
        .acc-catalog-card:hover {
          transform: translateY(-2px);
          border-color: rgba(0,166,81,0.55);
          box-shadow: 0 12px 30px rgba(0,166,81,0.12);
        }
        .acc-catalog-card.is-active {
          border-color: #00A651;
          box-shadow: 0 12px 34px rgba(0,166,81,0.18);
        }
        .acc-catalog-media {
          height: 170px;
          background-size: cover;
          background-position: center;
        }
        .acc-catalog-body { padding: 18px; }
        .acc-catalog-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }
        .acc-catalog-name {
          margin: 0;
          font-weight: 900;
          color: #0F172A;
          font-size: 1.05rem;
          line-height: 1.2;
        }
        .acc-catalog-price {
          font-weight: 900;
          color: #15803D;
          font-size: 0.95rem;
          white-space: nowrap;
        }
        .acc-catalog-subtitle {
          margin: 8px 0 12px;
          color: #64748B;
          font-size: 0.9rem;
          line-height: 1.55;
        }
        .acc-catalog-specs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 14px;
        }
        .acc-catalog-chip {
          font-size: 0.75rem;
          font-weight: 700;
          color: #334155;
          background: #F1F5F9;
          border: 1px solid #E2E8F0;
          padding: 6px 10px;
          border-radius: 999px;
        }
        .acc-catalog-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .acc-catalog-selected {
          font-size: 0.82rem;
          color: #00A651;
          font-weight: 900;
        }
        .acc-catalog-buy {
          padding: 10px 14px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #00A651, #16A34A);
          color: #fff;
          font-weight: 900;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(0,166,81,0.25);
        }
        .acc-catalog-buy:hover { box-shadow: 0 6px 18px rgba(0,166,81,0.35); }
        .acc-catalog-buy:active { transform: scale(0.99); }

        .acc-modal-bg {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 50;
          display: flex; align-items: center; justify-content: center; padding: 24px;
        }
        .acc-modal {
          width: min(540px, 100%); background: #fff; border-radius: 20px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.2); overflow: hidden;
        }
        .acc-modal-head {
          padding: 20px 24px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0;
          display: flex; justify-content: space-between; align-items: center;
        }
        .acc-modal-body { padding: 24px; }
        .acc-field { margin-bottom: 16px; }
        .acc-field label {
          display: block; font-size: 0.78rem; font-weight: 700; color: #64748B;
          text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px;
        }
        .acc-field input, .acc-field textarea {
          width: 100%; padding: 12px 14px; border: 1px solid #E2E8F0; border-radius: 12px;
          font-size: 0.95rem; color: #0F172A; outline: none; transition: border-color 0.2s;
        }
        .acc-field input:focus, .acc-field textarea:focus { border-color: #00A651; }
        .acc-field textarea { min-height: 80px; resize: vertical; }
        .acc-summary {
          padding: 14px 16px; background: #F0FDF4; border-radius: 12px;
          border: 1px solid #BBF7D0; margin-bottom: 20px; font-size: 0.9rem; color: #334155;
        }
        .acc-summary strong { color: #15803D; }
        .acc-error { color: #DC2626; font-weight: 700; margin-bottom: 12px; font-size: 0.9rem; }

        /* Product-like layout (for sug'orish sistemasi) */
        .acc-product-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: calc(var(--header-height, 72px) + 26px) 24px 70px;
        }
        .acc-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #64748B;
          margin-bottom: 16px;
        }
        .acc-crumb {
          color: #64748B;
          text-decoration: none;
          font-weight: 700;
        }
        .acc-crumb:hover { color: #0F172A; }
        .acc-crumb-sep { opacity: 0.6; }
        .acc-product-head { margin-bottom: 18px; }
        .acc-product-title {
          margin: 0 0 6px;
          color: #0F172A;
          font-weight: 950;
          font-size: clamp(1.8rem, 3.2vw, 2.6rem);
          line-height: 1.15;
        }
        .acc-product-sub {
          margin: 0 0 12px;
          color: #64748B;
          font-size: 1rem;
          line-height: 1.55;
          max-width: 860px;
        }
        .acc-product-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .acc-product-chip {
          padding: 10px 14px;
          border-radius: 999px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          color: #0F172A;
          font-weight: 900;
          font-size: 0.85rem;
        }
        .acc-product-chip span { color: #64748B; font-weight: 800; margin-right: 6px; }
        .acc-main-grid--product {
          grid-template-columns: 1.6fr 1fr;
          align-items: start;
        }
        .acc-gallery-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
          overflow: hidden;
        }
        .acc-gallery {
          display: grid;
          grid-template-columns: 92px 1fr;
          gap: 14px;
          padding: 14px;
        }
        @media (max-width: 900px) {
          .acc-main-grid--product { grid-template-columns: 1fr; }
          .acc-gallery { grid-template-columns: 1fr; }
        }
        .acc-thumbs {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        @media (max-width: 900px) {
          .acc-thumbs { flex-direction: row; overflow: auto; padding-bottom: 4px; }
        }
        .acc-thumb {
          width: 92px;
          height: 92px;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          background: #fff;
          padding: 0;
          overflow: hidden;
          cursor: pointer;
          flex: 0 0 auto;
          transition: transform 0.12s, border-color 0.2s, box-shadow 0.2s;
        }
        .acc-thumb:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,0,0,0.08); }
        .acc-thumb.is-active { border-color: #00A651; box-shadow: 0 10px 22px rgba(0,166,81,0.18); }
        .acc-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .acc-mainimg-wrap {
          border-radius: 18px;
          overflow: hidden;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (max-width: 900px) {
          .acc-mainimg-wrap { min-height: 320px; }
        }
        .acc-mainimg { width: 100%; height: 100%; object-fit: cover; display: block; }

        .acc-section {
          margin-top: 26px;
          background: #fff;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
          padding: 22px;
        }
        .acc-section-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
        .acc-section-h { margin: 0; font-size: 1.35rem; font-weight: 950; color: #0F172A; }
        .acc-section-p { margin: 0; color: #64748B; font-size: 0.92rem; }
        .acc-attach-card {
          margin-top: 12px;
          padding: 16px;
          background: #F8FAFC;
          border-radius: 18px;
          border: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.12s;
          text-decoration: none;
        }
        .acc-attach-card:hover { border-color: #00A651; box-shadow: 0 10px 24px rgba(0,166,81,0.12); transform: translateY(-1px); }
        .acc-attach-img { width: 90px; height: 90px; border-radius: 16px; object-fit: cover; flex-shrink: 0; }
        .acc-attach-title { margin: 0 0 4px; color: #0F172A; font-weight: 950; }
        .acc-attach-desc { margin: 0; color: #64748B; font-size: 0.92rem; line-height: 1.5; }

      `}</style>

      {isCatalogPage ? (
        <div className="acc-product-wrap">
          <div className="acc-breadcrumbs">
            <Link to="/" className="acc-crumb">Bosh sahifa</Link>
            <span className="acc-crumb-sep">›</span>
            <span>Sug'orish</span>
          </div>

          <div className="acc-product-head">
            <h1 className="acc-product-title">{product.title}</h1>
            <p className="acc-product-sub">{product.subtitle}</p>
            <div className="acc-product-chips">
              {product.specs.slice(0, 3).map((s) => (
                <div key={s.k} className="acc-product-chip"><span>{s.k}:</span>{s.v}</div>
              ))}
            </div>
          </div>

          <div className="acc-main-grid acc-main-grid--product">
            <div>
              <div className="acc-gallery-card">
                <div className="acc-gallery">
                  <div className="acc-thumbs">
                    {galleryImages.map((src, idx) => (
                      <button
                        key={`${src}-${idx}`}
                        type="button"
                        className={`acc-thumb ${src === (activeImage || galleryImages[0]) ? 'is-active' : ''}`}
                        onClick={() => setActiveImage(src)}
                      >
                        <img src={src} alt={`${product.title} ${idx + 1}`} />
                      </button>
                    ))}
                  </div>

                  <div className="acc-mainimg-wrap">
                    <img
                      className="acc-mainimg"
                      src={activeImage || galleryImages[0] || product.heroImage}
                      alt={product.title}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              <div className="acc-card" style={{ marginTop: 18 }}>
                <div className="acc-card-inner">
                  <p className="acc-desc" style={{ marginBottom: 18 }}>{product.description}</p>
                  <div className="acc-features-list" style={{ marginBottom: 0 }}>
                    {product.features.map((f) => (
                      <div key={f} className="acc-feature-item">
                        <div className="acc-check-icon"><Check size={13} color="#16A34A" /></div>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="acc-order-card">
                <h3 className="acc-order-title">Buyurtma berish</h3>

                <div className="acc-price-box">
                  <div className="acc-price-label">Narx (1 {orderProduct.unitLabel.toLowerCase()})</div>
                  <div className="acc-price-amount">{orderProduct.pricePerUnit.toLocaleString()} so'm</div>
                </div>

                <div className="acc-qty-section">
                  <div className="acc-qty-label"><Ruler size={14} /> Miqdor ({orderProduct.unitLabel}):</div>
                  <div className="acc-qty-row">
                    <button className="acc-qty-btn" type="button" onClick={() => setQuantity((q) => Math.max(1, q - 5))}>-5</button>
                    <button className="acc-qty-btn" type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                    <input
                      className="acc-qty-input"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                    />
                    <button className="acc-qty-btn" type="button" onClick={() => setQuantity((q) => q + 1)}>+</button>
                    <button className="acc-qty-btn" type="button" onClick={() => setQuantity((q) => q + 5)}>+5</button>
                  </div>
                </div>

                <div className="acc-total-box">
                  Jami: <strong>{totalPrice.toLocaleString()} so'm</strong>
                  <br /><span style={{ fontSize: '0.82rem', color: '#A16207' }}>{quantity} {orderProduct.unitLabel.toLowerCase()} x {orderProduct.pricePerUnit.toLocaleString()} so'm</span>
                </div>

                <button className="acc-buy-btn" type="button" onClick={() => {
                  if (!user) { navigate('/login'); return; }
                  setOrderOpen(true);
                }}>
                  <ShoppingCart size={20} /> Sotib olish
                </button>
              </div>
            </div>
          </div>

          <div className="acc-section">
            <div className="acc-section-head">
              <h2 className="acc-section-h">Zigzag sim</h2>
              <p className="acc-section-p">Mahkamlash uchun qo'shimcha mahsulot</p>
            </div>
            {zigzag && (
              <Link to="/accessory/zigzag-sim" className="acc-attach-card">
                <img src={zigzag.heroImage} alt={zigzag.title} className="acc-attach-img" />
                <div style={{ flex: 1 }}>
                  <h3 className="acc-attach-title">{zigzag.title}</h3>
                  <p className="acc-attach-desc">{zigzag.subtitle}</p>
                </div>
                <ChevronRight size={22} color="#94A3B8" />
              </Link>
            )}
          </div>

          <div className="acc-section">
            <div className="acc-catalog-head" style={{ marginBottom: 16 }}>
              <h2 className="acc-catalog-title">Katalog</h2>
              <p className="acc-catalog-sub">2 ta mahsulot: sistema va qalin magistral shlang/quvurlar</p>
            </div>

            <div className="acc-catalog-grid">
              {product.catalog.map((item) => {
                const isActive = item.id === orderProduct.id;
                return (
                  <div
                    key={item.id}
                    className={`acc-catalog-card ${isActive ? 'is-active' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => { setSelectedCatalogId(item.id); setActiveImage(item.heroImage); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setSelectedCatalogId(item.id); setActiveImage(item.heroImage); } }}
                  >
                    <div className="acc-catalog-media" style={{ backgroundImage: `url(${item.heroImage})` }} />
                    <div className="acc-catalog-body">
                      <div className="acc-catalog-row">
                        <h3 className="acc-catalog-name">{item.title}</h3>
                        <div className="acc-catalog-price">{item.pricePerUnit.toLocaleString()} so'm/{item.unitLabel.toLowerCase()}</div>
                      </div>
                      <p className="acc-catalog-subtitle">{item.subtitle}</p>

                      <div className="acc-catalog-specs">
                        {item.specs.slice(0, 3).map((s) => (
                          <span key={s.k} className="acc-catalog-chip">{s.k}: {s.v}</span>
                        ))}
                      </div>

                      <div className="acc-catalog-actions">
                        <div className="acc-catalog-selected">{isActive ? 'Tanlangan' : 'Tanlash'}</div>
                        <button
                          type="button"
                          className="acc-catalog-buy"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCatalogId(item.id);
                            setActiveImage(item.heroImage);
                            if (!user) { navigate('/login'); return; }
                            setOrderOpen(true);
                          }}
                        >
                          <ShoppingCart size={18} /> Sotib olish
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* HERO BANNER */}
          <div className="acc-hero">
            <div className="acc-hero-bg" style={{ backgroundImage: `url(${product.heroImage})` }} />
            <div className="acc-hero-overlay" />
            <div className="acc-hero-content">
              <Link to="/" className="acc-hero-back"><ArrowLeft size={14} /> Bosh sahifa</Link>
              <div className="acc-hero-badge">Issiqxona aksessuari</div>
              <h1 className="acc-hero-title">{product.title}</h1>
              <p className="acc-hero-sub">{product.subtitle}</p>
            </div>
          </div>

          {/* BODY */}
          <div className="acc-body">
            <div className="acc-main-grid">
              {/* LEFT — Info */}
              <div className="acc-card">
                <div className="acc-card-inner">
                  <p className="acc-desc">{product.description}</p>

                  <div className="acc-specs-grid">
                    {product.specs.map((s) => (
                      <div key={s.k} className="acc-spec-item">
                        <div className="acc-spec-label">{s.k}</div>
                        <div className="acc-spec-value">{s.v}</div>
                      </div>
                    ))}
                  </div>

                  <div className="acc-features-list">
                    {product.features.map((f) => (
                      <div key={f} className="acc-feature-item">
                        <div className="acc-check-icon"><Check size={13} color="#16A34A" /></div>
                        {f}
                      </div>
                    ))}
                  </div>

                  {/* Related product */}
                  {related && (
                    <Link to={`/accessory/${product.relatedSlug}`} className="acc-related">
                      <img src={related.heroImage} alt={related.title} className="acc-related-img" />
                      <div className="acc-related-info">
                        <h4 className="acc-related-title">{related.title}</h4>
                        <p className="acc-related-desc">{product.relatedDesc}</p>
                      </div>
                      <ChevronRight size={20} color="#94A3B8" />
                    </Link>
                  )}
                </div>
              </div>

              {/* RIGHT — Order */}
              <div>
                <div className="acc-order-card">
                  <h3 className="acc-order-title">Buyurtma berish</h3>

                  <div className="acc-price-box">
                    <div className="acc-price-label">Narx (1 {orderProduct.unitLabel.toLowerCase()})</div>
                    <div className="acc-price-amount">{orderProduct.pricePerUnit.toLocaleString()} so'm</div>
                  </div>

                  <div className="acc-qty-section">
                    <div className="acc-qty-label"><Ruler size={14} /> Miqdor ({orderProduct.unitLabel}):</div>
                    <div className="acc-qty-row">
                      <button className="acc-qty-btn" type="button" onClick={() => setQuantity((q) => Math.max(1, q - 5))}>-5</button>
                      <button className="acc-qty-btn" type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                      <input
                        className="acc-qty-input"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                      />
                      <button className="acc-qty-btn" type="button" onClick={() => setQuantity((q) => q + 1)}>+</button>
                      <button className="acc-qty-btn" type="button" onClick={() => setQuantity((q) => q + 5)}>+5</button>
                    </div>
                  </div>

                  <div className="acc-total-box">
                    Jami: <strong>{totalPrice.toLocaleString()} so'm</strong>
                    <br /><span style={{ fontSize: '0.82rem', color: '#A16207' }}>{quantity} {orderProduct.unitLabel.toLowerCase()} x {orderProduct.pricePerUnit.toLocaleString()} so'm</span>
                  </div>

                  <button className="acc-buy-btn" type="button" onClick={() => {
                    if (!user) { navigate('/login'); return; }
                    setOrderOpen(true);
                  }}>
                    <ShoppingCart size={20} /> Sotib olish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ORDER MODAL */}
      {orderOpen && (
        <div className="acc-modal-bg" onClick={(e) => { if (e.target === e.currentTarget) setOrderOpen(false); }}>
          <div className="acc-modal">
            <div className="acc-modal-head">
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>Buyurtma berish</h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748B' }}>{orderProduct.title}</p>
              </div>
              <button onClick={() => { setOrderOpen(false); setSuccess(false); setSubmitError(''); }}
                style={{ width: 36, height: 36, borderRadius: 999, border: '1px solid #E2E8F0', background: '#F8FAFC', cursor: 'pointer', fontSize: '1rem', color: '#64748B' }}>x</button>
            </div>
            <div className="acc-modal-body">
              {success ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 999, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Check size={28} color="#16A34A" />
                  </div>
                  <h3 style={{ color: '#15803D', marginBottom: 8 }}>Buyurtma qabul qilindi!</h3>
                  <p style={{ color: '#64748B', marginBottom: 20 }}>Profil bo'limida buyurtma holatini kuzatishingiz mumkin.</p>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <button onClick={() => { setOrderOpen(false); setSuccess(false); }} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#F8FAFC', cursor: 'pointer', fontWeight: 600 }}>Yopish</button>
                    <Link to="/profile" style={{ padding: '10px 20px', borderRadius: 10, background: '#00A651', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Profilga o'tish</Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleOrder}>
                  <div className="acc-summary">
                    <strong>{orderProduct.title}</strong> - {quantity} {orderProduct.unitLabel.toLowerCase()}<br />
                    Narx: <strong>{totalPrice.toLocaleString()} so'm</strong>
                  </div>
                  <div className="acc-field">
                    <label>Yetkazish manzili</label>
                    <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Viloyat, tuman, ko'cha..." />
                  </div>
                  <div className="acc-field">
                    <label>Telefon raqam</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 XX XXX XX XX" />
                  </div>
                  <div className="acc-field">
                    <label>Qo'shimcha izoh</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="O'lcham, miqdor yoki boshqa..." />
                  </div>
                  {submitError && <div className="acc-error">{submitError}</div>}
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                    <button type="button" onClick={() => setOrderOpen(false)} style={{ padding: '12px 20px', borderRadius: 12, border: '1px solid #E2E8F0', background: '#F8FAFC', cursor: 'pointer', fontWeight: 600 }}>Bekor</button>
                    <button type="submit" disabled={submitting} className="acc-buy-btn" style={{ width: 'auto', padding: '12px 28px' }}>
                      {submitting ? 'Yuborilmoqda...' : 'Buyurtma berish'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
