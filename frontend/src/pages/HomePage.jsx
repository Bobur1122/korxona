import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { api } from '../api';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

// Slide config (without text - text comes from translations)
const heroSlideConfig = [
  { id: 1, image: '/images/hero_slider/agro.png', titleKey: 'heroSlide1Title', subtitleKey: 'heroSlide1Subtitle', bgColor: '#064e3b', reverse: false, durationMs: 4000 },
  { id: 2, image: '/images/hero_slider/shrink.png', titleKey: 'heroSlide2Title', subtitleKey: 'heroSlide2Subtitle', bgColor: '#1e3a8a', reverse: true, durationMs: 4000 },
  { id: 3, image: '/images/hero_slider/build.png', titleKey: 'heroSlide3Title', subtitleKey: 'heroSlide3Subtitle', bgColor: '#171717', reverse: false, durationMs: 4000 },
  { id: 4, image: '/images/hero_slider/food.png', titleKey: 'heroSlide4Title', subtitleKey: 'heroSlide4Subtitle', bgColor: '#78350f', reverse: true, durationMs: 5000 },
  { id: 5, image: '/images/hero_slider/logic.png', titleKey: 'heroSlide5Title', subtitleKey: 'heroSlide5Subtitle', bgColor: '#312e81', reverse: false, durationMs: 4000 },
];

const sunSlideConfig = [
  {
    id: 'light-30',
    percent: 30,
    leftTitle: 'Parametrlar',
    left: [
      { k: "Plyonka turi", v: "Soyalash (ekonom)" },
      { k: "Qalinlik", v: "60–80 mikron" },
      { k: "Kenglik", v: "4–6 m" },
    ],
    rightTitle: 'Tavsif',
    right: [
      { k: "Qo'llanish", v: 'Yengil issiqxonalar' },
      { k: "Afzallik", v: "Haroratni pasaytiradi" },
      { k: "Eslatma", v: "Yorug'lik o‘tishi past" },
    ],
  },
  {
    id: 'light-45',
    percent: 45,
    leftTitle: 'Parametrlar',
    left: [
      { k: "Plyonka turi", v: "Soyalash (standart)" },
      { k: "Qalinlik", v: "80–100 mikron" },
      { k: "Kenglik", v: "6–8 m" },
    ],
    rightTitle: 'Tavsif',
    right: [
      { k: "Qo'llanish", v: "Ko'chat va issiq fasl" },
      { k: "Afzallik", v: "Iqlimni barqaror qiladi" },
      { k: "Eslatma", v: "Yorug'lik o‘tishi o‘rtacha" },
    ],
  },
  {
    id: 'light-65',
    percent: 65,
    leftTitle: 'Parametrlar',
    left: [
      { k: "Plyonka turi", v: "Issiqxona (UV)" },
      { k: "Qalinlik", v: "100–120 mikron" },
      { k: "Kenglik", v: "8–10 m" },
    ],
    rightTitle: 'Tavsif',
    right: [
      { k: "Qo'llanish", v: '4 fasl' },
      { k: "Afzallik", v: "UV himoya" },
      { k: "Eslatma", v: "Yorug'lik o‘tishi yaxshi" },
    ],
  },
  {
    id: 'light-75',
    percent: 75,
    leftTitle: 'Parametrlar',
    left: [
      { k: "Plyonka turi", v: "Issiqxona (UV+IR)" },
      { k: "Qalinlik", v: "120–150 mikron" },
      { k: "Kenglik", v: "10–12 m" },
    ],
    rightTitle: 'Tavsif',
    right: [
      { k: "Qo'llanish", v: "Katta issiqxonalar" },
      { k: "Afzallik", v: 'Issiqlikni ushlaydi' },
      { k: "Eslatma", v: "Hosildorlikni oshiradi" },
    ],
  },
  {
    id: 'light-88',
    percent: 88,
    leftTitle: 'Parametrlar',
    left: [
      { k: "Plyonka turi", v: "Premium (UV+IR+EVA)" },
      { k: "Qalinlik", v: "150–180 mikron" },
      { k: "Kenglik", v: "12 m gacha" },
    ],
    rightTitle: 'Tavsif',
    right: [
      { k: "Qo'llanish", v: 'Intensiv agro' },
      { k: "Afzallik", v: "Barqaror mikroiqlim" },
      { k: "Eslatma", v: "Yorug'lik o‘tishi yuqori" },
    ],
  },
  {
    id: 'light-92',
    percent: 92,
    leftTitle: 'Parametrlar',
    left: [
      { k: "Plyonka turi", v: "Ultra premium" },
      { k: "Qalinlik", v: "180–200 mikron" },
      { k: "Kenglik", v: "12 m gacha" },
    ],
    rightTitle: 'Tavsif',
    right: [
      { k: "Qo'llanish", v: "Eksport darajasi" },
      { k: "Afzallik", v: "Maksimum yorug'lik" },
      { k: "Eslatma", v: "Qoplama sifati yuqori" },
    ],
  },
];

const irrigationShowcaseConfig = [
  {
    id: 'pastdan-tomchilatib',
    title: 'Pastdan tomchilatib sug\'orish',
    subtitle: 'Yer ostidan tomchilatib sug\'orish texnologiyasi: suvni tejaydi, tuproq namligini barqaror ushlab turadi va ildiz zonasiga aniq yetkazib beradi. Katalogda 2 ta mahsulot: sistema va qalin magistral shlang/quvurlar.',
    image: '/images/hero_slider/agro.png',
    bgColor: '#083344',
    reverse: false,
    slug: 'pastdan-tomchilatib-sugorish',
    specs: [
      { k: 'Tejamkorlik', v: 'Suv sarfi kamayadi' },
      { k: 'Nazorat', v: 'Aniq dozalanadi' },
      { k: 'Moslik', v: 'Turli ekinlar' },
    ],
  },
];

