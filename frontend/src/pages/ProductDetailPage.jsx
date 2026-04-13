import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Package, Sun } from 'lucide-react';
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

  useEffect(() => {
    setLoading(true);
    api.getProduct(id)
      .then(res => setProduct(res.data))
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
          <div style={{ background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0', padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={product.image || `https://placehold.co/600x400/f0fdf4/16a34a?text=${encodeURIComponent(productName)}`}
              alt={productName}
              className="product-detail-image"
              style={{ border: 'none', background: 'transparent' }}
            />
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
                    <div style={{ fontWeight: 700, color: '#F59E0B', fontSize: '0.75rem' }}>UV himoya</div>
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
    </div>
  );
}
