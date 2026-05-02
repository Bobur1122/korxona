import { useState, useCallback, useEffect } from 'react';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, TrendingDown, Calendar, ArrowRightLeft, Percent, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { api } from '../../api';
import StatusBadge from '../../components/StatusBadge';
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

const MONTHS = ['Yan','Fev','Mar','Apr','May','Iyun','Iyul','Avg','Sen','Okt','Noy','Dek'];

function fmt(d) { return d.toISOString().slice(0, 10); }
function fmtSigned(n) {
  const v = Number(n || 0);
  if (Number.isNaN(v)) return '0';
  const sign = v > 0 ? '+' : '';
  return sign + v.toLocaleString();
}
function pctChange(current, previous) {
  const cur = Number(current || 0);
  const prev = Number(previous || 0);
  if (Number.isNaN(cur) || Number.isNaN(prev)) return undefined;
  if (prev === 0) return cur > 0 ? null : 0; // null => "yangi"
  return Math.round(((cur - prev) / prev) * 100);
}
function thisMonthRange() {
  const n = new Date();
  return { s: fmt(new Date(n.getFullYear(), n.getMonth(), 1)), e: fmt(n) };
}
function prevPeriod(s, e) {
  const ms = new Date(e) - new Date(s);
  const pe = new Date(new Date(s).getTime() - 86400000);
  const ps = new Date(pe.getTime() - ms);
  return { s: fmt(ps), e: fmt(pe) };
}

// ── Change badge ──
function ChangeBadge({ value }) {
  if (value === undefined) return null;
  if (value === null) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 3,
        fontSize: 11, fontWeight: 600,
        color: '#2563EB', background: '#EFF6FF',
        padding: '2px 8px', borderRadius: 10, whiteSpace: 'nowrap',
      }}>yangi</span>
    );
  }
  const pos = value > 0, neg = value < 0;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 2,
      fontSize: 11, fontWeight: 600,
      color: pos ? '#059669' : neg ? '#DC2626' : '#6B7280',
      background: pos ? '#ECFDF5' : neg ? '#FEF2F2' : '#F3F4F6',
      padding: '2px 8px', borderRadius: 10, whiteSpace: 'nowrap',
    }}>
      {pos ? <ArrowUp size={10}/> : neg ? <ArrowDown size={10}/> : <Minus size={10}/>}
      {pos ? '+' : ''}{value}%
    </span>
  );
}

