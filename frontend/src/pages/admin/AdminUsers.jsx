import { useState, useEffect } from 'react';
import { Shield, Trash2, User, UserCog, BriefcaseBusiness, Plus, X } from 'lucide-react';
import { api } from '../../api';
import { rangeLastDays, rangeThisMonth } from '../../utils/datePeriod';

const ROLE_OPTIONS = [
  { value: 'user', label: 'Foydalanuvchi' },
  { value: 'admin', label: 'Admin' },
  { value: 'direktor', label: 'Direktor' },
  { value: 'hodim', label: 'Hodim' },
];

const ROLE_META = {
  admin: { label: 'Admin', badge: 'badge-accent', icon: Shield },
  direktor: { label: 'Direktor', badge: 'badge-info', icon: BriefcaseBusiness },
  hodim: { label: 'Hodim', badge: 'badge-info', icon: UserCog },
  user: { label: 'Foydalanuvchi', badge: 'badge-info', icon: User },
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [role, setRole] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'hodim',
  });
  const [creating, setCreating] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchUsers = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    if (role) params.set('role', role);
    if (search) params.set('search', search);

    api.getUsers(params.toString())
      .then(res => setUsers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [startDate, endDate, role, search]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.updateUserRole(userId, newRole);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Foydalanuvchini o\'chirishni xohlaysizmi?')) return;
    try {
      await api.deleteUser(userId);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.createUser(form);
      setForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'hodim',
      });
      setIsCreateModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading && users.length === 0) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <div className="admin-header">
        <h1 className="admin-title">Foydalanuvchilar</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={14} />
            Foydalanuvchi qo'shish
          </button>
          <span className="badge badge-accent">{users.length} ta foydalanuvchi</span>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4)',
        marginBottom: 'var(--space-5)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.4fr', gap: 'var(--space-3)' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: 'var(--font-size-xs)' }}>Boshlanish sana</label>
            <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: 'var(--font-size-xs)' }}>Tugash sana</label>
            <input type="date" className="form-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: 'var(--font-size-xs)' }}>Rol</label>
            <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">Barchasi</option>
              {ROLE_OPTIONS.map((roleOption) => (
                <option key={roleOption.value} value={roleOption.value}>
                  {roleOption.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: 'var(--font-size-xs)' }}>Qidiruv</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ism, email yoki telefon..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-3)' }}>
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
              setRole('');
              setSearchInput('');
            }}
          >
            Tozalash
          </button>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Foydalanuvchi</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Rol</th>
              <th>Ro'yxatdan o'tgan</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>
                  {(() => {
                    const meta = ROLE_META[u.role] || ROLE_META.user;
                    const Icon = meta.icon;
                    return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 'var(--radius-full)',
                      background: u.role === 'admin' ? 'var(--color-accent-bg)' : 'var(--color-bg)',
                      color: u.role === 'admin' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Icon size={16} />
                    </div>
                    <span style={{ fontWeight: 500 }}>{u.name}</span>
                  </div>
                    );
                  })()}
                </td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>
                  <span className={`badge ${(ROLE_META[u.role] || ROLE_META.user).badge}`}>
                    {(ROLE_META[u.role] || ROLE_META.user).label}
                  </span>
                </td>
                <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                  {new Date(u.createdAt).toLocaleDateString('uz-UZ')}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <select
                      className="form-select"
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      style={{ minWidth: 140 }}
                    >
                      {ROLE_OPTIONS.map((roleOption) => (
                        <option key={roleOption.value} value={roleOption.value}>
                          {roleOption.label}
                        </option>
                      ))}
                    </select>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--color-error)' }}
                      onClick={() => handleDelete(u._id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isCreateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Foydalanuvchi qo'shish"
          onClick={() => setIsCreateModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 720,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-5)',
              boxShadow: '0 24px 80px rgba(2, 6, 23, 0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <h3 style={{ margin: 0 }}>Hodim yoki direktor hisobi yaratish</h3>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setIsCreateModalOpen(false)}
                aria-label="Yopish"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                <input
                  className="form-input"
                  placeholder="Ism"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
                <input
                  type="email"
                  className="form-input"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
                <input
                  className="form-input"
                  placeholder="Telefon"
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                />
                <input
                  type="password"
                  className="form-input"
                  placeholder="Parol (kamida 6 ta)"
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  required
                />
                <select
                  className="form-select"
                  value={form.role}
                  onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                >
                  <option value="hodim">Hodim</option>
                  <option value="direktor">Direktor</option>
                </select>
              </div>

              <div style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Bekor qilish
                </button>
                <button className="btn btn-primary" disabled={creating}>
                  {creating ? 'Yaratilmoqda...' : 'Hisob yaratish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
