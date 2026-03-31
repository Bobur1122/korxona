import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Tag } from 'lucide-react';
import { api } from '../../api';

const emptyForm = { code: '', discountPercent: '', usageLimit: '', expiresAt: '', isActive: true };

export default function AdminPromoCodes() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCodes = () => {
    setLoading(true);
    api.getPromoCodes()
      .then(res => setCodes(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCodes(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (promo) => {
    setEditing(promo._id);
    setForm({
      code: promo.code,
      discountPercent: promo.discountPercent,
      usageLimit: promo.usageLimit || '',
      expiresAt: promo.expiresAt ? promo.expiresAt.slice(0, 10) : '',
      isActive: promo.isActive
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const data = {
        code: form.code,
        discountPercent: Number(form.discountPercent),
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        expiresAt: form.expiresAt || null,
        isActive: form.isActive
      };
      if (editing) {
        await api.updatePromoCode(editing, data);
      } else {
        await api.createPromoCode(data);
      }
      setShowModal(false);
      fetchCodes();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Promokodni o\'chirishni xohlaysizmi?')) return;
    try {
      await api.deletePromoCode(id);
      fetchCodes();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <div className="admin-header">
        <h1 className="admin-title">Promokodlar</h1>
        <button className="btn btn-primary" onClick={openCreate} id="add-promo-btn">
          <Plus size={18} /> Yangi promokod
        </button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Kod</th>
              <th>Chegirma</th>
              <th>Ishlatilgan</th>
              <th>Limit</th>
              <th>Amal qilish</th>
              <th>Holat</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {codes.map(c => (
              <tr key={c._id}>
                <td>
                  <span style={{
                    fontFamily: 'monospace', fontWeight: 700, fontSize: 'var(--font-size-sm)',
                    background: 'var(--color-accent-bg)', color: 'var(--color-accent)',
                    padding: '2px 8px', borderRadius: 'var(--radius-sm)'
                  }}>
                    {c.code}
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>{c.discountPercent}%</td>
                <td>{c.usedCount} marta</td>
                <td>{c.usageLimit || '∞'}</td>
                <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                  {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('uz-UZ') : 'Cheklanmagan'}
                </td>
                <td>
                  <span className={`badge ${c.isActive ? 'badge-success' : 'badge-error'}`}>
                    {c.isActive ? 'Faol' : 'Nofaol'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}>
                      <Edit size={14} />
                    </button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)' }} onClick={() => handleDelete(c._id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {codes.length === 0 && (
          <div className="empty-state">
            <Tag size={48} />
            <h3>Promokodlar yo'q</h3>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
              <h2 className="modal-title" style={{ margin: 0 }}>
                {editing ? 'Promokodni tahrirlash' : 'Yangi promokod'}
              </h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Kod</label>
                <input type="text" className="form-input" name="code" value={form.code} onChange={handleChange} required placeholder="SALE20" style={{ textTransform: 'uppercase' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Chegirma foizi (%)</label>
                <input type="number" className="form-input" name="discountPercent" value={form.discountPercent} onChange={handleChange} required min="1" max="90" />
              </div>
              <div className="form-group">
                <label className="form-label">Ishlatish limiti (bo'sh = cheklanmagan)</label>
                <input type="number" className="form-input" name="usageLimit" value={form.usageLimit} onChange={handleChange} min="1" placeholder="Cheklanmagan" />
              </div>
              <div className="form-group">
                <label className="form-label">Amal qilish muddati (bo'sh = cheklanmagan)</label>
                <input type="date" className="form-input" name="expiresAt" value={form.expiresAt} onChange={handleChange} />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} id="promo-active" />
                <label htmlFor="promo-active" className="form-label" style={{ margin: 0 }}>Faol</label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Bekor qilish</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saqlanmoqda...' : (editing ? 'Saqlash' : 'Yaratish')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