// ── Stat card ──
function StatCard({ icon: Icon, label, value, prevValue, change, diffText, bg, fg, highlight }) {
  const hasComparison = prevValue !== undefined;
  return (
    <div style={{
      background: '#fff', borderRadius: 14, padding: '16px',
      border: highlight ? '2px solid #C4B5FD' : '1px solid #F1F5F9',
      display: 'flex', flexDirection: 'column', minWidth: 0,
    }}>
      {/* Icon + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, background: bg, color: fg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={16} />
        </div>
        <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500, lineHeight: 1.2 }}>{label}</span>
      </div>

      {/* Value */}
      <div style={{ fontSize: 24, fontWeight: 700, color: '#0F172A', lineHeight: 1, fontFamily: 'Inter, system-ui, sans-serif' }}>
        {value}
      </div>

      {/* Comparison row */}
      {hasComparison && (
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <ChangeBadge value={change} />
          <span style={{ fontSize: 11, color: '#94A3B8' }}>
            (avvalgi: {prevValue}{diffText ? `, ${diffText}` : ''})
          </span>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const def = thisMonthRange();
  const [d1Start, setD1Start] = useState(def.s);
  const [d1End, setD1End]     = useState(def.e);
  const [compare, setCompare] = useState(false);
  const [d2Start, setD2Start] = useState('');
  const [d2End, setD2End]     = useState('');
  const [trigger, setTrigger] = useState(0);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    const p = new URLSearchParams();
    p.set('startDate', d1Start);
    p.set('endDate', d1End);
    if (compare && d2Start && d2End) {
      p.set('compareStartDate', d2Start);
      p.set('compareEndDate', d2End);
    }
    api.getDashboard(p.toString())
      .then(r => setStats(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  // eslint-disable-next-line
  }, [trigger]);

  useEffect(() => { load(); }, [load]);

  const apply    = () => setTrigger(t => t + 1);
  const reset    = () => { const d = thisMonthRange(); setD1Start(d.s); setD1End(d.e); setCompare(false); setD2Start(''); setD2End(''); setTimeout(() => setTrigger(t => t + 1), 30); };
  const togComp  = () => {
    const nxt = !compare;
    setCompare(nxt);
    if (nxt) {
      // Period2 = current, Period1 = previous (auto)
      const current = { s: d1Start, e: d1End };
      const previous = prevPeriod(d1Start, d1End);
      setD1Start(previous.s);
      setD1End(previous.e);
      setD2Start(current.s);
      setD2End(current.e);
    } else {
      // Back to single period: keep Period2 (current) as main
      if (d2Start && d2End) { setD1Start(d2Start); setD1End(d2End); }
      setD2Start('');
      setD2End('');
    }
  };

  if (loading) return <div className="loading-page"><div className="spinner"/></div>;
  if (error) return <div className="empty-state"><h3>{error}</h3></div>;
  if (!stats) return <div className="empty-state"><h3>{t('dataLoadError')}</h3></div>;

  const cmp = stats.comparison;
  const hasComparison = Boolean(cmp);
  const current = hasComparison ? cmp : stats;   // Muddat 2 (current) when comparing
  const previous = hasComparison ? stats : null; // Muddat 1 (previous) when comparing
  const margin = current.totalRevenue > 0 ? Math.round((current.totalProfit / current.totalRevenue) * 100) : 0;
  const prevMargin = previous && previous.totalRevenue > 0 ? Math.round((previous.totalProfit / previous.totalRevenue) * 100) : 0;
  const diffText = (cur, prev) => `${t('diffShortLabel')}: ${fmtSigned((cur ?? 0) - (prev ?? 0))}`;

  // ── Cards config ──
  const cards = [
    { icon: ShoppingCart, label: t('totalOrdersLabel'),     val: current.totalOrders, prevVal: previous?.totalOrders, bg: '#EFF6FF', fg: '#2563EB', chg: previous ? pctChange(current.totalOrders, previous.totalOrders) : undefined, diffText: previous ? diffText(current.totalOrders, previous.totalOrders) : undefined },
    { icon: ShoppingCart, label: t('deliveredOrdersLabel'), val: current.deliveredOrders ?? 0, prevVal: previous?.deliveredOrders, bg: '#ECFDF5', fg: '#10B981', chg: previous ? pctChange(current.deliveredOrders ?? 0, previous.deliveredOrders ?? 0) : undefined, diffText: previous ? diffText(current.deliveredOrders ?? 0, previous.deliveredOrders ?? 0) : undefined },
    { icon: DollarSign,   label: t('totalRevenueLabel'),    val: current.totalRevenue.toLocaleString(), prevVal: previous?.totalRevenue?.toLocaleString(), bg: '#F0FDF4', fg: '#16A34A', chg: previous ? pctChange(current.totalRevenue, previous.totalRevenue) : undefined, diffText: previous ? diffText(current.totalRevenue, previous.totalRevenue) : undefined },
    { icon: TrendingDown, label: t('totalCostLabel'),       val: (current.totalCost || 0).toLocaleString(), prevVal: previous ? (previous.totalCost || 0).toLocaleString() : undefined, bg: '#FFFBEB', fg: '#D97706', chg: previous ? pctChange(current.totalCost || 0, previous.totalCost || 0) : undefined, diffText: previous ? diffText(current.totalCost || 0, previous.totalCost || 0) : undefined },
    { icon: TrendingUp,   label: t('realProfitLabel'),      val: (current.totalProfit || 0).toLocaleString(), prevVal: previous ? (previous.totalProfit || 0).toLocaleString() : undefined, bg: '#F5F3FF', fg: '#7C3AED', chg: previous ? pctChange(current.totalProfit || 0, previous.totalProfit || 0) : undefined, highlight: true, diffText: previous ? diffText(current.totalProfit || 0, previous.totalProfit || 0) : undefined },
    { icon: Percent,      label: t('profitMarginLabel'), val: margin + '%', prevVal: previous ? prevMargin + '%' : undefined, bg: '#FFF1F2', fg: '#E11D48', chg: previous ? pctChange(margin, prevMargin) : undefined, diffText: previous ? diffText(margin, prevMargin) : undefined },
    { icon: Users,        label: t('newUsersLabel'),        val: current.newUsers ?? 0, prevVal: previous?.newUsers, bg: '#F0F9FF', fg: '#0284C7', chg: previous ? pctChange(current.newUsers ?? 0, previous.newUsers ?? 0) : undefined, diffText: previous ? diffText(current.newUsers ?? 0, previous.newUsers ?? 0) : undefined },
    { icon: Package,      label: t('newProductsLabel'),     val: current.newProducts ?? 0, prevVal: previous?.newProducts, bg: '#FEF3C7', fg: '#B45309', chg: previous ? pctChange(current.newProducts ?? 0, previous.newProducts ?? 0) : undefined, diffText: previous ? diffText(current.newProducts ?? 0, previous.newProducts ?? 0) : undefined },
  ];

  // ── Charts ──
  const mLabels = current.monthlyRevenue.map(m => MONTHS[m._id.month - 1]);
  const lineDS = [
    { label: t('revenueLabel'), data: current.monthlyRevenue.map(m => m.revenue), borderColor: '#16A34A', backgroundColor: 'rgba(22,163,74,.08)', fill: true, tension: .4, pointRadius: 4, pointBackgroundColor: '#16A34A', borderWidth: 2 },
    { label: t('costLabel'),    data: current.monthlyRevenue.map(m => m.cost||0),  borderColor: '#D97706', backgroundColor: 'rgba(217,119,6,.06)',  fill: true, tension: .4, pointRadius: 3, pointBackgroundColor: '#D97706', borderWidth: 2 },
    { label: t('profitLabel'),  data: current.monthlyRevenue.map(m => (m.revenue||0)-(m.cost||0)), borderColor: '#7C3AED', backgroundColor: 'rgba(124,58,237,.06)', fill: true, tension: .4, pointRadius: 3, pointBackgroundColor: '#7C3AED', borderWidth: 2 },
  ];
  if (previous?.monthlyRevenue?.length) {
    const cmpLabels = previous.monthlyRevenue.map(m => MONTHS[m._id.month - 1]);
    // merge labels
    cmpLabels.forEach(l => { if (!mLabels.includes(l)) mLabels.push(l); });
    lineDS.push(
      { label: `${t('revenueLabel')} (${t('period1')})`, data: previous.monthlyRevenue.map(m => m.revenue), borderColor: '#16A34A', borderDash: [6,4], borderWidth: 1.5, pointRadius: 3, pointStyle: 'triangle', fill: false, tension: .4 },
      { label: `${t('profitLabel')} (${t('period1')})`,  data: previous.monthlyRevenue.map(m => (m.revenue||0)-(m.cost||0)), borderColor: '#7C3AED', borderDash: [6,4], borderWidth: 1.5, pointRadius: 3, pointStyle: 'triangle', fill: false, tension: .4 },
    );
  }

  const dLabels = current.dailyOrders.map(d => d._id.slice(5));
  const barDS = [
    { label: t('revenueLabel'), data: current.dailyOrders.map(d => d.revenue), backgroundColor: '#16A34A', borderRadius: 4 },
    { label: t('costLabel'),    data: current.dailyOrders.map(d => d.cost||0),  backgroundColor: '#F59E0B', borderRadius: 4 },
    { label: t('profitLabel'),  data: current.dailyOrders.map(d => (d.revenue||0)-(d.cost||0)), backgroundColor: '#8B5CF6', borderRadius: 4 },
  ];
  if (previous?.dailyOrders?.length) {
    barDS.push(
      { label: `${t('revenueLabel')} (${t('period1')})`, data: previous.dailyOrders.map(d => d.revenue), backgroundColor: 'rgba(22,163,74,.25)', borderRadius: 4 },
    );
  }

  const orderDS = [
    { label: t('dailyOrdersCountLabel'), data: current.dailyOrders.map(d => d.count), backgroundColor: '#3B82F6', borderRadius: 4 },
  ];
  if (previous?.dailyOrders?.length) {
    orderDS.push({ label: `${t('dailyOrdersCountLabel')} (${t('period1')})`, data: previous.dailyOrders.map(d => d.count), backgroundColor: 'rgba(59,130,246,.25)', borderRadius: 4 });
  }

  const sLabels = {
    kutilmoqda: t('statusPending'),
    qabul_qilindi: t('statusAccepted'),
    tayyorlanmoqda: t('statusPreparing'),
    yuklandi: t('statusLoaded'),
    yuborildi: t('statusSent'),
    yetkazildi: t('statusDelivered'),
  };
  const statusD = {
    labels: current.ordersByStatus.map(s => sLabels[s._id]||s._id),
    datasets: [{ data: current.ordersByStatus.map(s => s.count), backgroundColor: ['#F59E0B','#3B82F6','#16A34A','#0EA5E9','#8B5CF6','#10B981'], borderWidth: 0 }]
  };

  const chartOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, padding: 14, font: { size: 11, family: 'Inter, system-ui, sans-serif' } } } }, scales: { x: { grid: { display: false }, ticks: { font: { size: 10 } } }, y: { grid: { color: '#f1f5f9' }, beginAtZero: true, ticks: { font: { size: 10 } } } } };
  const noLeg = { ...chartOpts, plugins: { legend: { display: false } } };

  const inpS = { padding: '7px 10px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, fontFamily: 'Inter, system-ui, sans-serif', background: '#fff', color: '#1E293B', outline: 'none', width: 130 };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }} className="fade-in">

      {/* Title */}
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0F172A', marginBottom: 20, letterSpacing: '-.02em' }}>{t('dashboardTitle')}</h1>

      {/* ═══ DATE FILTER ═══ */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: '14px 18px', marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6, letterSpacing: '.02em', textTransform: 'uppercase' }}>
          <Calendar size={13} />
          {t('selectPeriod')}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{t('period1')}</span>
          <input type="date" value={d1Start} onChange={e => setD1Start(e.target.value)} style={inpS} />
          <span style={{ fontSize: 12, color: '#94A3B8' }}>—</span>
          <input type="date" value={d1End} onChange={e => setD1End(e.target.value)} style={inpS} />

          <button onClick={togComp} style={{
            width: 30, height: 30, borderRadius: '50%', border: compare ? 'none' : '1px solid #E2E8F0',
            background: compare ? '#2563EB' : '#F8FAFC', color: compare ? '#fff' : '#64748B',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all .15s',
          }}><ArrowRightLeft size={13} /></button>

          {compare && (
            <>
              <span style={{ fontSize: 12, color: '#7C3AED', fontWeight: 500 }}>{t('period2')}</span>
              <input type="date" value={d2Start} onChange={e => setD2Start(e.target.value)} style={{ ...inpS, borderColor: '#C4B5FD' }} />
              <span style={{ fontSize: 12, color: '#94A3B8' }}>—</span>
              <input type="date" value={d2End} onChange={e => setD2End(e.target.value)} style={{ ...inpS, borderColor: '#C4B5FD' }} />
            </>
          )}

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            <button onClick={apply} style={{
              padding: '6px 16px', fontSize: 12, fontWeight: 600, borderRadius: 8,
              background: '#2563EB', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            }}>{t('applyFilter')}</button>
            <button onClick={reset} style={{
              padding: '6px 16px', fontSize: 12, fontWeight: 500, borderRadius: 8,
              background: '#F1F5F9', color: '#64748B', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            }}>{t('resetFilter')}</button>
          </div>
        </div>
      </div>

      {/* ═══ STAT CARDS ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12, marginBottom: 20 }}>
        {cards.map((c, i) => (
          <StatCard
            key={i}
            icon={c.icon}
            label={c.label}
            value={c.val}
            prevValue={c.prevVal}
            change={c.chg}
            diffText={c.diffText}
            bg={c.bg}
            fg={c.fg}
            highlight={c.highlight}
          />
        ))}
      </div>

      {/* ═══ COMPARISON TABLE ═══ */}
      {cmp && (
        <div style={{ background: '#FAFAFF', border: '1px solid #EDE9FE', borderRadius: 12, padding: '16px 18px', marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#6D28D9', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            <ArrowRightLeft size={14} />
            {t('comparisonTitle')}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: 'Inter, system-ui, sans-serif' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #EDE9FE' }}>
                  <th style={{ textAlign: 'left', padding: '8px 10px', color: '#64748B', fontWeight: 600, fontSize: 12 }}>{t('comparisonMetric')}</th>
                  <th style={{ textAlign: 'right', padding: '8px 10px', color: '#2563EB', fontWeight: 600, fontSize: 12 }}>{t('period1')}</th>
                  <th style={{ textAlign: 'right', padding: '8px 10px', color: '#7C3AED', fontWeight: 600, fontSize: 12 }}>{t('period2')}</th>
                  <th style={{ textAlign: 'right', padding: '8px 10px', color: '#64748B', fontWeight: 600, fontSize: 12 }}>{t('changeLabel')}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: t('totalOrdersLabel'),  cur: stats.totalOrders, prev: cmp.totalOrders },
                  { label: t('deliveredOrdersLabel'), cur: stats.deliveredOrders ?? 0, prev: cmp.deliveredOrders ?? 0 },
                  { label: t('totalRevenueLabel'),  cur: stats.totalRevenue, prev: cmp.totalRevenue },
                  { label: t('totalCostLabel'),     cur: stats.totalCost||0, prev: cmp.totalCost||0 },
                  { label: t('realProfitLabel'),    cur: stats.totalProfit||0, prev: cmp.totalProfit||0 },
                  { label: t('newUsersLabel'),      cur: stats.newUsers ?? 0, prev: cmp.newUsers ?? 0 },
                  { label: t('newProductsLabel'),   cur: stats.newProducts ?? 0, prev: cmp.newProducts ?? 0 },
                ].map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F5F3FF' }}>
                    <td style={{ padding: '10px', fontWeight: 500, color: '#334155' }}>{r.label}</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: '#0F172A', fontSize: 14 }}>{(r.cur).toLocaleString()}</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 500, color: '#7C3AED' }}>{(r.prev).toLocaleString()}</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                        <ChangeBadge value={pctChange(r.prev, r.cur)} />
                        <span style={{ fontSize: 11, color: '#94A3B8' }}>{t('diffShortLabel')}: {fmtSigned((r.prev ?? 0) - (r.cur ?? 0))}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ LINE CHART ═══ */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #F1F5F9', padding: '16px 18px', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 12 }}>{t('monthlyRevenueCostProfitChart')}</div>
        <div style={{ height: 280 }}><Line data={{ labels: mLabels, datasets: lineDS }} options={chartOpts} /></div>
      </div>

      {/* ═══ DAILY CHARTS ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #F1F5F9', padding: '16px 18px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 12 }}>{t('dailyRevenueCostChart')}</div>
          <div style={{ height: 240 }}><Bar data={{ labels: dLabels, datasets: barDS }} options={chartOpts} /></div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #F1F5F9', padding: '16px 18px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 12 }}>{t('dailyOrdersChart')}</div>
          <div style={{ height: 240 }}><Bar data={{ labels: dLabels, datasets: orderDS }} options={cmp ? chartOpts : noLeg} /></div>
        </div>
      </div>

      {/* ═══ STATUS + RECENT ORDERS ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #F1F5F9', padding: '16px 18px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 12 }}>{t('orderStatusesChart')}</div>
          <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Doughnut data={statusD} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { size: 11, family: 'Inter, system-ui, sans-serif' }, padding: 10 } } } }} />
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #F1F5F9', padding: '16px 18px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 12 }}>{t('recentOrdersLabel')}</div>
          <div style={{ maxHeight: 240, overflow: 'auto' }}>
            {stats.recentOrders.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94A3B8', padding: 30, fontSize: 13 }}>{t('noOrders')}</p>
            ) : stats.recentOrders.map(o => (
              <div key={o._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #F8FAFC', fontSize: 13 }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#1E293B' }}>{o.orderNumber}</div>
                  <div style={{ color: '#94A3B8', fontSize: 11 }}>{o.customerName || o.user?.name || o.phone || t('unknownUser')}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <StatusBadge status={o.status} />
                  <div style={{ color: '#94A3B8', fontSize: 11, marginTop: 2 }}>{o.finalPrice.toLocaleString()} {t('som')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