const accessoryShowcaseConfig = [
  {
    id: 'zajm-profil',
    title: 'Zajm profil',
    subtitle: 'Issiqxona konstruksiyalarini mustahkam birlashtirish uchun maxsus ishlab chiqilgan galvanizlangan po\'lat zajm profil. Yuqori korroziyaga chidamlilik va uzoq xizmat muddati.',
    image: '/images/zajm_profil.jpg',
    bgColor: '#0B1A2E',
    reverse: false,
    slug: 'zajm-profil',
    specs: [
      { k: 'Material', v: 'Galvaniz po\'lat' },
      { k: 'Uzunlik', v: '2-6 m' },
      { k: 'Qalinlik', v: '0.5-1.5 mm' },
    ],
  },
  {
    id: 'zigzag-sim',
    title: 'Zigzag sim',
    subtitle: 'Issiqxona ventilyatsiya tizimi uchun yuqori sifatli zigzag sim. Plyonkani profilga mustahkam mahkamlash va shamollatish tizimini boshqarish imkoniyati.',
    image: '/images/zigzag_sim.jpg',
    bgColor: '#112233',
    reverse: true,
    slug: 'zigzag-sim',
    specs: [
      { k: 'Material', v: 'Prujinali po\'lat' },
      { k: 'Diametr', v: '2-3 mm' },
      { k: 'Xizmat muddati', v: '10+ yil' },
    ],
  },
];

const irrigationCatalogConfig = [
  {
    id: 'sistema',
    title: "Tomchilatib sug'orish sistemasi (oddiy shlanglar)",
    subtitle: "Ildiz zonasiga suvni tomchi-tomchi beruvchi shlanglar",
    image: '/images/products/agro.png',
    pricePerUnit: 4500,
    unitLabel: 'metr',
    chips: [
      "Material: PE / Tomchilatish lenta",
      "Qo'llanish: Qator bo'ylab",
      "O'rnatish: Yer usti / yer osti",
    ],
    slug: 'pastdan-tomchilatib-sugorish',
  },
  {
    id: 'magistral',
    title: 'Magistral shlang/quvur (qalin turbali)',
    subtitle: 'Suvni manbadan sistema tomon tortib keluvchi qalin liniya',
    image: '/images/products/build.png',
    pricePerUnit: 12000,
    unitLabel: 'metr',
    chips: [
      'Material: PE (qalin devor)',
      'Vazifa: Magistral liniya',
      'Afzallik: Bosim barqaror',
    ],
    slug: 'pastdan-tomchilatib-sugorish',
  },
];


