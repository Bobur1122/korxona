import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Package, Sun, ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../api';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { getCategoryLabel } from '../utils/categoryTranslation';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { t, tl } = useLanguage();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.getProduct(id)
      .then(res => {
        const p = res.data;
        setProduct(p);
        const isValid = (u) => u && typeof u === 'string' && u.trim() !== '' && u !== 'no-image.jpg';
        const imgs = (Array.isArray(p.images) ? p.images : []).filter(isValid);
        if (!imgs.length && isValid(p.image)) imgs.push(p.image);
        setActiveImage(imgs[0] || '');
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    if (product && product.stock > 0) {
      addItem(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return <div className="loading-page"><div className="spinner"></div></div>;
  }

  if (!product) {
    return (
      <div className="empty-state" style={{ paddingTop: 'calc(var(--header-height, 72px) + 60px)' }}>
        <Package size={48} />
        <h3>{t('products')}</h3>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: 16 }}>
          {t('products')}
        </Link>
      </div>
    );
  }

  const productName = tl(product, 'name') || product.name;
  const productDesc = tl(product, 'description') || product.description;
  const categoryLabel = getCategoryLabel(t, product.category);

  const isValid = (u) => u && typeof u === 'string' && u.trim() !== '' && u !== 'no-image.jpg' && !u.startsWith('https://placehold.co');
  const images = (Array.isArray(product.images) ? product.images : []).filter(isValid);
  if (!images.length && isValid(product.image)) images.push(product.image);

  // Category-based fallback
  const getFallback = (name) => {
    const s = (name || '').toLowerCase();
    if (s.includes('issiqxona') || s.includes('agro')) return '/images/products/agro.png';
    if (s.includes('termo') || s.includes('shrink')) return '/images/products/shrink.png';
    if (s.includes('roof') || s.includes('tom') || s.includes('gidro') || s.includes('bitum')) return '/images/products/build.png';
    if (s.includes('pet') || s.includes('paket') || s.includes('kapsul')) return '/images/products/food.png';
    const fallbacks = ['/images/products/agro.png', '/images/products/shrink.png', '/images/products/build.png', '/images/products/food.png'];
    return fallbacks[s.length % 4];
  };

  const mainImage = activeImage || images[0] || getFallback(productName);

  return (
    <div className="fade-in" style={{ paddingTop: 'calc(var(--header-height, 72px) + 32px)', paddingBottom: 60, background: '#fff', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Back link */}
        <Link to="/products" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          color: '#64748B', fontWeight: 600, fontSize: '0.875rem',
          marginBottom: 32, textDecoration: 'none',
          padding: '8px 16px', borderRadius: 8,
          background: '#F1F5F9', transition: 'all 0.2s'
        }}>
          <ArrowLeft size={16} /> {t('products')}
        </Link>

        <div className="product-detail-grid">
          {/* Image */}
          <div style={{ background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0', padding: 16 }}>
            <div
              style={{ position: 'relative', cursor: 'zoom-in', borderRadius: 12, overflow: 'hidden' }}
              onClick={() => { setLightboxIndex(images.indexOf(mainImage) >= 0 ? images.indexOf(mainImage) : 0); setLightboxOpen(true); }}
            >
              <img
                src={mainImage}
                alt={productName}
                className="product-detail-image"
                style={{ border: 'none', background: 'transparent', minHeight: 350 }}
                onError={(e) => { e.target.src = getFallback(productName); e.target.onerror = null; }}
              />
              <div style={{
                position: 'absolute', bottom: 12, right: 12,
                width: 40, height: 40, borderRadius: 10,
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', pointerEvents: 'none'
              }}>
                <ZoomIn size={18} />
              </div>
            </div>

            {images.length > 1 && (
              <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {images.map((url, idx) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setActiveImage(url)}
                    style={{
                      width: 74,
                      height: 54,
                      padding: 0,
                      borderRadius: 10,
                      border: (mainImage === url) ? '2px solid #00A651' : '1px solid #E2E8F0',
                      overflow: 'hidden',
                      background: '#fff',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s',
                    }}
                    title={t('viewImage')}
                  >
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail-info">
            <div style={{ marginBottom: 12 }}>
              <span style={{
                padding: '4px 14px', background: 'rgba(0, 166, 81, 0.1)',
                color: '#00A651', fontWeight: 700, fontSize: '0.75rem',
                borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '0.05em'
              }}>
                {categoryLabel}
              </span>
            </div>

            <h1>{productName}</h1>

            <div className="product-detail-price">
              {product.price.toLocaleString()} {t('som')}
            </div>

            <p className="product-detail-desc">{productDesc}</p>

            {/* Specs */}
            {(product.thickness || product.width || product.length) && (
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: 10, marginBottom: 20
              }}>
                {product.thickness && (
                  <div style={{ padding: 14, background: '#F0FDF4', borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('thickness') || 'Qalinlik'}</div>
                    <div style={{ fontWeight: 800, color: '#00A651', fontSize: '1.125rem', marginTop: 4 }}>{product.thickness} mkm</div>
                  </div>
                )}
                {product.width && (
                  <div style={{ padding: 14, background: '#F0FDF4', borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('width') || 'Eni'}</div>
                    <div style={{ fontWeight: 800, color: '#00A651', fontSize: '1.125rem', marginTop: 4 }}>{product.width} m</div>
                  </div>
                )}
                {product.length && (
                  <div style={{ padding: 14, background: '#F0FDF4', borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('length') || 'Uzunlik'}</div>
                    <div style={{ fontWeight: 800, color: '#00A651', fontSize: '1.125rem', marginTop: 4 }}>{product.length} m</div>
                  </div>
                )}
                {product.uvProtection && (
                  <div style={{ padding: 14, background: '#FFFBEB', borderRadius: 12, textAlign: 'center' }}>
                    <Sun size={16} style={{ color: '#F59E0B', margin: '0 auto 4px', display: 'block' }} />
                    <div style={{ fontWeight: 700, color: '#F59E0B', fontSize: '0.75rem' }}>{t('uvProtection')}</div>
                  </div>
                )}
              </div>
            )}

            {/* Stock */}
            <div style={{
              marginBottom: 24, padding: '12px 20px',
              background: product.stock > 0 ? '#F0FDF4' : '#FEF2F2',
              borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 8,
              border: `1px solid ${product.stock > 0 ? '#BBF7D0' : '#FECACA'}`
            }}>
              <Package size={16} color={product.stock > 0 ? '#16A34A' : '#DC2626'} />
              <span style={{ fontWeight: 600, fontSize: '0.875rem', color: product.stock > 0 ? '#15803D' : '#DC2626' }}>
                {product.stock > 0 ? `${t('inStock') || 'Mavjud'}: ${product.stock} dona` : t('outOfStock') || 'Hozirda mavjud emas'}
              </span>
            </div>

            {product.stock > 0 && (
              <>
                <div className="quantity-selector">
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>{t('quantity') || 'Miqdor'}:</span>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                </div>

                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleAdd}
                  style={{ width: '100%', borderRadius: 12, padding: '16px', fontSize: '1rem' }}
                  id="add-to-cart-detail"
                >
                  <ShoppingCart size={20} />
                  {added ? (t('addedToCart') || "Savatga qo'shildi!") : t('addToCart') || "Savatga qo'shish"}
                </button>

                <p style={{ textAlign: 'center', marginTop: 12, fontSize: '0.875rem', color: '#64748B' }}>
                  {t('total') || 'Jami'}: {(product.price * quantity).toLocaleString()} {t('som')}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "zoom-out",
          }}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: "absolute", top: 20, right: 20, zIndex: 10,
              width: 44, height: 44, borderRadius: 999,
              background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(8px)",
            }}
          >
            <X size={20} />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => (i - 1 + images.length) % images.length); }}
                style={{
                  position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", zIndex: 10,
                  width: 48, height: 48, borderRadius: 999,
                  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => (i + 1) % images.length); }}
                style={{
                  position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", zIndex: 10,
                  width: 48, height: 48, borderRadius: 999,
                  background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <img
            src={images[lightboxIndex] || mainImage}
            alt={productName}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90vw", maxHeight: "85vh",
              objectFit: "contain", borderRadius: 12,
              cursor: "default",
              boxShadow: "0 10px 60px rgba(0,0,0,0.5)",
            }}
            onError={(e) => { e.target.src = getFallback(productName); e.target.onerror = null; }}
          />

          {images.length > 1 && (
            <div style={{
              position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)",
              padding: "8px 18px", borderRadius: 999,
              background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
              color: "#fff", fontWeight: 700, fontSize: "0.85rem",
              border: "1px solid rgba(255,255,255,0.15)",
            }}>
              {lightboxIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
