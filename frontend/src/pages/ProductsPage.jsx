import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { api } from '../api';
import ProductCard from '../components/ProductCard';

const categories = [
  { value: '', label: 'Barcha kategoriyalar' },
  { value: "ko'ylak", label: "Ko'ylak" },
  { value: 'shim', label: 'Shim' },
  { value: 'kostyum', label: 'Kostyum' },
  { value: 'palto', label: 'Palto' },
  { value: 'sport', label: 'Sport kiyim' },
  { value: 'boshqa', label: 'Boshqa' }
];

const sortOptions = [
  { value: '', label: 'Standart' },
  { value: 'price_asc', label: 'Narx: arzon → qimmat' },
  { value: 'price_desc', label: 'Narx: qimmat → arzon' },
  { value: 'name', label: 'Nomi bo\'yicha' }
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (sort) params.set('sort', sort);
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
  }, [category, sort, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  return (
    <div className="fade-in">
      <section style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
        color: 'white',
        padding: 'var(--space-16) 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 800, marginBottom: 'var(--space-3)', letterSpacing: '-0.03em' }}>
            Mahsulotlar
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'var(--font-size-lg)' }}>
            Barcha kiyim turlarini ko'ring va buyurtma bering
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="filters-bar">
            <form onSubmit={handleSearch} className="search-input-wrapper">
              <Search size={18} />
              <input
                type="text"
                className="form-input"
                placeholder="Mahsulot qidirish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                id="product-search"
                style={{ paddingLeft: 42 }}
              />
            </form>
            <select
              className="form-select"
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              style={{ maxWidth: 200 }}
              id="category-filter"
            >
              {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <select
              className="form-select"
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              style={{ maxWidth: 220 }}
              id="sort-filter"
            >
              {sortOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="loading-page"><div className="spinner"></div></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <Search size={48} />
              <h3>Mahsulot topilmadi</h3>
              <p>Boshqa qidiruv so'zini sinab ko'ring</p>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>

              {pagination.pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-10)' }}>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      className={`btn ${p === page ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                      onClick={() => setPage(p)}
                    >
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
