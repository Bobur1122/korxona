export const STATUS_LABELS = {
  kutilmoqda: { label: 'Kutilmoqda', class: 'badge-warning', icon: '⏳' },
  qabul_qilindi: { label: 'Qabul qilindi', class: 'badge-info', icon: '✅' },
  tayyorlanmoqda: { label: 'Tayyorlanmoqda', class: 'badge-accent', icon: '🔨' },
  yetkazildi: { label: 'Yetkazildi', class: 'badge-success', icon: '📦' }
};

export default function StatusBadge({ status }) {
  const info = STATUS_LABELS[status] || { label: status, class: 'badge-info', icon: '📋' };
  return (
    <span className={`badge ${info.class}`}>
      {info.icon} {info.label}
    </span>
  );
}
