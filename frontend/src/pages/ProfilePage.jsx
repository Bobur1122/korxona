import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import StatusBadge from '../components/StatusBadge';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyOrders()
      .then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-page fade-in">
      <div className="container">
        {/* Profile Info */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-light)',
          borderRadius: 'var(--radius-2xl)',
          padding: 'var(--space-8)',
          marginBottom: 'var(--space-8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-4)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-accent-bg)',
              color: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>{user?.name}</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                {user?.email} • {user?.phone}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost" id="logout-button">
            <LogOut size={18} /> Chiqish
          </button>
        </div>

        {/* Orders */}
        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
          <Package size={22} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
          Buyurtmalar tarixi
        </h2>

        {loading ? (
          <div className="loading-page"><div className="spinner"></div></div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <Package size={48} />
            <h3>Buyurtmalar yo'q</h3>
            <p>Siz hali buyurtma bermadingiz</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-number">{order.orderNumber}</span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginLeft: 'var(--space-3)' }}>
                    {new Date(order.createdAt).toLocaleDateString('uz-UZ')}
                  </span>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="order-items-list">
                {order.items.map((item, i) => (
                  <div key={i} className="order-item">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{(item.price * item.quantity).toLocaleString()} so'm</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  📍 {order.shippingAddress}
                </span>
                <span style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>
                  {order.finalPrice.toLocaleString()} so'm
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
