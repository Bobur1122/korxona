import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { api } from '../api';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { CATALOG_CATEGORY_VALUES, getCategoryLabel } from '../utils/categoryTranslation';

const categories = CATALOG_CATEGORY_VALUES;

export default function ProductsPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      params.set('page', page);
      params.set('limit', 12);

      const res = await api.getProducts(params.toString());
      setProducts(res.data);
      setPagination(res.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  return (
    <div className="fade-in">
      <section style={{
        background: '#0F172A', color: '#fff',
        padding: 'calc(var(--header-height) + 60px) 0 60px',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: 8, letterSpacing: '-0.03em' }}>
            {t('allProducts')}
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1.125rem', maxWidth: 600, margin: '0 auto' }}>
            {t('techDesc')}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 'var(--header-height)', zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', gap: 0, overflowX: 'auto', alignItems: 'center' }}>
          <button onClick={() => { setCategory(''); setPage(1); }}
            style={{
              padding: '16px 24px', fontWeight: 600, fontSize: '0.8125rem',
              border: 'none', background: 'none', cursor: 'pointer',
              color: !category ? '#0F172A' : '#64748B',
              borderBottom: !category ? '3px solid #0F172A' : '3px solid transparent',
              transition: 'all 0.2s', whiteSpace: 'nowrap', fontFamily: 'var(--font-family)',
              textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>
            {t('allProducts')}
          </button>
          {categories.map(cat => (
            <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
              style={{
                padding: '16px 20px', fontWeight: 600, fontSize: '0.8125rem',
                border: 'none', background: 'none', cursor: 'pointer',
                color: category === cat ? '#0F172A' : '#64748B',
                borderBottom: category === cat ? '3px solid #0F172A' : '3px solid transparent',
                transition: 'all 0.2s', whiteSpace: 'nowrap', fontFamily: 'var(--font-family)',
                textTransform: 'uppercase', letterSpacing: '0.03em'
              }}>
              {getCategoryLabel(t, cat)}
            </button>
          ))}

          {/* Search */}
          <form onSubmit={handleSearch} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text" className="form-input"
                placeholder={t('search')} value={search}
                onChange={(e) => setSearch(e.target.value)}
                id="product-search"
                style={{ paddingLeft: 36, height: 38, fontSize: '0.875rem', width: 'clamp(120px, 20vw, 200px)', border: '1px solid #E2E8F0', borderRadius: 8 }}
              />
            </div>
          </form>
        </div>
      </section>

      <section className="section" style={{ background: '#F8FAFC', minHeight: 400 }}>
        <div className="container">
          {loading ? (
            <div className="loading-page"><div className="spinner"></div></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <Search size={48} />
              <h3>{t('allProducts')}</h3>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>

              {pagination.pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-10)' }}>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={`btn ${p === page ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setPage(p)}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
