import { useState, useEffect } from 'react';
import { api } from '../../api';
import { useLanguage } from '../../context/LanguageContext';
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

export default function AdminAnalytics() {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard()
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;
  if (!stats) return <div className="empty-state"><h3>{t('dataLoadError')}</h3></div>;

  const revenueData = {
    labels: stats.monthlyRevenue.map(m => months[m._id.month - 1]),
    datasets: [
      {
        label: t('revenueLabel'),
        data: stats.monthlyRevenue.map(m => m.revenue),
        borderColor: '#6366F1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6366F1',
        pointRadius: 5,
      },
      {
        label: t('dailyOrdersCountLabel'),
        data: stats.monthlyRevenue.map(m => m.orders),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10B981',
        pointRadius: 5,
        yAxisID: 'y1'
      }
    ]
  };

  const dailyRevenueData = {
    labels: stats.dailyOrders.map(d => d._id.slice(5)),
    datasets: [{
      label: t('dailyRevenueLabel'),
      data: stats.dailyOrders.map(d => d.revenue),
      backgroundColor: 'rgba(99, 102, 241, 0.7)',
      borderRadius: 6,
    }]
  };

  const dailyCountData = {
    labels: stats.dailyOrders.map(d => d._id.slice(5)),
    datasets: [{
      label: t('ordersLabel'),
      data: stats.dailyOrders.map(d => d.count),
      backgroundColor: 'rgba(16, 185, 129, 0.7)',
      borderRadius: 6,
    }]
  };

  const statusLabels = {
    kutilmoqda: t('statusPending'),
    qabul_qilindi: t('statusAccepted'),
    tayyorlanmoqda: t('statusPreparing'),
    yuklandi: t('statusLoaded'),
    yuborildi: t('statusSent'),
    yetkazildi: t('statusDelivered')
  };

  const statusData = {
    labels: stats.ordersByStatus.map(s => statusLabels[s._id] || s._id),
    datasets: [{
      data: stats.ordersByStatus.map(s => s.count),
      backgroundColor: ['#F59E0B', '#3B82F6', '#6366F1', '#0EA5E9', '#8B5CF6', '#10B981'],
      borderWidth: 0,
    }]
  };

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#f1f5f9' }, beginAtZero: true }
    }
  };

  const dualAxisOpts = {
    ...chartOpts,
    scales: {
      ...chartOpts.scales,
      y1: {
        type: 'linear',
        position: 'right',
        grid: { display: false },
        beginAtZero: true
      }
    }
  };

  const barOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#f1f5f9' }, beginAtZero: true }
    }
  };

  // Calculate averages
  const avgOrderValue = stats.totalOrders > 0
    ? Math.round(stats.totalRevenue / stats.totalOrders)
    : 0;

  return (
    <div className="fade-in">
      <div className="admin-header">
        <h1 className="admin-title">{t('analyticsTitle')}</h1>
      </div>

      {/* Key metrics */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="stat-card">
          <div>
            <div className="stat-value">{stats.totalRevenue.toLocaleString()}</div>
            <div className="stat-label">{t('totalRevenueLabel')}</div>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-value">{avgOrderValue.toLocaleString()}</div>
            <div className="stat-label">{t('avgOrderValueLabel')}</div>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-value">{stats.totalOrders}</div>
            <div className="stat-label">{t('totalOrdersLabel')}</div>
          </div>
        </div>
        <div className="stat-card">
          <div>
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">{t('totalUsersLabel')}</div>
          </div>
        </div>
      </div>

      {/* Revenue chart */}
      <div className="chart-container" style={{ marginBottom: 'var(--space-6)' }}>
        <h3 className="chart-title">{t('monthlyRevenueOrdersChart')}</h3>
        <div style={{ height: 350 }}>
          <Line data={revenueData} options={dualAxisOpts} />
        </div>
      </div>

      {/* Daily charts */}
      <div className="charts-grid">
        <div className="chart-container">
          <h3 className="chart-title">{t('dailyRevenueChart')}</h3>
          <div style={{ height: 300 }}>
            <Bar data={dailyRevenueData} options={barOpts} />
          </div>
        </div>
        <div className="chart-container">
          <h3 className="chart-title">{t('dailyOrdersChart')}</h3>
          <div style={{ height: 300 }}>
            <Bar data={dailyCountData} options={barOpts} />
          </div>
        </div>
      </div>

      {/* Status pie */}
      <div className="chart-container" style={{ marginTop: 'var(--space-6)', maxWidth: 500 }}>
        <h3 className="chart-title">{t('orderStatusesDistributionChart')}</h3>
        <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Doughnut data={statusData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
        </div>
      </div>
    </div>
  );
}
