import { useEffect, useMemo, useState } from 'react';
import { api } from '../../api';
import StatusBadge, { ORDER_STATUS_FLOW, ORDER_STATUS_META, getStatusIndex } from '../../components/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';

const LANGUAGE_LOCALE = {
  uz: 'uz-UZ',
  ru: 'ru-RU',
  en: 'en-US',
};

export default function AdminOrders() {
  const { t, language, tl } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

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

  const fetchOrders = () => {
    setLoading(true);
    const params = filterStatus ? `status=${filterStatus}` : '';
    api
      .getAllOrders(params)
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

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

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <div className="admin-header">
        <h1 className="admin-title">{t('adminOrders')}</h1>
        <select
          className="form-select"
          style={{ maxWidth: 220 }}
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

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('orderNumber')}</th>
              <th>{t('customer')}</th>
              <th>{t('phone')}</th>
              <th>{t('productsInOrder')}</th>
              <th>{t('amount')}</th>
              <th>{t('status')}</th>
              <th>{t('orderDate')}</th>
              <th>{t('changeStatus')}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const currentIndex = getStatusIndex(order.status);
              return (
                <tr key={order._id}>
                  <td style={{ fontWeight: 600 }}>{order.orderNumber}</td>
                  <td>{order.user?.name || t('unknownUser')}</td>
                  <td>{order.phone}</td>
                  <td>
                    <div style={{ maxWidth: 240 }}>
                      {order.items.map((item, i) => {
                        const localizedName = tl(item.product, 'name') || item.name;
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
                  <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                    {new Date(order.createdAt).toLocaleDateString(locale)}
                  </td>
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
