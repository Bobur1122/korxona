import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Package, Sun, Ruler } from 'lucide-react';
import { api } from '../api';
import { useCart } from '../context/CartContext';

const categoryLabels = {
  "oddiy": "Oddiy plyonka",
  "uv_plyonka": "UV himoyali",
  "kop_qavatli": "Ko'p qavatli",
  "maxsus": "Maxsus plyonka",
  "boshqa": "Boshqa"
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
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
      <div className="empty-state" style={{ padding: 'var(--space-24)' }}>
        <Package size={48} />
        <h3>Mahsulot topilmadi</h3>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
          Mahsulotlarga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div className="product-detail fade-in">
      <div className="container">
        <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', fontSize: 'var(--font-size-sm)' }}>
          <ArrowLeft size={16} /> Mahsulotlarga qaytish
        </Link>

        <div className="product-detail-grid">
          <img
            src={product.image || `https://placehold.co/600x600/f0fdf4/16a34a?text=${encodeURIComponent(product.name)}`}
            alt={product.name}
            className="product-detail-image"
          />

          <div className="product-detail-info">
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <span className="badge badge-accent">
                {categoryLabels[product.category] || product.category}
              </span>
            </div>

            <h1>{product.name}</h1>

            <div className="product-detail-price">
              {product.price.toLocaleString()} so'm
            </div>

            <p className="product-detail-desc">{product.description}</p>

            {/* Plyonka xususiyatlari */}
            {(product.thickness || product.width || product.length) && (
              <div style={{ 
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 'var(--space-3)', marginBottom: 'var(--space-4)'
              }}>
                {product.thickness && (
                  <div style={{ padding: 'var(--space-3)', background: 'var(--color-accent-bg)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Qalinlik</div>
                    <div style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{product.thickness} mkm</div>
                  </div>
                )}
                {product.width && (
                  <div style={{ padding: 'var(--space-3)', background: 'var(--color-accent-bg)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Eni</div>
                    <div style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{product.width} m</div>
                  </div>
                )}
                {product.length && (
                  <div style={{ padding: 'var(--space-3)', background: 'var(--color-accent-bg)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Uzunlik</div>
                    <div style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{product.length} m</div>
                  </div>
                )}
                {product.uvProtection && (
                  <div style={{ padding: 'var(--space-3)', background: '#F59E0B15', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                    <Sun size={14} style={{ color: '#F59E0B', margin: '0 auto 2px' }} />
                    <div style={{ fontWeight: 700, color: '#F59E0B', fontSize: 'var(--font-size-xs)' }}>UV himoya</div>
                  </div>
                )}
              </div>
            )}

            <div style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4)', background: product.stock > 0 ? 'var(--color-success-bg)' : 'var(--color-error-bg)', borderRadius: 'var(--radius-lg)', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Package size={16} />
              <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
                {product.stock > 0 ? `Mavjud: ${product.stock} dona` : 'Hozirda mavjud emas'}
              </span>
            </div>

            {product.stock > 0 && (
              <>
                <div className="quantity-selector">
                  <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>Miqdor:</span>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                </div>

                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleAdd}
                  style={{ width: '100%' }}
                  id="add-to-cart-detail"
                >
                  <ShoppingCart size={20} />
                  {added ? '✓ Savatga qo\'shildi!' : 'Savatga qo\'shish'}
                </button>

                <p style={{ textAlign: 'center', marginTop: 'var(--space-3)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                  Jami: {(product.price * quantity).toLocaleString()} so'm
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
