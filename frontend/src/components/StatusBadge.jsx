import { useLanguage } from '../context/LanguageContext';

export const ORDER_STATUS_FLOW = ['kutilmoqda', 'qabul_qilindi', 'tayyorlanmoqda', 'yuklandi', 'yuborildi', 'yetkazildi'];

export const ORDER_STATUS_META = {
  kutilmoqda: { labelKey: 'statusPending', className: 'badge-warning', icon: '⏳' },
  qabul_qilindi: { labelKey: 'statusAccepted', className: 'badge-info', icon: '✅' },
  tayyorlanmoqda: { labelKey: 'statusPreparing', className: 'badge-accent', icon: '🛠️' },
  yuklandi: { labelKey: 'statusLoaded', className: 'badge-info', icon: '📋' },
  yuborildi: { labelKey: 'statusSent', className: 'badge-accent', icon: '🚚' },
  yetkazildi: { labelKey: 'statusDelivered', className: 'badge-success', icon: '📦' },
};

export function getStatusIndex(status) {
  return ORDER_STATUS_FLOW.indexOf(status);
}

export default function StatusBadge({ status }) {
  const { t } = useLanguage();
  const info = ORDER_STATUS_META[status];

  if (!info) {
    return <span className="badge badge-info">📋 {status}</span>;
  }

  return (
    <span className={`badge ${info.className}`}>
      {info.icon} {t(info.labelKey)}
    </span>
  );
}
