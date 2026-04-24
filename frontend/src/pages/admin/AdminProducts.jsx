import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Edit, Trash2, X, Upload, Languages } from 'lucide-react';
import { api } from '../../api';
import { rangeLastDays, rangeThisMonth, prevRange, pctChange } from '../../utils/datePeriod';

const categories = [
  { value: 'Issiqxona plyonkasi', label: 'Issiqxona plyonkasi' },
  { value: 'Termo-usadoz plyonka', label: 'Termo-usadoz plyonka' },
  { value: 'Polietilen paketlar', label: 'Polietilen paketlar' },
  { value: 'PET kapsulalar', label: 'PET kapsulalar' },
  { value: 'Tom yopish materiallari', label: 'Tom yopish materiallari' },
  { value: 'Bitum-polimer mastika', label: 'Bitum-polimer mastika' }
];

const emptyForm = { name_uz: '', name_ru: '', name_en: '', description_uz: '', description_ru: '', description_en: '', price: '', costPrice: '', stock: '', category: 'Issiqxona plyonkasi', image: '', images: [], thickness: '', width: '', length: '', uvProtection: false, color: 'shaffof', isActive: true };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [prevCount, setPrevCount] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [langTab, setLangTab] = useState('uz');
  const [translating, setTranslating] = useState(false);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    if (search) params.set('search', search);
    if (categoryFilter) params.set('category', categoryFilter);
    if (activeFilter !== '') params.set('isActive', activeFilter);

    api.getAllProducts(params.toString())
      .then(res => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [startDate, endDate, search, categoryFilter, activeFilter]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    if (!startDate || !endDate) {
      setPrevCount(null);
      return;
    }

    const prev = prevRange(startDate, endDate);
    const params = new URLSearchParams();
    params.set('startDate', prev.start);
    params.set('endDate', prev.end);
    if (search) params.set('search', search);
    if (categoryFilter) params.set('category', categoryFilter);
    if (activeFilter !== '') params.set('isActive', activeFilter);

    setStatsLoading(true);
    api.getAllProducts(params.toString())
      .then(res => setPrevCount(res.data.length))
      .catch(() => setPrevCount(null))
      .finally(() => setStatsLoading(false));
  }, [startDate, endDate, search, categoryFilter, activeFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (product) => {
    const images = Array.isArray(product.images) && product.images.length
      ? product.images
      : (product.image ? [product.image] : []);
    setEditing(product._id);
    setForm({
      name_uz: product.name_uz || '', name_ru: product.name_ru || '', name_en: product.name_en || '',
      description_uz: product.description_uz || '', description_ru: product.description_ru || '', description_en: product.description_en || '',
      price: product.price,
      costPrice: product.costPrice || '',
      stock: product.stock,
      category: product.category,
      image: images[0] || '',
      images,
      thickness: product.thickness || '',
      width: product.width || '',
      length: product.length || '',
      uvProtection: product.uvProtection || false,
      color: product.color || 'shaffof',
      isActive: product.isActive
    });
    setError('');
    setLangTab('uz');
    setShowModal(true);
  };

  const uploadImageFile = useCallback(async (file) => {
    if (!file) return null;

    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setError('Rasm hajmi 5MB dan oshmasligi kerak');
      return null;
    }

    setError('');
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
      if (data.success) return data.data.url;
      setError(data.message || 'Rasm yuklashda xato');
    } catch (err) {
      setError('Rasm yuklashda xato yuz berdi');
    }

    return null;
  }, []);

  const addImages = useCallback(async (filesLike) => {
    const files = Array.from(filesLike || []).filter(f => f?.type?.startsWith('image/'));
    if (!files.length) return;

    setUploading(true);
    try {
      for (const file of files) {
        const url = await uploadImageFile(file);
        if (!url) continue;
        setForm(prev => {
          const current = Array.isArray(prev.images) ? prev.images : (prev.image ? [prev.image] : []);
          const nextImages = [...current, url];
          return { ...prev, images: nextImages, image: nextImages[0] || '' };
        });
      }
    } finally {
      setUploading(false);
    }
  }, [uploadImageFile]);

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    addImages(files);
    e.target.value = '';
  };

  const removeImage = (url) => {
    setForm(prev => {
      const current = Array.isArray(prev.images) ? prev.images : (prev.image ? [prev.image] : []);
      const nextImages = current.filter(u => u !== url);
      return { ...prev, images: nextImages, image: nextImages[0] || '' };
    });
  };

  const makePrimary = (url) => {
    setForm(prev => {
      const current = Array.isArray(prev.images) ? prev.images : (prev.image ? [prev.image] : []);
      const idx = current.indexOf(url);
      if (idx <= 0) return prev;
      const nextImages = [current[idx], ...current.slice(0, idx), ...current.slice(idx + 1)];
      return { ...prev, images: nextImages, image: nextImages[0] || '' };
    });
  };

  useEffect(() => {
    if (!showModal) return;

    const getPastedImages = (clipboardData) => {
      if (!clipboardData) return [];

      const fromFiles = clipboardData.files
        ? Array.from(clipboardData.files).filter(f => f.type?.startsWith('image/'))
        : [];
      if (fromFiles.length) return fromFiles;

      const out = [];
      const items = clipboardData.items ? Array.from(clipboardData.items) : [];
      for (const item of items) {
        if (item.kind === 'file' && item.type?.startsWith('image/')) {
          const f = item.getAsFile();
          if (f) out.push(f);
        }
      }
      return out;
    };

    const onPaste = (e) => {
      const files = getPastedImages(e.clipboardData);
      if (!files.length) return;

      e.preventDefault();
      addImages(files);
    };

    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
  }, [showModal, addImages]);

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

  const currentImages = Array.isArray(form.images) ? form.images : (form.image ? [form.image] : []);
  const currentCount = products.length;
  const change = (startDate && endDate && prevCount !== null) ? pctChange(currentCount, prevCount) : undefined;

  if (loading && products.length === 0) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <div className="admin-header">
        <h1 className="admin-title">Mahsulotlar</h1>
        <button className="btn btn-primary" onClick={openCreate} id="add-product-btn">
          <Plus size={18} /> Yangi mahsulot
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr 1fr 0.9fr', gap: 'var(--space-3)' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: 'var(--font-size-xs)' }}>Boshlanish sana</label>
            <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: 'var(--font-size-xs)' }}>Tugash sana</label>
            <input type="date" className="form-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: 'var(--font-size-xs)' }}>Qidiruv</label>
            <input
              type="text"
              className="form-input"
              placeholder="Nomi yoki tavsif..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
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
              setSearchInput('');
              setCategoryFilter('');
              setActiveFilter('');
            }}
          >
            Tozalash
          </button>

          <div style={{ marginLeft: 'auto', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            {statsLoading ? 'Hisoblanmoqda...' : (
              <>
                {currentCount} ta
                {(startDate && endDate && prevCount !== null) && (
                  <span style={{
                    marginLeft: 10,
                    color: (change === null || (typeof change === 'number' && change > 0))
                      ? 'var(--color-success)'
                      : (typeof change === 'number' && change < 0)
                        ? 'var(--color-error)'
                        : 'var(--color-text-muted)'
                  }}>
                    {change === null ? 'Yangi' : (typeof change === 'number' ? `${change > 0 ? '+' : ''}${change}%` : '')}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
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
                    src={(Array.isArray(p.images) && p.images.length ? p.images[0] : p.image) || `https://placehold.co/40x40/f0fdf4/16a34a?text=${(p.name_uz || p.name || 'M')[0]}`}
                    alt={p.name_uz || p.name}
                    style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                  />
                </td>
                <td style={{ fontWeight: 500 }}>{p.name_uz || p.name || '—'}</td>
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
          <div ref={modalRef} className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
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
                <label className="form-label">Mahsulot rasmlari</label>
                <div
                  style={{
                    border: '2px dashed var(--color-border)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-5)',
                    textAlign: 'center',
                    cursor: currentImages.length ? 'default' : 'pointer',
                    transition: 'all var(--transition-fast)',
                    background: currentImages.length ? 'var(--color-bg)' : 'transparent'
                  }}
                  onClick={() => { if (!currentImages.length) fileInputRef.current?.click(); }}
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--color-accent)'; }}
                  onDragLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    const files = e.dataTransfer.files;
                    if (files && files.length) addImages(files);
                  }}
                >
                  {currentImages.length ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 'var(--space-3)' }}>
                      {currentImages.map((url, idx) => (
                        <div key={url} style={{ position: 'relative' }}>
                          <img
                            src={url}
                            alt=""
                            onClick={() => makePrimary(url)}
                            title={idx === 0 ? 'Asosiy rasm' : 'Asosiy qilish uchun bosing'}
                            style={{
                              width: '100%',
                              height: 80,
                              objectFit: 'cover',
                              borderRadius: 'var(--radius-lg)',
                              cursor: 'pointer',
                              border: idx === 0 ? '2px solid var(--color-accent)' : '1px solid var(--color-border)'
                            }}
                          />
                          {idx === 0 && (
                            <span style={{
                              position: 'absolute', left: 8, top: 8,
                              background: 'rgba(0,0,0,0.65)', color: '#fff',
                              fontSize: 11, fontWeight: 700,
                              padding: '2px 8px', borderRadius: 999
                            }}>
                              Asosiy
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(url)}
                            className="btn btn-ghost btn-sm"
                            style={{ position: 'absolute', right: 6, top: 6, background: 'rgba(255,255,255,0.9)' }}
                            title="O'chirish"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          height: 80,
                          borderRadius: 'var(--radius-lg)',
                          border: '1px dashed var(--color-border)',
                          background: 'transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-text-muted)'
                        }}
                        title="Yana rasm qo'shish"
                      >
                        <Upload size={18} />
                      </button>
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
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 6 }}>
                        Ctrl+V orqali ham rasm qo'shishingiz mumkin
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
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
              <div style={{ display: 'flex', gap: 0, marginBottom: 'var(--space-4)', borderBottom: '2px solid var(--color-border)', alignItems: 'center' }}>
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
                <button
                  type="button"
                  disabled={translating || !form[`name_${langTab}`]}
                  onClick={async () => {
                    if (!form[`name_${langTab}`]) return;
                    setTranslating(true);
                    setError('');
                    try {
                      const res = await api.translate(
                        { name: form[`name_${langTab}`], description: form[`description_${langTab}`] || '' },
                        langTab
                      );
                      if (res.success) {
                        setForm(prev => {
                          const updated = { ...prev };
                          for (const [lang, fields] of Object.entries(res.data)) {
                            if (fields.name) updated[`name_${lang}`] = fields.name;
                            if (fields.description) updated[`description_${lang}`] = fields.description;
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
                    opacity: !form[`name_${langTab}`] ? 0.4 : 1
                  }}
                >
                  <Languages size={14} />
                  {translating ? 'Tarjima...' : `Boshqa tillarga tarjima`}
                </button>
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
