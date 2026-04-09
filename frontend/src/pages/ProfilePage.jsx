import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Package, Mail, Phone, Shield, ChevronRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api';
import StatusBadge from '../components/StatusBadge';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
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
    <div className="fade-in">
      {/* Hero */}
      <section style={{
        background: '#0F172A', color: '#fff',
        padding: 'calc(var(--header-height) + 60px) 0 80px',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,166,81,0.08) 0%, transparent 70%)'
        }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, #00A651, #0EA5E9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0,166,81,0.3)'
            }}>
              <User size={36} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, marginBottom: 4 }}>{user?.name}</h1>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', color: '#94A3B8', fontSize: '0.9375rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={14} /> {user?.email}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={14} /> {user?.phone}</span>
                {user?.role === 'admin' && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#F59E0B' }}><Shield size={14} /> Admin</span>
                )}
              </div>
            </div>
            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.05)', color: '#fff',
              fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem',
              transition: 'all 0.2s', fontFamily: 'var(--font-family)'
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; e.currentTarget.style.color = '#FCA5A5'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}
            >
              <LogOut size={16} /> {t('logout')}
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 16, marginTop: 32, flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, padding: '16px 24px', minWidth: 140
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{orders.length}</div>
              <div style={{ color: '#94A3B8', fontSize: '0.8125rem', fontWeight: 500 }}>{t('cartTitle') || 'Buyurtmalar'}</div>
            </div>
            {user?.role === 'admin' && (
              <Link to="/admin" style={{
                background: 'rgba(0,166,81,0.12)', border: '1px solid rgba(0,166,81,0.3)',
                borderRadius: 12, padding: '16px 24px', minWidth: 140,
                textDecoration: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: 12,
                transition: 'all 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,166,81,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,166,81,0.12)'; }}
              >
                <Shield size={20} color="#00A651" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{t('adminPanel')}</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>Dashboard</div>
                </div>
                <ChevronRight size={16} color="#64748B" style={{ marginLeft: 'auto' }} />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Orders */}
      <section className="section" style={{ background: '#fff', minHeight: 400 }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(15,23,42,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <ShoppingBag size={20} color="#0F172A" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
              {t('cartTitle') || 'Buyurtmalar tarixi'}
            </h2>
          </div>

          {loading ? (
            <div className="loading-page"><div className="spinner"></div></div>
          ) : orders.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 20px',
              background: '#F8FAFC', borderRadius: 16, border: '1px solid #E2E8F0'
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(15,23,42,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Package size={32} color="#94A3B8" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Buyurtmalar yo'q</h3>
              <p style={{ color: '#64748B', fontSize: '0.9375rem', marginBottom: 24 }}>Siz hali buyurtma bermadingiz</p>
              <Link to="/products" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 28px', borderRadius: 8,
                background: '#0F172A', color: '#fff',
                fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none'
              }}>
                {t('products')} <ChevronRight size={16} />
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {orders.map(order => (
                <div key={order._id} style={{
                  background: '#F8FAFC', border: '1px solid #E2E8F0',
                  borderRadius: 12, padding: 24, transition: 'box-shadow 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#0F172A' }}>{order.orderNumber}</span>
                      <span style={{ color: '#64748B', fontSize: '0.8125rem', marginLeft: 12 }}>
                        {new Date(order.createdAt).toLocaleDateString('uz-UZ')}
                      </span>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < order.items.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
                        <span style={{ color: '#334155', fontSize: '0.875rem' }}>{item.name} × {item.quantity}</span>
                        <span style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.875rem' }}>{(item.price * item.quantity).toLocaleString()} {t('som')}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '0.8125rem', color: '#64748B' }}>📍 {order.shippingAddress}</span>
                    <span style={{ fontWeight: 800, fontSize: '1.125rem', color: '#0F172A' }}>
                      {order.finalPrice.toLocaleString()} {t('som')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
