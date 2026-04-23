import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, X, Upload, Image, Newspaper, Languages } from 'lucide-react';
import { api } from '../../api';
import { rangeLastDays, rangeThisMonth } from '../../utils/datePeriod';

const categories = [
  { value: 'yangilik', label: 'Yangilik' },
  { value: 'aksiya', label: 'Aksiya' },
  { value: 'elon', label: "E'lon" },
  { value: 'maqola', label: 'Maqola' }
];

const emptyForm = {
  title_uz: '', title_ru: '', title_en: '',
  content_uz: '', content_ru: '', content_en: '',
  image: '', category: 'yangilik', isActive: true
};

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [langTab, setLangTab] = useState('uz');
  const [translating, setTranslating] = useState(false);
  const fileInputRef = useRef(null);

  const fetchNews = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    if (categoryFilter) params.set('category', categoryFilter);
    if (activeFilter !== '') params.set('isActive', activeFilter);

    api.getAllNews(params.toString())
      .then(res => setNews(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNews(); }, [startDate, endDate, categoryFilter, activeFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImagePreview('');
    setError('');
    setLangTab('uz');
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item._id);
    setForm({
      title_uz: item.title_uz || '', title_ru: item.title_ru || '', title_en: item.title_en || '',
      content_uz: item.content_uz || '', content_ru: item.content_ru || '', content_en: item.content_en || '',
      image: item.image || '', category: item.category || 'yangilik', isActive: item.isActive
    });
    setImagePreview(item.image || '');
    setError('');
    setLangTab('uz');
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const token = localStorage.getItem('token');
      const uploadUrl = (import.meta.env.VITE_API_URL || '/api') + '/upload';
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setForm(prev => ({ ...prev, image: data.data.url }));
      } else {
        setError(data.message || 'Rasm yuklashda xato');
      }
    } catch (err) {
      setError('Rasm yuklashda xato yuz berdi');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate all languages filled
    if (!form.title_uz || !form.title_ru || !form.title_en) {
      setError('Barcha 3 tilda sarlavha kiritilishi shart!');
      return;
    }
    if (!form.content_uz || !form.content_ru || !form.content_en) {
      setError('Barcha 3 tilda matn kiritilishi shart!');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await api.updateNews(editing, form);
      } else {
        await api.createNews(form);
      }
      setShowModal(false);
      fetchNews();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yangilikni o\'chirishni xohlaysizmi?')) return;
    try {
      await api.deleteNews(id);
      fetchNews();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric' });

  if (loading && news.length === 0) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <div className="admin-header">
        <h1 className="admin-title">Yangiliklar</h1>
        <button className="btn btn-primary" onClick={openCreate} id="add-news-btn">
          <Plus size={18} /> Yangi yangilik
        </button>
      </div>

      {/* Filters */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4)',
        marginBottom: 'var(--space-5)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 'var(--space-3)' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: 'var(--font-size-xs)' }}>Boshlanish sana</label>
            <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: 'var(--font-size-xs)' }}>Tugash sana</label>
            <input type="date" className="form-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: 'var(--font-size-xs)' }}>Kategoriya</label>
            <select className="form-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">Barchasi</option>
              {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: 'var(--font-size-xs)' }}>Holat</label>
            <select className="form-select" value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}>
              <option value="">Barchasi</option>
              <option value="true">Faol</option>
              <option value="false">Nofaol</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-3)', alignItems: 'center' }}>
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
              setCategoryFilter('');
              setActiveFilter('');
            }}
          >
            Tozalash
          </button>

          <div style={{ marginLeft: 'auto' }}>
            <span className="badge badge-accent">{news.length} ta</span>
          </div>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Rasm</th>
              <th>Sarlavha (UZ)</th>
              <th>Kategoriya</th>
              <th>Sana</th>
              <th>Holat</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {news.map(item => (
              <tr key={item._id}>
                <td>
                  {item.image ? (
                    <img src={item.image} alt="" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                  ) : (
                    <div style={{ width: 60, height: 40, background: 'var(--color-accent-bg)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Newspaper size={16} color="var(--color-accent)" />
                    </div>
                  )}
                </td>
                <td style={{ fontWeight: 500, maxWidth: 300 }}>{item.title_uz}</td>
                <td>
                  <span className="badge badge-accent">{categories.find(c => c.value === item.category)?.label || item.category}</span>
                </td>
                <td style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>{formatDate(item.createdAt)}</td>
                <td>
                  <span className={`badge ${item.isActive ? 'badge-success' : 'badge-error'}`}>
                    {item.isActive ? 'Faol' : 'Nofaol'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(item)}>
                      <Edit size={14} />
                    </button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)' }} onClick={() => handleDelete(item._id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {news.length === 0 && (
          <div className="empty-state">
            <h3>Yangiliklar yo'q</h3>
            <p>Yangi yangilik qo'shing</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <h2 className="modal-title" style={{ margin: 0 }}>
                {editing ? 'Yangilikni tahrirlash' : 'Yangi yangilik'}
              </h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Image Upload */}
              <div className="form-group">
                <label className="form-label">Rasm</label>
                <div style={{
                  border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-4)', textAlign: 'center', cursor: 'pointer',
                  background: imagePreview ? 'var(--color-bg)' : 'transparent'
                }} onClick={() => fileInputRef.current?.click()}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{ maxHeight: 140, maxWidth: '100%', objectFit: 'contain', borderRadius: 'var(--radius-lg)', margin: '0 auto' }} />
                  ) : (
                    <div>
                      {uploading ? <div className="spinner" style={{ margin: '0 auto var(--space-2)' }}></div> : (
                        <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-xl)', background: 'var(--color-accent-bg)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-2)' }}>
                          <Upload size={20} />
                        </div>
                      )}
                      <p style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)' }}>Rasm yuklash</p>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </div>

              {/* Language Tabs */}
              <div style={{ display: 'flex', gap: 0, marginBottom: 'var(--space-4)', borderBottom: '2px solid var(--color-border)', alignItems: 'center' }}>
                {['uz', 'ru', 'en'].map(lang => (
                  <button key={lang} type="button" onClick={() => setLangTab(lang)}
                    style={{
                      padding: '10px 20px', fontWeight: 600, fontSize: 'var(--font-size-sm)',
                      border: 'none', background: 'none', cursor: 'pointer',
                      color: langTab === lang ? 'var(--color-accent)' : 'var(--color-text-muted)',
                      borderBottom: langTab === lang ? '2px solid var(--color-accent)' : '2px solid transparent',
                      marginBottom: '-2px', transition: 'all 0.2s ease',
                      fontFamily: 'var(--font-family)'
                    }}>
                    {lang === 'uz' ? "🇺🇿 O'zbekcha" : lang === 'ru' ? '🇷🇺 Русский' : '🇬🇧 English'}
                    {form[`title_${lang}`] && form[`content_${lang}`] ? ' ✓' : ' *'}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={translating || !form[`title_${langTab}`]}
                  onClick={async () => {
                    if (!form[`title_${langTab}`]) return;
                    setTranslating(true);
                    setError('');
                    try {
                      const res = await api.translate(
                        { title: form[`title_${langTab}`], content: form[`content_${langTab}`] || '' },
                        langTab
                      );
                      if (res.success) {
                        setForm(prev => {
                          const updated = { ...prev };
                          for (const [lang, fields] of Object.entries(res.data)) {
                            if (fields.title) updated[`title_${lang}`] = fields.title;
                            if (fields.content) updated[`content_${lang}`] = fields.content;
                          }
                          return updated;
                        });
                      }
                    } catch (err) {
                      setError('Tarjima xatosi: ' + err.message);
                    } finally {
                      setTranslating(false);
                    }
                  }}
                  style={{
                    marginLeft: 'auto', padding: '6px 14px', fontSize: 'var(--font-size-xs)',
                    fontWeight: 600, border: '1.5px solid var(--color-accent)', borderRadius: 'var(--radius-lg)',
                    background: translating ? 'var(--color-accent-bg)' : 'transparent',
                    color: 'var(--color-accent)', cursor: translating ? 'wait' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6, marginBottom: '-2px',
                    transition: 'all 0.2s ease', fontFamily: 'var(--font-family)',
                    opacity: !form[`title_${langTab}`] ? 0.4 : 1
                  }}
                >
                  <Languages size={14} />
                  {translating ? 'Tarjima...' : 'Boshqa tillarga tarjima'}
                </button>
              </div>

              {/* Language-specific fields */}
              <div className="form-group">
                <label className="form-label">Sarlavha ({langTab.toUpperCase()}) *</label>
                <input type="text" className="form-input" name={`title_${langTab}`}
                  value={form[`title_${langTab}`]} onChange={handleChange}
                  placeholder={`Sarlavhani ${langTab.toUpperCase()} tilida kiriting`} required />
              </div>
              <div className="form-group">
                <label className="form-label">Matn ({langTab.toUpperCase()}) *</label>
                <textarea className="form-input" name={`content_${langTab}`}
                  value={form[`content_${langTab}`]} onChange={handleChange}
                  placeholder={`Matnni ${langTab.toUpperCase()} tilida kiriting`} required rows={5}></textarea>
              </div>

              {/* Category & Active */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Kategoriya</label>
                  <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                    {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)', paddingBottom: 'var(--space-5)' }}>
                  <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} id="news-active" />
                  <label htmlFor="news-active" className="form-label" style={{ margin: 0 }}>Faol</label>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Bekor qilish</button>
                <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
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
