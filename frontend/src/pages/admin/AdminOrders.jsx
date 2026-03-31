import { useState, useEffect } from 'react';
import { api } from '../../api';
import StatusBadge, { STATUS_LABELS } from '../../components/StatusBadge';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    const params = filterStatus ? `status=${filterStatus}` : '';
    api.getAllOrders(params)
      .then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [filterStatus]);

  const handleStatusChange = async (orderId, newStatus) => {
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
        <h1 className="admin-title">Buyurtmalar</h1>
        <select
          className="form-select"
          style={{ maxWidth: 200 }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          id="order-status-filter"
        >
          <option value="">Barcha statuslar</option>
          {Object.entries(STATUS_LABELS).map(([key, val]) => (
            <option key={key} value={key}>{val.icon} {val.label}</option>
          ))}
        </select>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Raqam</th>
              <th>Mijoz</th>
              <th>Telefon</th>
              <th>Mahsulotlar</th>
              <th>Jami</th>
              <th>Status</th>
              <th>Sana</th>
              <th>O'zgartirish</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td style={{ fontWeight: 600 }}>{order.orderNumber}</td>
                <td>{order.user?.name || 'Noma\'lum'}</td>
                <td>{order.phone}</td>
                <td>
                  <div style={{ maxWidth: 200 }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                        {item.name} ×{item.quantity}
                      </div>
                    ))}
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{order.finalPrice.toLocaleString()} so'm</td>
                <td><StatusBadge status={order.status} /></td>
                <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                  {new Date(order.createdAt).toLocaleDateString('uz-UZ')}
                </td>
                <td>
                  <select
                    className="form-select"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    style={{ minWidth: 150, fontSize: 'var(--font-size-xs)', padding: 'var(--space-2)' }}
                  >
                    {Object.entries(STATUS_LABELS).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="empty-state">
            <h3>Buyurtmalar yo'q</h3>
          </div>
        )}
      </div>
    </div>
  );
}
