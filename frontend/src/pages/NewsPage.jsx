import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { api } from '../api';
import { useLanguage } from '../context/LanguageContext';

const categoryMap = { yangilik: 'feature', aksiya: 'promotions', elon: 'announcement', maqola: 'article' };

export default function NewsPage() {
  const { t, tl, language } = useLanguage();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    const params = activeCategory ? `category=${activeCategory}` : '';
    api.getNews(params)
      .then(res => setNews(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const formatDate = (d) => {
    const date = new Date(d);
    const days = { uz: ['YAK', 'DU', 'SE', 'CHOR', 'PAY', 'JU', 'SHA'], ru: ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'], en: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] };
    const months = {
      uz: ['YAN', 'FEV', 'MAR', 'APR', 'MAY', 'IYU', 'IYU', 'AVG', 'SEN', 'OKT', 'NOY', 'DEK'],
      ru: ['ЯНВ', 'ФЕВ', 'МАР', 'АПР', 'МАЙ', 'ИЮН', 'ИЮЛ', 'АВГ', 'СЕН', 'ОКТ', 'НОЯ', 'ДЕК'],
      en: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    };
    const lang = language || 'uz';
    return `${days[lang][date.getDay()]} ${months[lang][date.getMonth()]} ${String(date.getDate()).padStart(2, '0')} ${date.getFullYear()}`;
  };

  const getCategoryLabel = (cat) => {
    const key = categoryMap[cat] || 'feature';
    return t(key);
  };

  const categories = [
    { value: '', label: t('allNews') },
    { value: 'yangilik', label: t('feature') },
    { value: 'aksiya', label: t('promotions') },
    { value: 'elon', label: t('announcement') },
    { value: 'maqola', label: t('article') }
  ];

  return (
    <div className="fade-in">
      {/* Hero */}
      <section style={{
        background: '#0F172A', color: '#fff',
        padding: 'calc(var(--header-height) + 60px) 0 60px',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: 8 }}>{t('latestNews')}</h1>
          <p style={{ color: '#94A3B8', fontSize: '1.125rem' }}>{t('newsSubtitle')}</p>
        </div>
      </section>

      {/* Category Filter */}
      <section style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 'var(--header-height)', zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
          {categories.map(cat => (
            <button key={cat.value} onClick={() => { setActiveCategory(cat.value); setLoading(true); }}
              style={{
                padding: '16px 24px', fontWeight: 600, fontSize: '0.8125rem',
                border: 'none', background: 'none', cursor: 'pointer',
                color: activeCategory === cat.value ? '#0F172A' : '#64748B',
                borderBottom: activeCategory === cat.value ? '3px solid #0F172A' : '3px solid transparent',
                transition: 'all 0.2s', whiteSpace: 'nowrap', fontFamily: 'var(--font-family)',
                textTransform: 'uppercase', letterSpacing: '0.05em'
              }}>
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* News Grid */}
      <section className="section" style={{ background: '#fff', minHeight: 400 }}>
        <div className="container">
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ background: '#F1F5F9', height: 360, borderRadius: 8, animation: 'pulse 1.5s infinite' }}></div>
              ))}
            </div>
          ) : news.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748B' }}>
              <h3 style={{ marginBottom: 8 }}>{t('allNews')}</h3>
              <p>Hozircha yangiliklar yo'q</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 40 }}>
              {news.map(item => (
                <article key={item._id} className="news-card">
                  <Link to={`/news/${item._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {/* Image */}
                    <div className="news-card__img-wrap">
                      {item.image ? (
                        <img src={item.image} alt={tl(item, 'title')} className="news-card__img" />
                      ) : (
                        <div className="news-card__img-placeholder">
                          <Calendar size={32} color="#94A3B8" />
                        </div>
                      )}
                    </div>
                    {/* Meta */}
                    <div className="news-card__meta">
                      <span className="news-card__date">{formatDate(item.createdAt)}</span>
                      <span className="news-card__category">{getCategoryLabel(item.category)}</span>
                    </div>
                    {/* Title */}
                    <h3 className="news-card__title">{tl(item, 'title')}</h3>
                    {/* Read More */}
                    <div className="news-card__readmore">
                      {t('readMore')} <ArrowRight size={14} />
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
