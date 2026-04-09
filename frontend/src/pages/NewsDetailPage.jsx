import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { api } from '../api';
import { useLanguage } from '../context/LanguageContext';

export default function NewsDetailPage() {
  const { id } = useParams();
  const { t, tl, language } = useLanguage();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNewsById(id)
      .then(res => setNews(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (d) => {
    return new Date(d).toLocaleDateString(language === 'ru' ? 'ru-RU' : language === 'en' ? 'en-US' : 'uz-UZ', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const categoryLabels = { yangilik: t('feature'), aksiya: t('promotions'), elon: t('announcement'), maqola: t('article') };

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;
  if (!news) return <div className="loading-page"><h2>404 — {t('backToNews')}</h2></div>;

  return (
    <div className="fade-in" style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Clean article layout with proper header clearance */}
      <section style={{ paddingTop: 'calc(var(--header-height, 72px) + 40px)', paddingBottom: 80, background: '#fff' }}>
        <div className="container" style={{ maxWidth: 780, margin: '0 auto' }}>
          {/* Back link */}
          <Link to="/news" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            color: '#64748B', fontWeight: 600, fontSize: '0.875rem',
            marginBottom: 32, textDecoration: 'none',
            padding: '8px 16px', borderRadius: 8,
            background: '#F1F5F9', transition: 'all 0.2s'
          }}>
            <ArrowLeft size={16} /> {t('backToNews')}
          </Link>

          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B', fontSize: '0.875rem' }}>
              <Calendar size={14} /> {formatDate(news.createdAt)}
            </span>
            <span style={{
              padding: '4px 14px', background: 'rgba(0, 166, 81, 0.1)',
              color: '#00A651', fontWeight: 700, fontSize: '0.75rem',
              borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>
              {categoryLabels[news.category] || news.category}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800,
            color: '#0F172A', lineHeight: 1.25, marginBottom: 32
          }}>
            {tl(news, 'title')}
          </h1>

          {/* Article image — contained, clean */}
          {news.image && (
            <div style={{
              marginBottom: 40, borderRadius: 16, overflow: 'hidden',
              border: '1px solid #E2E8F0', background: '#F8FAFC'
            }}>
              <img
                src={news.image}
                alt={tl(news, 'title')}
                style={{
                  width: '100%', maxHeight: 420, objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
          )}

          {/* Content */}
          <div style={{
            fontSize: '1.0625rem', lineHeight: 1.85, color: '#334155',
            whiteSpace: 'pre-wrap'
          }}>
            {tl(news, 'content')}
          </div>

          {/* Bottom back link */}
          <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #E2E8F0' }}>
            <Link to="/news" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              color: '#00A651', fontWeight: 700, fontSize: '0.9375rem',
              textDecoration: 'none'
            }}>
              <ArrowLeft size={16} /> {t('backToNews')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
