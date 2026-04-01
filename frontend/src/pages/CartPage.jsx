import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, discountAmount, finalPrice, promoCode, applyPromo, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handlePromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      const res = await api.validatePromo(promoInput.trim());
      applyPromo(res.data.code, res.data.discountPercent);
    } catch (err) {
      setPromoError(err.message);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!address.trim() || !phone.trim()) {
      setOrderError('Manzil va telefon raqam kiritilishi shart');
      return;
    }

    setOrderLoading(true);
    setOrderError('');
    try {
      await api.createOrder({
        items: items.map(i => ({ product: i.product, quantity: i.quantity })),
        shippingAddress: address,
        phone,
        notes,
        promoCode: promoCode || undefined
      });
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      setOrderError(err.message);
    } finally {
      setOrderLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="cart-page fade-in">
        <div className="container" style={{ textAlign: 'center', padding: 'var(--space-24) 0' }}>
          <div style={{ fontSize: 64, marginBottom: 'var(--space-4)' }}>🎉</div>
          <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
            Buyurtma qabul qilindi!
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
            Sizning buyurtmangiz muvaffaqiyatli qabul qilindi. Profilingizda buyurtma holatini kuzatishingiz mumkin.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
            <Link to="/profile" className="btn btn-primary">Profilga o'tish</Link>
            <Link to="/products" className="btn btn-outline">Xaridni davom ettirish</Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-page fade-in">
        <div className="container">
          <div className="empty-state">
            <ShoppingCart size={48} />
            <h3>Savat bo'sh</h3>
            <p>Mahsulotlarni ko'rib, savatga qo'shing</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
              Mahsulotlarni ko'rish
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page fade-in">
      <div className="container">
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: 'var(--space-8)' }}>
          Savat ({items.length} ta mahsulot)
        </h1>

        <div className="cart-grid">
          {/* Cart Items */}
          <div>
            {items.map(item => (
              <div key={item.product} className="cart-item">
                <img
                  src={item.image || `https://placehold.co/100x100/f1f5f9/64748b?text=${encodeURIComponent(item.name)}`}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <div className="cart-item-price">{item.price.toLocaleString()} so'm</div>
                  <div className="cart-quantity">
                    <button onClick={() => updateQuantity(item.product, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <button onClick={() => removeItem(item.product)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)' }}>
                    <Trash2 size={16} />
                  </button>
                  <span style={{ fontWeight: 700 }}>
                    {(item.price * item.quantity).toLocaleString()} so'm
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>Buyurtma xulosasi</h3>

            {/* Promo Code */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Promokod"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                disabled={!!promoCode}
                id="promo-code-input"
              />
              <button
                className="btn btn-outline btn-sm"
                onClick={handlePromo}
                disabled={promoLoading || !!promoCode}
                id="apply-promo"
              >
                <Tag size={14} />
              </button>
            </div>
            {promoError && <div className="alert alert-error" style={{ marginBottom: 'var(--space-3)' }}>{promoError}</div>}
            {promoCode && (
              <div className="alert alert-success" style={{ marginBottom: 'var(--space-3)' }}>
                ✓ Promokod "{promoCode}" qo'llanildi
              </div>
            )}

            <div className="cart-summary-row">
              <span>Mahsulotlar:</span>
              <span>{totalPrice.toLocaleString()} so'm</span>
            </div>
            {discountAmount > 0 && (
              <div className="cart-summary-row" style={{ color: 'var(--color-success)' }}>
                <span>Chegirma:</span>
                <span>-{discountAmount.toLocaleString()} so'm</span>
              </div>
            )}
            <div className="cart-summary-row cart-summary-total">
              <span>Jami:</span>
              <span>{finalPrice.toLocaleString()} so'm</span>
            </div>

            {/* Order Form */}
            <form onSubmit={handleOrder} style={{ marginTop: 'var(--space-6)' }}>
              <div className="form-group">
                <label className="form-label">Yetkazish manzili *</label>
                <input
                  type="text"
                  className="form-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="To'liq manzil"
                  required
                  id="shipping-address"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Telefon raqam *</label>
                <input
                  type="tel"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  required
                  id="shipping-phone"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Izoh</label>
                <textarea
                  className="form-input"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Qo'shimcha izoh..."
                  rows={3}
                  id="order-notes"
                ></textarea>
              </div>

              {orderError && <div className="alert alert-error">{orderError}</div>}

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={orderLoading}
                id="place-order"
              >
                {orderLoading ? 'Yuborilmoqda...' : (
                  <>{user ? 'Buyurtma berish' : 'Kirish va buyurtma berish'} <ArrowRight size={18} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
