import { useEffect, useMemo, useState } from 'react';
import { api } from '../../api';
import StatusBadge, { ORDER_STATUS_FLOW, ORDER_STATUS_META, getStatusIndex } from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { rangeLastDays, rangeThisMonth } from '../../utils/datePeriod';

const LANGUAGE_LOCALE = {
  uz: 'uz-UZ',
  ru: 'ru-RU',
  en: 'en-US',
};

const PAYMENT_PLANS = [
  { value: 'oldindan', label: "Oldindan to'lov" },
  { value: 'avans', label: 'Avans' },
  { value: 'yuklangandan_keyin', label: 'Yuklangandan keyin' },
];

const PAYMENT_STATUSES = [
  { value: 'kutilmoqda', label: 'Kutilmoqda' },
  { value: 'tushdi', label: 'Pul tushdi' },
];

function emptyCreateForm() {
  return {
    customerName: '',
    companyName: '',
    phone: '',
    shippingAddress: '',
    notes: '',
    paymentPlan: 'avans',
    items: [{ product: '', quantity: 1 }],
  };
}

export default function AdminOrders() {
  const { t, language, tl } = useLanguage();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');
  const [createForm, setCreateForm] = useState(emptyCreateForm());
  const [showCreateForm, setShowCreateForm] = useState(user?.role === 'hodim');

  const canChangeStatus = user?.role === 'admin' || user?.role === 'direktor';
  const canCreateOffline = ['admin', 'direktor', 'hodim'].includes(user?.role);
  const locale = LANGUAGE_LOCALE[language] || 'uz-UZ';

  const statusOptions = useMemo(
    () =>
      ORDER_STATUS_FLOW.map((status) => ({
        value: status,
        label: t(ORDER_STATUS_META[status].labelKey),
        icon: ORDER_STATUS_META[status].icon,
      })),
    [t]
  );

  const productMap = useMemo(() => {
    const map = new Map();
    products.forEach((p) => map.set(p._id, p));
    return map;
  }, [products]);

  const fetchOrders = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterStatus) params.set('status', filterStatus);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    params.set('limit', '500');
    api
      .getAllOrders(params.toString())
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, startDate, endDate]);

  useEffect(() => {
    if (!canCreateOffline) return;
    let cancelled = false;

    const loadProducts = async () => {
      setProductsLoading(true);
      setProductsError('');
      try {
        const res = await api.getAllProducts();
        if (!cancelled) {
          setProducts((res.data || []).filter((p) => p.isActive !== false));
        }
      } catch {
        try {
          const fallback = await api.getProducts('page=1&limit=5000');
          if (!cancelled) {
            setProducts((fallback.data || []).filter((p) => p.isActive !== false));
          }
        } catch (err2) {
          if (!cancelled) {
            setProducts([]);
            setProductsError(err2.message || 'Mahsulotlar yuklanmadi');
          }
        }
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    };

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, [canCreateOffline]);

  useEffect(() => {
    if (user?.role === 'hodim') setShowCreateForm(true);
  }, [user?.role]);

  const handleStatusChange = async (orderId, currentStatus, newStatus) => {
    const currentIndex = getStatusIndex(currentStatus);
    const nextIndex = getStatusIndex(newStatus);

    if (nextIndex < currentIndex) {
      alert(t('statusRollbackError'));
      return;
    }
    if (currentStatus === newStatus) return;

    try {
      await api.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePaymentStatusChange = async (orderId, newPaymentStatus) => {
    try {
      await api.updateOrderPaymentStatus(orderId, newPaymentStatus);
      fetchOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  const setCreateItemField = (index, key, value) => {
    setCreateForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    }));
  };

  const addCreateItem = () => {
    setCreateForm((prev) => ({
      ...prev,
      items: [...prev.items, { product: '', quantity: 1 }],
    }));
  };

  const removeCreateItem = (index) => {
    if (createForm.items.length === 1) {
      setCreateForm((prev) => ({ ...prev, items: [{ product: '', quantity: 1 }] }));
      return;
    }
    setCreateForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const createOfflineOrder = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreateSuccess('');

    const normalizedItems = createForm.items
      .filter((item) => item.product)
      .map((item) => ({ product: item.product, quantity: Number(item.quantity) }));

    if (!createForm.customerName.trim()) {
      setCreateError('Mijoz ismini kiriting');
      return;
    }
    if (!createForm.companyName.trim()) {
      setCreateError('Kompaniya nomini kiriting');
      return;
    }
    if (!createForm.phone.trim() || !createForm.shippingAddress.trim()) {
      setCreateError('Telefon va manzil majburiy');
      return;
    }
    if (normalizedItems.length === 0) {
      setCreateError('Kamida 1 ta mahsulot tanlang');
      return;
    }
    if (normalizedItems.some((item) => !item.quantity || item.quantity < 1)) {
      setCreateError("Miqdor kamida 1 bo'lishi kerak");
      return;
    }

    setCreating(true);
    try {
      await api.createOrder({
        customerName: createForm.customerName.trim(),
        companyName: createForm.companyName.trim(),
        phone: createForm.phone.trim(),
        shippingAddress: createForm.shippingAddress.trim(),
        notes: createForm.notes.trim() || undefined,
        paymentPlan: createForm.paymentPlan,
        orderSource: 'offline',
        items: normalizedItems,
      });
      setCreateSuccess("Buyurtma muvaffaqiyatli qo'shildi");
      setCreateForm(emptyCreateForm());
      fetchOrders();
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading && orders.length === 0) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <div className="admin-header">
        <h1 className="admin-title">{t('adminOrders')}</h1>
        <span className="badge badge-accent">{orders.length} ta</span>
      </div>

      {canCreateOffline && (
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-5)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
            <h3 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>Buyurtma qo'shish</h3>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowCreateForm((v) => !v)}>
              {showCreateForm ? 'Yopish' : 'Ochish'}
            </button>
          </div>

          {showCreateForm && (
            <form onSubmit={createOfflineOrder}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Mijoz ismi</label>
                  <input
                    className="form-input"
                    value={createForm.customerName}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, customerName: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Kompaniya nomi</label>
                  <input
                    className="form-input"
                    value={createForm.companyName}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, companyName: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">{t('phone')}</label>
                  <input
                    className="form-input"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">{t('shippingAddress')}</label>
                  <input
                    className="form-input"
                    value={createForm.shippingAddress}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, shippingAddress: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                  <label className="form-label">To'lov turi</label>
                  <select
                    className="form-select"
                    value={createForm.paymentPlan}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, paymentPlan: e.target.value }))}
                  >
                    {PAYMENT_PLANS.map((plan) => (
                      <option key={plan.value} value={plan.value}>{plan.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: 'var(--space-3)', marginBottom: 0 }}>
                <label className="form-label">{t('note')}</label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={createForm.notes}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <div style={{ marginTop: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                  <strong>Mahsulotlar</strong>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={addCreateItem}>+ Qator qo'shish</button>
                </div>
                {productsError && <div className="alert alert-error" style={{ marginBottom: 'var(--space-2)' }}>{productsError}</div>}
                <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                  {createForm.items.map((item, index) => (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 46px', gap: 'var(--space-2)', alignItems: 'center' }}>
                      <select
                        className="form-select"
                        value={item.product}
                        onChange={(e) => setCreateItemField(index, 'product', e.target.value)}
                      >
                        <option value="">
                          {productsLoading ? 'Mahsulotlar yuklanmoqda...' : products.length === 0 ? 'Mahsulot topilmadi' : 'Mahsulot tanlang'}
                        </option>
                        {products.map((product) => (
                          <option key={product._id} value={product._id}>
                            {(tl(product, 'name') || product.name || 'Mahsulot')} - {Number(product.price || 0).toLocaleString(locale)} {t('som')}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min={1}
                        className="form-input"
                        value={item.quantity}
                        onChange={(e) => setCreateItemField(index, 'quantity', e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => removeCreateItem(index)}
                        title="Qatorni o'chirish"
                        style={{ minWidth: 0, width: 46, padding: 0, color: '#DC2626' }}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {createError && <div className="alert alert-error" style={{ marginTop: 'var(--space-3)' }}>{createError}</div>}
              {createSuccess && <div className="alert alert-success" style={{ marginTop: 'var(--space-3)' }}>{createSuccess}</div>}

              <div style={{ marginTop: 'var(--space-3)' }}>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? 'Saqlanmoqda...' : "Qo'ng'iroq orqali buyurtma qo'shish"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4)',
        marginBottom: 'var(--space-5)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 'var(--space-3)' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: 'var(--font-size-xs)' }}>Boshlanish sana</label>
            <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: 'var(--font-size-xs)' }}>Tugash sana</label>
            <input type="date" className="form-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: 'var(--font-size-xs)' }}>{t('status')}</label>
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              id="order-status-filter"
            >
              <option value="">{t('allStatuses')}</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-3)' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              const r = rangeLastDays(7);
              setStartDate(r.start);
              setEndDate(r.end);
            }}
          >
            Oxirgi 7 kun
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              const r = rangeLastDays(30);
              setStartDate(r.start);
              setEndDate(r.end);
            }}
          >
            Oxirgi 30 kun
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              const r = rangeThisMonth();
              setStartDate(r.start);
              setEndDate(r.end);
            }}
          >
            Bu oy
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setStartDate('');
              setEndDate('');
              setFilterStatus('');
            }}
          >
            Tozalash
          </button>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('orderNumber')}</th>
              <th>{t('customer')}</th>
              <th>Kompaniya</th>
              <th>{t('phone')}</th>
              <th>Manba</th>
              <th>{t('productsInOrder')}</th>
              <th>{t('amount')}</th>
              <th>{t('status')}</th>
              <th>To'lov</th>
              <th>{t('orderDate')}</th>
              {canChangeStatus && <th>{t('changeStatus')}</th>}
              {canChangeStatus && <th>To'lov status</th>}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const currentIndex = getStatusIndex(order.status);
              const canMarkPaid = getStatusIndex(order.status) >= getStatusIndex('yuklandi');
              const customerLabel = order.customerName || order.user?.name || order.phone || t('unknownUser');
              return (
                <tr key={order._id}>
                  <td style={{ fontWeight: 600 }}>{order.orderNumber}</td>
                  <td>{customerLabel}</td>
                  <td>{order.companyName || '-'}</td>
                  <td>{order.phone}</td>
                  <td>
                    <span className={`badge ${order.orderSource === 'offline' ? 'badge-info' : 'badge-accent'}`}>
                      {order.orderSource === 'offline' ? "Qo'ng'iroq orqali" : 'Online'}
                    </span>
                  </td>
                  <td>
                    <div style={{ maxWidth: 260 }}>
                      {order.items.map((item, i) => {
                        const product = productMap.get(item.product?._id || item.product);
                        const localizedName = tl(item.product, 'name') || tl(product, 'name') || item.name;
                        return (
                          <div key={i} style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                            {localizedName} x {item.quantity}
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{order.finalPrice.toLocaleString(locale)} {t('som')}</td>
                  <td><StatusBadge status={order.status} /></td>
                  <td style={{ fontSize: 'var(--font-size-xs)' }}>
                    <div style={{ marginBottom: 4 }}>
                      {PAYMENT_PLANS.find((p) => p.value === order.paymentPlan)?.label || order.paymentPlan || '-'}
                    </div>
                    <span className={`badge ${order.paymentStatus === 'tushdi' ? 'badge-success' : 'badge-warning'}`}>
                      {order.paymentStatus === 'tushdi' ? 'Pul tushdi' : 'Kutilmoqda'}
                    </span>
                  </td>
                  <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                    {new Date(order.createdAt).toLocaleDateString(locale)}
                  </td>
                  {canChangeStatus && (
                    <td>
                      <select
                        className="form-select"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, order.status, e.target.value)}
                        style={{ minWidth: 170, fontSize: 'var(--font-size-xs)', padding: 'var(--space-2)' }}
                      >
                        {statusOptions.map((option, index) => (
                          <option key={option.value} value={option.value} disabled={index < currentIndex}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  )}
                  {canChangeStatus && (
                    <td>
                      <select
                        className="form-select"
                        value={order.paymentStatus || 'kutilmoqda'}
                        onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                        style={{ minWidth: 150, fontSize: 'var(--font-size-xs)', padding: 'var(--space-2)' }}
                      >
                        {PAYMENT_STATUSES.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            disabled={option.value === 'tushdi' && !canMarkPaid}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="empty-state">
            <h3>{t('noOrders')}</h3>
          </div>
        )}
      </div>
    </div>
  );
}