export default function HomePage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [currentHeroBlock, setCurrentHeroBlock] = useState(0);
  const sunSlidesLen = sunSlideConfig.length;
  // Looping carousel index: 0 = clone(last), 1..N = real slides, N+1 = clone(first)
  const [sunVisualIndex, setSunVisualIndex] = useState(sunSlidesLen ? 1 : 0);
  const [sunTransitionEnabled, setSunTransitionEnabled] = useState(true);
  const [irrigationSlideIndex, setIrrigationSlideIndex] = useState(0);
  const [accessorySlideIndex, setAccessorySlideIndex] = useState(0);
  const [buyOpen, setBuyOpen] = useState(false);
  const [buyProducts, setBuyProducts] = useState([]);
  const [buyProductsLoading, setBuyProductsLoading] = useState(false);
  const [buyProductsError, setBuyProductsError] = useState('');
  const [buyProductId, setBuyProductId] = useState('');
  const [buyQty, setBuyQty] = useState(1);
  const [buyAddress, setBuyAddress] = useState('');
  const [buyPhone, setBuyPhone] = useState('');
  const [buyNotes, setBuyNotes] = useState('');
  const [buySubmitting, setBuySubmitting] = useState(false);
  const [buySubmitError, setBuySubmitError] = useState('');
  const [buySuccess, setBuySuccess] = useState(false);
  const heroSlides = heroSlideConfig.map((slide) => ({
    ...slide,
    title: t(slide.titleKey),
    subtitle: t(slide.subtitleKey),
  }));
  const safeSunIndex = sunSlidesLen
    ? ((((sunVisualIndex - 1) % sunSlidesLen) + sunSlidesLen) % sunSlidesLen)
    : 0;
  const currentSun = sunSlideConfig[safeSunIndex] || sunSlideConfig[0];
  const sunSlidesLoop = sunSlidesLen
    ? [sunSlideConfig[sunSlidesLen - 1], ...sunSlideConfig, sunSlideConfig[0]]
    : [];

  useEffect(() => {
    if (sunTransitionEnabled) return;
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setSunTransitionEnabled(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [sunTransitionEnabled]);

  const handleSunTransitionEnd = () => {
    if (!sunSlidesLen) return;
    if (sunVisualIndex === 0) {
      setSunTransitionEnabled(false);
      setSunVisualIndex(sunSlidesLen);
      return;
    }
    if (sunVisualIndex === sunSlidesLen + 1) {
      setSunTransitionEnabled(false);
      setSunVisualIndex(1);
    }
  };

  useEffect(() => {
    if (!buyOpen) return;
    if (buyProductsLoading) return;
    if (buyProducts.length) return;

    setBuyProductsLoading(true);
    setBuyProductsError('');
    api.getProducts(`category=${encodeURIComponent('Issiqxona plyonkasi')}&limit=50`)
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setBuyProducts(list);
        if (!buyProductId && list[0]?._id) setBuyProductId(list[0]._id);
      })
      .catch((err) => setBuyProductsError(err.message))
      .finally(() => setBuyProductsLoading(false));
  }, [buyOpen, buyProducts.length, buyProductsLoading, buyProductId]);

  const openBuyModal = () => {
    setBuySuccess(false);
    setBuySubmitError('');
    setBuyOpen(true);
  };

  const closeBuyModal = () => {
    setBuyOpen(false);
    setBuySubmitError('');
  };

  const handleBuySubmit = async (e) => {
    e.preventDefault();
    setBuySubmitError('');

    if (!user) {
      setBuyOpen(false);
      navigate('/login');
      return;
    }
    if (!buyProductId) {
      setBuySubmitError('Mahsulot tanlang');
      return;
    }
    const qty = Number(buyQty);
    if (!qty || qty < 1) {
      setBuySubmitError('Miqdor kamida 1 bo‘lishi kerak');
      return;
    }
    if (!buyAddress.trim() || !buyPhone.trim()) {
      setBuySubmitError('Manzil va telefon kiritilishi shart');
      return;
    }

    setBuySubmitting(true);
    try {
      const percentLine = currentSun?.percent ? `Yorug'lik: ${currentSun.percent}%` : '';
      const joinedNotes = [percentLine, buyNotes.trim()].filter(Boolean).join(' | ');
      await api.createOrder({
        items: [{ product: buyProductId, quantity: qty }],
        shippingAddress: buyAddress.trim(),
        phone: buyPhone.trim(),
        notes: joinedNotes || undefined,
      });
      setBuySuccess(true);
    } catch (err) {
      setBuySubmitError(err.message);
    } finally {
      setBuySubmitting(false);
    }
  };

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
        .hero-track {
           display: flex;
           height: 100%;
           width: 100%;
           will-change: transform;
           transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .hero-slide {
           flex: 0 0 100%;
           height: 100%;
           position: relative;
        }
        .hero-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 5;
          width: 48px;
          height: 48px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.24);
          color: #fff;
          backdrop-filter: blur(8px);
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .hero-nav:hover {
          background: rgba(255,255,255,0.18);
          transform: translateY(-50%) scale(1.05);
        }
        .hero-nav:active {
          transform: translateY(-50%) scale(0.98);
        }
        .hero-nav--left { left: 18px; }
        .hero-nav--right { right: 18px; }
        @media (max-width: 900px) {
           .split-slide { flex-direction: column-reverse !important; justify-content: flex-end; }
           .split-text { flex: 0 0 55%; padding: 40px 20px; align-items: flex-start; }
           .split-image { flex: 0 0 45%; }
           .hero-nav {
              width: 44px;
              height: 44px;
              top: auto;
              bottom: 86px;
              transform: none;
           }
           .hero-nav:hover { transform: none; }
           .hero-nav:active { transform: scale(0.98); }
        }

        .sun-carousel-section {
          position: relative;
          overflow: hidden;
          background: linear-gradient(180deg, #070B14 0%, #0B1220 100%);
          border-top: 1px solid rgba(255,255,255,0.08);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .sun-track-wrap {
          overflow: hidden;
        }
        .sun-main-track {
          display: flex;
          width: 100%;
          will-change: transform;
          transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .sun-no-anim { transition: none !important; }
        .sun-full-slide {
          flex: 0 0 100%;
          display: grid;
          grid-template-columns: 1fr minmax(200px, 420px) 1fr;
          gap: 32px;
          align-items: center;
          padding: 60px 24px;
          min-height: 520px;
          box-sizing: border-box;
        }
        @media (max-width: 980px) {
          .sun-full-slide {
            grid-template-columns: 1fr;
            gap: 24px;
            padding: 40px 16px;
            min-height: auto;
          }
        }
        .sun-side-card {
          padding: 20px 24px;
          background: rgba(7,11,20,0.55);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .sun-side-title {
          margin: 0 0 14px;
          font-size: 0.78rem;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(226,232,240,0.86);
        }
        .sun-kv {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 16px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.10);
          font-size: 0.92rem;
        }
        .sun-kv:last-child { border-bottom: none; }
        .sun-kv-k { color: rgba(226,232,240,0.62); }
        .sun-kv-v { color: #fff; font-weight: 900; text-align: right; }
        .sun-center-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .sun-img-wrap {
          width: 100%;
          max-width: 340px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .sun-visual {
          position: relative;
          width: 260px;
          height: 260px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /* Animated rotating rays */
        .sun-rays {
          position: absolute;
          inset: -30px;
          border-radius: 50%;
          transition: opacity 0.8s ease, filter 0.8s ease;
        }
        @keyframes sunRaysSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .sun-ray-line {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 2px;
          transform-origin: 0 0;
          border-radius: 999px;
          transition: height 0.8s ease, opacity 0.8s ease, background 0.8s ease;
        }
        /* Core sun circle */
        .sun-core {
          position: relative;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          z-index: 2;
          transition: background 0.8s ease, box-shadow 0.8s ease;
        }
        /* Film overlay on sun */
        .sun-film-overlay {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          z-index: 3;
          transition: background 0.8s ease;
          pointer-events: none;
        }
        /* Percent badge below sun */
        .sun-percent-badge {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .sun-percent-value {
          font-size: 2.6rem;
          font-weight: 950;
          letter-spacing: -0.02em;
          line-height: 1;
          transition: color 0.8s ease;
        }
        .sun-percent-caption {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(226,232,240,0.55);
        }
        /* Light bar */
        .sun-light-meter {
          margin-top: 16px;
          width: 200px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .sun-light-meter-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(226,232,240,0.45);
        }
        .sun-light-meter-track {
          width: 100%;
          height: 6px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          overflow: hidden;
        }
        .sun-light-meter-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.8s cubic-bezier(0.25, 0.8, 0.25, 1), background 0.8s ease;
        }
        @media (max-width: 980px) {
          .sun-img-wrap {
            max-width: 280px;
          }
          .sun-visual {
            width: 200px;
            height: 200px;
          }
          .sun-core {
            width: 120px;
            height: 120px;
          }
          .sun-percent-value {
            font-size: 2rem;
          }
        }
        .sun-controls {
          margin-top: 28px;
          width: 100%;
          display: grid;
          grid-template-columns: 44px 1fr 44px;
          gap: 12px;
          align-items: center;
        }
        .sun-arrow {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.22);
          color: #fff;
          backdrop-filter: blur(6px);
          transition: transform 0.15s ease, background 0.2s ease;
        }
        .sun-arrow:hover { background: rgba(255,255,255,0.16); }
        .sun-arrow:active { transform: scale(0.96); }
        .sun-percent-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }
        .sun-percent-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.18);
          color: rgba(226,232,240,0.86);
          padding: 8px 14px;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 900;
          letter-spacing: 0.02em;
          backdrop-filter: blur(6px);
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }
        .sun-percent-btn:hover { transform: translateY(-1px); background: rgba(255,255,255,0.12); }
        .sun-percent-btn--active {
          background: rgba(255,200,50,0.2);
          border-color: rgba(255,200,50,0.45);
          color: #FFD24A;
        }
        .sun-buy-btn {
          margin-top: 14px;
          padding: 12px 16px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.10);
          color: #fff;
          cursor: pointer;
          font-weight: 900;
          letter-spacing: 0.02em;
          transition: transform 0.15s ease, background 0.2s ease, border-color 0.2s ease;
        }
        .sun-buy-btn:hover { background: rgba(255,255,255,0.14); }
        .sun-buy-btn:active { transform: scale(0.99); }

        .sun-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(2,6,23,0.72);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .sun-modal {
          width: min(720px, 100%);
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(15,23,42,0.92);
          box-shadow: 0 40px 120px rgba(0,0,0,0.55);
          backdrop-filter: blur(14px);
          overflow: hidden;
        }
        .sun-modal__head {
          padding: 18px 18px 14px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.10);
        }
        .sun-modal__title {
          margin: 0;
          color: #fff;
          font-weight: 950;
          letter-spacing: -0.02em;
          font-size: 1.15rem;
        }
        .sun-modal__meta {
          margin-top: 6px;
          color: rgba(226,232,240,0.75);
          font-weight: 700;
          font-size: 0.92rem;
        }
        .sun-modal__close {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.06);
          color: #fff;
          cursor: pointer;
        }
        .sun-modal__body {
          padding: 16px 18px 18px;
        }
        .sun-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        @media (max-width: 720px) {
          .sun-form { grid-template-columns: 1fr; }
        }
        .sun-field label {
          display: block;
          margin-bottom: 6px;
          font-size: 0.78rem;
          font-weight: 850;
          color: rgba(226,232,240,0.72);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .sun-field input,
        .sun-field select,
        .sun-field textarea {
          width: 100%;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(2,6,23,0.55);
          color: #fff;
          padding: 11px 12px;
          outline: none;
        }
        .sun-field textarea { min-height: 96px; resize: vertical; }
        .sun-modal__actions {
          margin-top: 12px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          flex-wrap: wrap;
        }
        .sun-btn {
          padding: 11px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.06);
          color: #fff;
          cursor: pointer;
          font-weight: 900;
        }
        .sun-btn--primary {
          background: rgba(0,166,81,0.24);
          border-color: rgba(0,166,81,0.38);
        }
        .sun-error {
          margin-top: 10px;
          color: #FCA5A5;
          font-weight: 700;
        }
        .sun-success {
          padding: 14px 14px;
          border-radius: 14px;
          border: 1px solid rgba(34,197,94,0.28);
          background: rgba(34,197,94,0.10);
          color: #E2E8F0;
          font-weight: 700;
        }
      `}</style>

      {/* 5-SLIDE FULL SCREEN SPLIT HERO */}
      <section className="split-slide-container">
        <div className="hero-track" style={{ transform: `translateX(-${currentHeroBlock * 100}%)` }}>
          {heroSlides.map((slide, idx) => {
            const isActive = idx === currentHeroBlock;
            return (
              <div key={slide.id} className="hero-slide">
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
                      transform: isActive ? 'scale(1)' : 'scale(1.05)',
                      transition: 'transform 2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="hero-nav hero-nav--left"
          onClick={() => setCurrentHeroBlock((prev) => (prev - 1 + heroSlideConfig.length) % heroSlideConfig.length)}
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          className="hero-nav hero-nav--right"
          onClick={() => setCurrentHeroBlock((prev) => (prev + 1) % heroSlideConfig.length)}
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>

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

      {/* SUN / PERCENT CAROUSEL */}
      <section className="sun-carousel-section">
        <div className="sun-track-wrap">
          {/* Single unified track — entire slide slides together */}
          <div
            className={`sun-main-track ${sunTransitionEnabled ? '' : 'sun-no-anim'}`}
            style={{ transform: `translateX(-${sunVisualIndex * 100}%)` }}
            onTransitionEnd={handleSunTransitionEnd}
          >
            {sunSlidesLoop.map((slide, idx) => (
              <div key={`${slide.id}-full-${idx}`} className="sun-full-slide">
                {/* LEFT — Parameters */}
                <div className="sun-side-card">
                  <div className="sun-side-title">{slide.leftTitle}</div>
                  {slide.left.map((row, rowIdx) => (
                    <div key={`${row.k}-${rowIdx}`} className="sun-kv">
                      <div className="sun-kv-k">{row.k}</div>
                      <div className="sun-kv-v">{row.v}</div>
                    </div>
                  ))}
                </div>

                {/* CENTER — Creative Sun Visualization */}
                <div className="sun-center-col">
                  <div className="sun-img-wrap">
                    {(() => {
                      const pct = slide.percent;
                      // brightness: 30% blocking = bright sun, 92% blocking = very dim sun
                      const brightness = Math.max(0.08, 1 - pct / 100);
                      const glowIntensity = brightness;
                      const coreLight = Math.round(25 + brightness * 50); // 25-75
                      const coreSat = Math.round(40 + brightness * 55); // 40-95
                      const coreColor = `hsl(42, ${coreSat}%, ${coreLight}%)`;
                      const coreGlow = `hsl(38, ${coreSat}%, ${Math.round(coreLight * 1.1)}%)`;
                      const glowSize = Math.round(10 + glowIntensity * 60);
                      const rayCount = 24;
                      const rayOpacity = Math.max(0.05, brightness * 0.7);
                      const rayLength = Math.round(20 + brightness * 55);
                      const filmOpacity = pct / 130; // 0.23 at 30%, 0.71 at 92%
                      const percentColor = brightness > 0.4
                        ? `hsl(42, 90%, 65%)`
                        : brightness > 0.2
                          ? `hsl(42, 60%, 45%)`
                          : `hsl(42, 30%, 35%)`;
                      const meterFill = brightness > 0.4
                        ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
                        : brightness > 0.2
                          ? 'linear-gradient(90deg, #B45309, #D97706)'
                          : 'linear-gradient(90deg, #78350F, #92400E)';
                      return (
                        <>
                          <div className="sun-visual">
                            {/* Rays */}
                            <div className="sun-rays" style={{ opacity: rayOpacity, animation: 'sunRaysSpin 60s linear infinite' }}>
                              {Array.from({ length: rayCount }).map((_, i) => {
                                const angle = (360 / rayCount) * i;
                                const rLen = rayLength + (i % 3 === 0 ? 12 : 0);
                                return (
                                  <div
                                    key={i}
                                    className="sun-ray-line"
                                    style={{
                                      height: rLen,
                                      transform: `rotate(${angle}deg) translateY(-${80 + rLen}px)`,
                                      background: `linear-gradient(to bottom, ${coreGlow}, transparent)`,
                                      opacity: i % 2 === 0 ? 1 : 0.5,
                                    }}
                                  />
                                );
                              })}
                            </div>
                            {/* Core sun */}
                            <div
                              className="sun-core"
                              style={{
                                background: `radial-gradient(circle at 40% 35%, ${coreGlow}, ${coreColor} 60%, hsl(42, 30%, ${Math.max(8, coreLight - 15)}%) 100%)`,
                                boxShadow: `0 0 ${glowSize}px ${glowSize / 2}px hsla(42, ${coreSat}%, ${coreLight}%, ${glowIntensity * 0.5}), 0 0 ${glowSize * 2.5}px ${glowSize}px hsla(38, ${coreSat}%, ${coreLight}%, ${glowIntensity * 0.25})`,
                              }}
                            />
                            {/* Film overlay — darkens the sun */}
                            <div
                              className="sun-film-overlay"
                              style={{
                                background: `rgba(7, 11, 20, ${filmOpacity})`,
                                inset: 0,
                                position: 'absolute',
                                borderRadius: '50%',
                                width: 160,
                                height: 160,
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                              }}
                            />
                          </div>
                          {/* Percent badge */}
                          <div className="sun-percent-badge">
                            <div className="sun-percent-value" style={{ color: percentColor }}>
                              {slide.percent}<span style={{ fontSize: '1.4rem' }}>%</span>
                            </div>
                            <div className="sun-percent-caption">yorug'lik o'tishi</div>
                          </div>
                          {/* Light meter */}
                          <div className="sun-light-meter">
                            <div className="sun-light-meter-labels">
                              <span>kam</span>
                              <span>ko'p</span>
                            </div>
                            <div className="sun-light-meter-track">
                              <div
                                className="sun-light-meter-fill"
                                style={{
                                  width: `${100 - pct}%`,
                                  background: meterFill,
                                }}
                              />
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* RIGHT — Description */}
                <div className="sun-side-card">
                  <div className="sun-side-title">{slide.rightTitle}</div>
                  {slide.right.map((row, rowIdx) => (
                    <div key={`${row.k}-${rowIdx}`} className="sun-kv">
                      <div className="sun-kv-k">{row.k}</div>
                      <div className="sun-kv-v">{row.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls — outside overflow:hidden so they stay visible */}
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 40 }}>
          <div className="sun-controls" aria-label="Percent controls">
            <button
              type="button"
              className="sun-arrow"
              onClick={() => {
                if (!sunSlidesLen) return;
                setSunTransitionEnabled(true);
                setSunVisualIndex((prev) => Math.max(0, prev - 1));
              }}
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="sun-percent-row" aria-label="Percent slides">
              {sunSlideConfig.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  className={`sun-percent-btn ${idx === safeSunIndex ? 'sun-percent-btn--active' : ''}`}
                  onClick={() => {
                    setSunTransitionEnabled(true);
                    setSunVisualIndex(idx + 1);
                  }}
                  aria-label={`${s.percent}%`}
                >
                  {`${s.percent}%`}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="sun-arrow"
              onClick={() => {
                if (!sunSlidesLen) return;
                setSunTransitionEnabled(true);
                setSunVisualIndex((prev) => Math.min(sunSlidesLen + 1, prev + 1));
              }}
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <button type="button" className="sun-buy-btn" onClick={openBuyModal}>
            Sotib olish
          </button>
        </div>
      </section>

      {buyOpen && (
        <div className="sun-modal-backdrop" role="dialog" aria-modal="true" aria-label="Sotib olish">
          <div className="sun-modal">
            <div className="sun-modal__head">
              <div>
                <h3 className="sun-modal__title">Sotib olish</h3>
                <div className="sun-modal__meta">Tanlangan foiz: {currentSun?.percent}%</div>
              </div>
              <button type="button" className="sun-modal__close" onClick={closeBuyModal} aria-label="Close">
                x
              </button>
            </div>

            <div className="sun-modal__body">
              {!user ? (
                <div>
                  <div className="sun-success" style={{ borderColor: 'rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.06)' }}>
                    Buyurtma berish uchun avval akkauntga kiring.
                  </div>
                  <div className="sun-modal__actions">
                    <button type="button" className="sun-btn" onClick={closeBuyModal}>Yopish</button>
                    <button type="button" className="sun-btn sun-btn--primary" onClick={() => { setBuyOpen(false); navigate('/login'); }}>Kirish</button>
                  </div>
                </div>
              ) : buySuccess ? (
                <div>
                  <div className="sun-success">Buyurtma yuborildi. Profil bo‘limida holatini ko‘rishingiz mumkin.</div>
                  <div className="sun-modal__actions">
                    <button type="button" className="sun-btn" onClick={() => { setBuyOpen(false); }}>Yopish</button>
                    <Link to="/profile" className="sun-btn sun-btn--primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                      Profilga o‘tish
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBuySubmit}>
                  <div className="sun-form">
                    <div className="sun-field">
                      <label>Mahsulot</label>
                      <select value={buyProductId} onChange={(e) => setBuyProductId(e.target.value)} disabled={buyProductsLoading}>
                        {buyProductsLoading ? (
                          <option value="">Yuklanmoqda...</option>
                        ) : buyProductsError ? (
                          <option value="">{buyProductsError}</option>
                        ) : buyProducts.length ? (
                          buyProducts.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.name_uz || p.name || 'Mahsulot'}
                            </option>
                          ))
                        ) : (
                          <option value="">Mahsulot topilmadi</option>
                        )}
                      </select>
                    </div>

                    <div className="sun-field">
                      <label>Miqdor</label>
                      <input type="number" min="1" value={buyQty} onChange={(e) => setBuyQty(e.target.value)} />
                    </div>

                    <div className="sun-field">
                      <label>Manzil</label>
                      <input value={buyAddress} onChange={(e) => setBuyAddress(e.target.value)} placeholder="Yetkazish manzili" />
                    </div>

                    <div className="sun-field">
                      <label>Telefon</label>
                      <input value={buyPhone} onChange={(e) => setBuyPhone(e.target.value)} placeholder="+998..." />
                    </div>

                    <div className="sun-field" style={{ gridColumn: '1 / -1' }}>
                      <label>Izoh</label>
                      <textarea value={buyNotes} onChange={(e) => setBuyNotes(e.target.value)} placeholder="Qo‘shimcha talablar..." />
                    </div>
                  </div>

                  {buySubmitError && <div className="sun-error">{buySubmitError}</div>}

                  <div className="sun-modal__actions">
                    <button type="button" className="sun-btn" onClick={closeBuyModal} disabled={buySubmitting}>Bekor</button>
                    <button type="submit" className="sun-btn sun-btn--primary" disabled={buySubmitting || buyProductsLoading}>
                      {buySubmitting ? 'Yuborilmoqda...' : 'Buyurtma berish'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT SHOWCASE CAROUSEL — above partners */}
      <section className="product-showcase-section">
        <style>{`
          .product-showcase-section {
            position: relative;
            width: 100%;
            height: calc(100vh - var(--header-height, 72px));
            min-height: 560px;
            overflow: hidden;
            background: #0F172A;
          }
          .product-showcase-track {
            display: flex;
            height: 100%;
            width: 100%;
            will-change: transform;
            transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
          }
          .product-showcase-slide {
            flex: 0 0 100%;
            height: 100%;
            position: relative;
          }
          .product-showcase-inner {
            display: flex;
            height: 100%;
            width: 100%;
          }
          .product-showcase-text {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6% 4%;
            color: white;
            position: relative;
            z-index: 2;
          }
          .product-showcase-image {
            flex: 1;
            position: relative;
            overflow: hidden;
          }
          .product-showcase-specs {
            margin-top: 20px;
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
          }
          .product-showcase-spec {
            padding: 8px 16px;
            border-radius: 999px;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.15);
            font-size: 0.85rem;
          }
          .product-showcase-spec-k {
            color: rgba(226,232,240,0.6);
            margin-right: 6px;
          }
          .product-showcase-spec-v {
            color: #fff;
            font-weight: 700;
          }
          .product-showcase-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 5;
            width: 48px;
            height: 48px;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            background: rgba(255,255,255,0.12);
            border: 1px solid rgba(255,255,255,0.24);
            color: #fff;
            backdrop-filter: blur(8px);
            transition: background 0.2s ease, transform 0.2s ease;
          }
          .product-showcase-nav:hover {
            background: rgba(255,255,255,0.18);
            transform: translateY(-50%) scale(1.05);
          }
          .product-showcase-nav--left { left: 18px; }
          .product-showcase-nav--right { right: 18px; }
          @media (max-width: 900px) {
            .product-showcase-inner { flex-direction: column-reverse !important; justify-content: flex-end; }
            .product-showcase-text { flex: 0 0 55%; padding: 40px 20px; align-items: flex-start; }
            .product-showcase-image { flex: 0 0 45%; }
            .product-showcase-nav {
              width: 40px;
              height: 40px;
              top: auto;
              bottom: 20px;
              transform: none;
            }
            .product-showcase-nav:hover { transform: none; }
          }
        `}</style>

        <div className="product-showcase-track" style={{ transform: `translateX(-${accessorySlideIndex * 100}%)` }}>
          {accessoryShowcaseConfig.map((slide, idx) => {
            const isActive = idx === accessorySlideIndex;
            return (
              <div key={slide.id} className="product-showcase-slide">
                <div className="product-showcase-inner" style={{ flexDirection: slide.reverse ? 'row-reverse' : 'row' }}>
                  <div className="product-showcase-text" style={{ background: slide.bgColor }}>
                    <div style={{ maxWidth: 580, transform: isActive ? 'translateY(0)' : 'translateY(30px)', transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)', transitionDelay: '0.2s', opacity: isActive ? 1 : 0 }}>
                      <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>{slide.title}</h2>
                      <p style={{ fontSize: '1.1rem', color: '#CBD5E1', lineHeight: 1.7, marginBottom: 20 }}>{slide.subtitle}</p>
                      <div className="product-showcase-specs">
                        {slide.specs.map((spec) => (
                          <div key={spec.k} className="product-showcase-spec">
                            <span className="product-showcase-spec-k">{spec.k}:</span>
                            <span className="product-showcase-spec-v">{spec.v}</span>
                          </div>
                        ))}
                      </div>
                      <Link
                        to={`/accessory/${slide.slug}`}
                        style={{
                          marginTop: 28,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 10,
                          background: 'linear-gradient(135deg, #00A651, #16A34A)',
                          color: '#FFF',
                          border: 'none',
                          padding: '14px 36px',
                          borderRadius: 50,
                          fontWeight: 700,
                          fontSize: '1rem',
                          textDecoration: 'none',
                          letterSpacing: 1,
                          textTransform: 'uppercase',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 14px rgba(0,166,81,0.35)',
                        }}
                        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,166,81,0.5)'; }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,166,81,0.35)'; }}
                      >
                        Sotib olish <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                  <div className="product-showcase-image">
                    <div style={{
                      position: 'absolute',
                      top: 0, left: 0, width: '100%', height: '100%',
                      backgroundImage: `url(${slide.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transform: isActive ? 'scale(1)' : 'scale(1.05)',
                      transition: 'transform 2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {accessoryShowcaseConfig.length > 1 && (
          <>
            <button
              type="button"
              className="product-showcase-nav product-showcase-nav--left"
              onClick={() => setAccessorySlideIndex((prev) => (prev - 1 + accessoryShowcaseConfig.length) % accessoryShowcaseConfig.length)}
              aria-label="Previous product"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="product-showcase-nav product-showcase-nav--right"
              onClick={() => setAccessorySlideIndex((prev) => (prev + 1) % accessoryShowcaseConfig.length)}
              aria-label="Next product"
            >
              <ChevronRight size={20} />
            </button>

            <div style={{ position: 'absolute', bottom: 30, left: 0, width: '100%', zIndex: 3, display: 'flex', justifyContent: 'center', gap: 10 }}>
              {accessoryShowcaseConfig.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setAccessorySlideIndex(idx)}
                  style={{
                    width: accessorySlideIndex === idx ? 36 : 10,
                    height: 10,
                    borderRadius: 10,
                    background: accessorySlideIndex === idx ? '#FFF' : 'rgba(255,255,255,0.4)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    padding: 0
                  }}
                  aria-label={`Product ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* SUG'ORISH SHOWCASE — after aksessuarlar */}
      <section className="product-showcase-section">
        <div className="product-showcase-track" style={{ transform: `translateX(-${irrigationSlideIndex * 100}%)` }}>
          {irrigationShowcaseConfig.map((slide, idx) => {
            const isActive = idx === irrigationSlideIndex;
            return (
              <div key={slide.id} className="product-showcase-slide">
                <div className="product-showcase-inner" style={{ flexDirection: slide.reverse ? 'row-reverse' : 'row' }}>
                  <div className="product-showcase-text" style={{ background: slide.bgColor }}>
                    <div style={{ maxWidth: 580, transform: isActive ? 'translateY(0)' : 'translateY(30px)', transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)', transitionDelay: '0.2s', opacity: isActive ? 1 : 0 }}>
                      <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>{slide.title}</h2>
                      <p style={{ fontSize: '1.1rem', color: '#CBD5E1', lineHeight: 1.7, marginBottom: 20 }}>{slide.subtitle}</p>
                      <div className="product-showcase-specs">
                        {slide.specs.map((spec) => (
                          <div key={spec.k} className="product-showcase-spec">
                            <span className="product-showcase-spec-k">{spec.k}:</span>
                            <span className="product-showcase-spec-v">{spec.v}</span>
                          </div>
                        ))}
                      </div>
                      <Link
                        to={`/accessory/${slide.slug}`}
                        style={{
                          marginTop: 28,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 10,
                          background: 'linear-gradient(135deg, #00A651, #16A34A)',
                          color: '#FFF',
                          border: 'none',
                          padding: '14px 36px',
                          borderRadius: 50,
                          fontWeight: 700,
                          fontSize: '1rem',
                          textDecoration: 'none',
                          letterSpacing: 1,
                          textTransform: 'uppercase',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 14px rgba(0,166,81,0.35)',
                        }}
                        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,166,81,0.5)'; }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,166,81,0.35)'; }}
                      >
                        Sotib olish <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                  <div className="product-showcase-image">
                    <div style={{
                      position: 'absolute',
                      top: 0, left: 0, width: '100%', height: '100%',
                      backgroundImage: `url(${slide.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transform: isActive ? 'scale(1)' : 'scale(1.05)',
                      transition: 'transform 2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {irrigationShowcaseConfig.length > 1 && (
          <>
            <button
              type="button"
              className="product-showcase-nav product-showcase-nav--left"
              onClick={() => setIrrigationSlideIndex((prev) => (prev - 1 + irrigationShowcaseConfig.length) % irrigationShowcaseConfig.length)}
              aria-label="Previous product"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="product-showcase-nav product-showcase-nav--right"
              onClick={() => setIrrigationSlideIndex((prev) => (prev + 1) % irrigationShowcaseConfig.length)}
              aria-label="Next product"
            >
              <ChevronRight size={20} />
            </button>

            <div style={{ position: 'absolute', bottom: 30, left: 0, width: '100%', zIndex: 3, display: 'flex', justifyContent: 'center', gap: 10 }}>
              {irrigationShowcaseConfig.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setIrrigationSlideIndex(idx)}
                  style={{
                    width: irrigationSlideIndex === idx ? 36 : 10,
                    height: 10,
                    borderRadius: 10,
                    background: irrigationSlideIndex === idx ? '#FFF' : 'rgba(255,255,255,0.4)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    padding: 0
                  }}
                  aria-label={`Product ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* SUG'ORISH KATALOGI — above partners */}
      <section style={{ padding: '56px 0', background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <style>{`
          .irri2-wrap { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
          .irri2-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 18px; }
          .irri2-title { margin: 0; font-weight: 950; color: #0F172A; font-size: clamp(2rem, 3vw, 3rem); letter-spacing: -0.02em; }
          .irri2-right { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; justify-content: flex-end; }
          .irri2-sub { margin: 0; color: #64748B; font-weight: 800; }
          .irri2-all {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 12px 18px;
            border-radius: 999px;
            border: 1px solid #0F172A;
            color: #0F172A;
            text-decoration: none;
            font-weight: 900;
            background: transparent;
          }
          .irri2-all:hover { background: rgba(15,23,42,0.06); }

          .irri2-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          @media (max-width: 900px) { .irri2-grid { grid-template-columns: 1fr; } }

          .irri2-card {
            position: relative;
            border-radius: 24px;
            overflow: hidden;
            display: block;
            height: 420px;
            text-decoration: none;
            border: 1px solid rgba(148, 163, 184, 0.35);
            background: #0B1220;
            box-shadow: 0 18px 45px rgba(2,6,23,0.12);
            transition: transform 0.15s ease, box-shadow 0.25s ease, border-color 0.2s ease;
          }
          .irri2-card:hover {
            transform: translateY(-2px);
            border-color: rgba(0,166,81,0.55);
            box-shadow: 0 24px 60px rgba(0,166,81,0.14);
          }
          .irri2-bg { position: absolute; inset: 0; background-size: cover; background-position: center; transform: scale(1.02); transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
          .irri2-card:hover .irri2-bg { transform: scale(1.06); }
          .irri2-grad { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(2,6,23,0.1) 0%, rgba(2,6,23,0.8) 72%, rgba(2,6,23,0.92) 100%); }
          .irri2-content { position: absolute; left: 22px; right: 22px; bottom: 22px; z-index: 2; }
          .irri2-price {
            display: inline-flex;
            align-items: center;
            padding: 10px 14px;
            border-radius: 999px;
            background: rgba(255,255,255,0.12);
            border: 1px solid rgba(255,255,255,0.18);
            color: #fff;
            font-weight: 950;
            backdrop-filter: blur(10px);
            margin-bottom: 12px;
          }
          .irri2-name { margin: 0 0 6px; color: #fff; font-weight: 950; font-size: 1.55rem; line-height: 1.15; letter-spacing: -0.01em; }
          .irri2-desc { margin: 0 0 12px; color: rgba(226,232,240,0.86); font-weight: 700; line-height: 1.5; max-width: 560px; }
          .irri2-cta { display: inline-flex; align-items: center; gap: 10px; color: #fff; font-weight: 950; letter-spacing: 0.08em; text-transform: uppercase; font-size: 0.85rem; }
          .irri2-cta span { opacity: 0.95; }
        `}</style>

        <div className="irri2-wrap">
          <div className="irri2-head">
            <h2 className="irri2-title">Katalog</h2>
          </div>

          <div className="irri2-grid">
            {irrigationCatalogConfig.map((item) => (
              <Link key={item.id} to={`/accessory/${item.slug}`} className="irri2-card">
                <div className="irri2-bg" style={{ backgroundImage: `url(${item.image})` }} />
                <div className="irri2-grad" />
                <div className="irri2-content">
                  <h3 className="irri2-name">{item.title}</h3>
                  <div className="irri2-cta"><span>Mahsulot haqida</span> <ArrowRight size={18} /></div>
                </div>
              </Link>
            ))}
          </div>
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
    </div>
  );
}
