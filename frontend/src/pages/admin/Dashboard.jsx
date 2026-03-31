import { useState, useEffect } from 'react';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { api } from '../../api';
import StatusBadge from '../../components/StatusBadge';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend, Filler
);

const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard()
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;
  if (!stats) return <div className="empty-state"><h3>Ma'lumot yuklanmadi</h3></div>;

  const avgOrderValue = stats.totalOrders > 0
    ? Math.round(stats.totalRevenue / stats.totalOrders) : 0;

  const revenueData = {
    labels: stats.monthlyRevenue.map(m => months[m._id.month - 1] + ' ' + m._id.year),
    datasets: [
      {
        label: 'Daromad (so\'m)',
        data: stats.monthlyRevenue.map(m => m.revenue),
        borderColor: '#6366F1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6366F1',
      },
      {
        label: 'Buyurtmalar',
        data: stats.monthlyRevenue.map(m => m.orders),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10B981',
        yAxisID: 'y1'
      }
    ]
  };

  const dailyRevenueData = {
    labels: stats.dailyOrders.map(d => d._id.slice(5)),
    datasets: [{
      label: 'Kunlik daromad',
      data: stats.dailyOrders.map(d => d.revenue),
      backgroundColor: 'rgba(99, 102, 241, 0.7)',
      borderRadius: 6,
    }]
  };

  const dailyCountData = {
    labels: stats.dailyOrders.map(d => d._id.slice(5)),
    datasets: [{
      label: 'Buyurtmalar soni',
      data: stats.dailyOrders.map(d => d.count),
      backgroundColor: 'rgba(16, 185, 129, 0.7)',
      borderRadius: 6,
    }]
  };

  const statusLabels = {
    kutilmoqda: 'Kutilmoqda',
    qabul_qilindi: 'Qabul qilindi',
    tayyorlanmoqda: 'Tayyorlanmoqda',
    yetkazildi: 'Yetkazildi'
  };

  const statusData = {
    labels: stats.ordersByStatus.map(s => statusLabels[s._id] || s._id),
    datasets: [{
      data: stats.ordersByStatus.map(s => s.count),
      backgroundColor: ['#F59E0B', '#3B82F6', '#6366F1', '#10B981'],
      borderWidth: 0,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#f1f5f9' }, beginAtZero: true }
    }
  };

  const dualAxisOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#f1f5f9' }, beginAtZero: true },
      y1: { type: 'linear', position: 'right', grid: { display: false }, beginAtZero: true }
    }
  };

  return (
    <div className="fade-in">
      <div className="admin-header">
        <h1 className="admin-title">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-accent-bg)', color: 'var(--color-accent)' }}>
            <ShoppingCart size={24} />
          </div>
          <div>
            <div className="stat-value">{stats.totalOrders}</div>
            <div className="stat-label">Jami buyurtmalar</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div className="stat-value">{stats.totalRevenue.toLocaleString()}</div>
            <div className="stat-label">Jami daromad (so'm)</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Foydalanuvchilar</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
            <Package size={24} />
          </div>
          <div>
            <div className="stat-value">{stats.totalProducts}</div>
            <div className="stat-label">Mahsulotlar</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="stat-value">{avgOrderValue.toLocaleString()}</div>
            <div className="stat-label">O'rtacha buyurtma (so'm)</div>
          </div>
        </div>
      </div>

      {/* Revenue + Orders Chart */}
      <div className="chart-container" style={{ marginBottom: 'var(--space-6)' }}>
        <h3 className="chart-title">Oylik daromad va buyurtmalar</h3>
        <div style={{ height: 300 }}>
          <Line data={revenueData} options={dualAxisOpts} />
        </div>
      </div>

      {/* Daily Charts */}
      <div className="charts-grid">
        <div className="chart-container">
          <h3 className="chart-title">Kunlik daromad (30 kun)</h3>
          <div style={{ height: 260 }}>
            <Bar data={dailyRevenueData} options={chartOptions} />
          </div>
        </div>
        <div className="chart-container">
          <h3 className="chart-title">Kunlik buyurtmalar (30 kun)</h3>
          <div style={{ height: 260 }}>
            <Bar data={dailyCountData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Status + Recent Orders */}
      <div className="charts-grid" style={{ marginTop: 'var(--space-6)' }}>
        <div className="chart-container">
          <h3 className="chart-title">Buyurtma statuslari</h3>
          <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Doughnut data={statusData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">So'nggi buyurtmalar</h3>
          <div style={{ maxHeight: 280, overflow: 'auto' }}>
            {stats.recentOrders.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-8)' }}>Buyurtmalar yo'q</p>
            ) : (
              stats.recentOrders.map(order => (
                <div key={order._id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-border-light)',
                  fontSize: 'var(--font-size-sm)'
                }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{order.orderNumber}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                      {order.user?.name || 'Noma\'lum'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <StatusBadge status={order.status} />
                    <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', marginTop: 2 }}>
                      {order.finalPrice.toLocaleString()} so'm
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
