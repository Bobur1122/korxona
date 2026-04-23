import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, X, Upload, Image } from 'lucide-react';
import { api } from '../../api';

const categories = [
  { value: 'oddiy', label: 'Oddiy plyonka' },
  { value: 'uv_plyonka', label: 'UV himoyali' },
  { value: 'kop_qavatli', label: "Ko'p qavatli" },
  { value: 'maxsus', label: 'Maxsus plyonka' },
  { value: 'boshqa', label: 'Boshqa' }
];

const emptyForm = { name_uz: '', name_ru: '', name_en: '', description_uz: '', description_ru: '', description_en: '', price: '', costPrice: '', stock: '', category: 'Issiqxona plyonkasi', image: '', thickness: '', width: '', length: '', uvProtection: false, color: 'shaffof', isActive: true };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [langTab, setLangTab] = useState('uz');
  const fileInputRef = useRef(null);

  const fetchProducts = () => {
    setLoading(true);
    api.getAllProducts()
      .then(res => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImagePreview('');
    setError('');
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditing(product._id);
    setForm({
      name_uz: product.name_uz || '', name_ru: product.name_ru || '', name_en: product.name_en || '',
      description_uz: product.description_uz || '', description_ru: product.description_ru || '', description_en: product.description_en || '',
      price: product.price,
      costPrice: product.costPrice || '',
      stock: product.stock,
      category: product.category,
      image: product.image || '',
      thickness: product.thickness || '',
      width: product.width || '',
      length: product.length || '',
      uvProtection: product.uvProtection || false,
      color: product.color || 'shaffof',
      isActive: product.isActive
    });
    setImagePreview(product.image || '');
    setError('');
    setLangTab('uz');
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const uploadUrl = (import.meta.env.VITE_API_URL || '/api') + '/upload';
      const authToken = localStorage.getItem('token');
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
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
    setSaving(true);
    setError('');
    try {
      const data = {
        ...form,
        price: Number(form.price),
        costPrice: form.costPrice ? Number(form.costPrice) : 0,
        stock: Number(form.stock),
        thickness: form.thickness ? Number(form.thickness) : undefined,
        width: form.width ? Number(form.width) : undefined,
        length: form.length ? Number(form.length) : undefined,
      };
      if (editing) {
        await api.updateProduct(editing, data);
      } else {
        await api.createProduct(data);
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Mahsulotni o\'chirishni xohlaysizmi?')) return;
    try {
      await api.deleteProduct(id);
      fetchProducts();
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
        <h1 className="admin-title">Mahsulotlar</h1>
        <button className="btn btn-primary" onClick={openCreate} id="add-product-btn">
          <Plus size={18} /> Yangi mahsulot
        </button>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Rasm</th>
              <th>Nomi</th>
              <th>Kategoriya</th>
              <th>Qalinlik</th>
              <th>Narx</th>
              <th>Tan narx</th>
              <th>Mavjud</th>
              <th>Holat</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td>
                  <img
                    src={p.image || `https://placehold.co/40x40/f0fdf4/16a34a?text=${p.name[0]}`}
                    alt={p.name}
                    style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                  />
                </td>
                <td style={{ fontWeight: 500 }}>{p.name}</td>
                <td>{categories.find(c => c.value === p.category)?.label || p.category}</td>
                <td>{p.thickness ? `${p.thickness} mkm` : '—'}</td>
                <td>{p.price.toLocaleString()} so'm</td>
                <td style={{ color: 'var(--color-warning)' }}>{(p.costPrice || 0).toLocaleString()} so'm</td>
                <td>
                  <span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-error'}`}>
                    {p.stock} dona
                  </span>
                </td>
                <td>
                  <span className={`badge ${p.isActive ? 'badge-success' : 'badge-error'}`}>
                    {p.isActive ? 'Faol' : 'Nofaol'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>
                      <Edit size={14} />
                    </button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)' }} onClick={() => handleDelete(p._id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="empty-state">
            <h3>Mahsulotlar yo'q</h3>
            <p>Yangi mahsulot qo'shing</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
              <h2 className="modal-title" style={{ margin: 0 }}>
                {editing ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}
              </h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Image Upload */}
              <div className="form-group">
                <label className="form-label">Mahsulot rasmi</label>
                <div style={{
                  border: '2px dashed var(--color-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-5)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  background: imagePreview ? 'var(--color-bg)' : 'transparent'
                }}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
                  onDragLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    const file = e.dataTransfer.files[0];
                    if (file) {
                      const dt = new DataTransfer();
                      dt.items.add(file);
                      fileInputRef.current.files = dt.files;
                      handleImageUpload({ target: { files: [file] } });
                    }
                  }}
                >
                  {imagePreview ? (
                    <div style={{ position: 'relative' }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxHeight: 180, maxWidth: '100%', objectFit: 'contain',
                          borderRadius: 'var(--radius-lg)', margin: '0 auto'
                        }}
                      />
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
                        Boshqa rasm tanlash uchun bosing
                      </p>
                    </div>
                  ) : (
                    <div>
                      {uploading ? (
                        <div className="spinner" style={{ margin: '0 auto var(--space-3)' }}></div>
                      ) : (
                        <div style={{
                          width: 56, height: 56, borderRadius: 'var(--radius-xl)',
                          background: 'var(--color-accent-bg)', color: 'var(--color-accent)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          margin: '0 auto var(--space-3)'
                        }}>
                          <Upload size={24} />
                        </div>
                      )}
                      <p style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)', marginBottom: 2 }}>
                        Rasm yuklash uchun bosing
                      </p>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                        JPG, PNG, WEBP • Maks. 5MB
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id="product-image-upload"
                />
                {uploading && (
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent)', marginTop: 'var(--space-2)' }}>
                    Rasm yuklanmoqda...
                  </p>
                )}
              </div>

              {/* Language Tabs */}
              <div style={{ display: 'flex', gap: 0, marginBottom: 'var(--space-4)', borderBottom: '2px solid var(--color-border)' }}>
                {['uz', 'ru', 'en'].map(lang => (
                  <button key={lang} type="button" onClick={() => setLangTab(lang)}
                    style={{
                      padding: '10px 20px', fontWeight: 600, fontSize: 'var(--font-size-sm)',
                      border: 'none', background: 'none', cursor: 'pointer',
                      color: langTab === lang ? 'var(--color-accent)' : 'var(--color-text-muted)',
                      borderBottom: langTab === lang ? '2px solid var(--color-accent)' : '2px solid transparent',
                      marginBottom: '-2px', transition: 'all 0.2s ease', fontFamily: 'var(--font-family)'
                    }}>
                    {lang === 'uz' ? "🇺🇿 O'zbekcha" : lang === 'ru' ? '🇷🇺 Русский' : '🇬🇧 English'}
                    {form[`name_${lang}`] && form[`description_${lang}`] ? ' ✓' : ' *'}
                  </button>
                ))}
              </div>
              <div className="form-group">
                <label className="form-label">Nomi ({langTab.toUpperCase()}) *</label>
                <input type="text" className="form-input" name={`name_${langTab}`} value={form[`name_${langTab}`]} onChange={handleChange} required placeholder={`Mahsulot nomi ${langTab.toUpperCase()} tilida`} />
              </div>
              <div className="form-group">
                <label className="form-label">Tavsif ({langTab.toUpperCase()}) *</label>
                <textarea className="form-input" name={`description_${langTab}`} value={form[`description_${langTab}`]} onChange={handleChange} required rows={3} placeholder={`Tavsif ${langTab.toUpperCase()} tilida`}></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Narx (so'm)</label>
                  <input type="number" className="form-input" name="price" value={form.price} onChange={handleChange} required min="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Tan narx (so'm)</label>
                  <input type="number" className="form-input" name="costPrice" value={form.costPrice} onChange={handleChange} min="0" placeholder="0" style={{ borderColor: 'var(--color-warning)' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Mavjud soni</label>
                  <input type="number" className="form-input" name="stock" value={form.stock} onChange={handleChange} required min="0" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Kategoriya</label>
                <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                  {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              {/* Plyonka xususiyatlari */}
              <div style={{ background: 'var(--color-accent-bg)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
                <label className="form-label" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-3)' }}>Plyonka xususiyatlari</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: 'var(--font-size-xs)' }}>Qalinlik (mkm)</label>
                    <input type="number" className="form-input" name="thickness" value={form.thickness} onChange={handleChange} min="0" placeholder="100" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: 'var(--font-size-xs)' }}>Eni (m)</label>
                    <input type="number" className="form-input" name="width" value={form.width} onChange={handleChange} min="0" step="0.1" placeholder="6" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: 'var(--font-size-xs)' }}>Uzunlik (m)</label>
                    <input type="number" className="form-input" name="length" value={form.length} onChange={handleChange} min="0" placeholder="50" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: 'var(--font-size-xs)' }}>Rang</label>
                    <input type="text" className="form-input" name="color" value={form.color} onChange={handleChange} placeholder="shaffof" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0, display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)' }}>
                    <input type="checkbox" name="uvProtection" checked={form.uvProtection} onChange={handleChange} id="uv-protection" />
                    <label htmlFor="uv-protection" className="form-label" style={{ margin: 0, fontSize: 'var(--font-size-xs)' }}>UV himoyali</label>
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} id="product-active" />
                <label htmlFor="product-active" className="form-label" style={{ margin: 0 }}>Faol</label>
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
