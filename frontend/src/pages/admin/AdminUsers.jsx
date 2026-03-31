import { useState, useEffect } from 'react';
import { Shield, Trash2, User } from 'lucide-react';
import { api } from '../../api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    api.getUsers()
      .then(res => setUsers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

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

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div className="fade-in">
      <div className="admin-header">
        <h1 className="admin-title">Foydalanuvchilar</h1>
        <span className="badge badge-accent">{users.length} ta foydalanuvchi</span>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 'var(--radius-full)',
                      background: u.role === 'admin' ? 'var(--color-accent-bg)' : 'var(--color-bg)',
                      color: u.role === 'admin' ? 'var(--color-accent)' : 'var(--color-text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {u.role === 'admin' ? <Shield size={16} /> : <User size={16} />}
                    </div>
                    <span style={{ fontWeight: 500 }}>{u.name}</span>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>
                  <span className={`badge ${u.role === 'admin' ? 'badge-accent' : 'badge-info'}`}>
                    {u.role === 'admin' ? 'Admin' : 'Foydalanuvchi'}
                  </span>
                </td>
                <td style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                  {new Date(u.createdAt).toLocaleDateString('uz-UZ')}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleRoleChange(u._id, u.role === 'admin' ? 'user' : 'admin')}
                      title={u.role === 'admin' ? 'Foydalanuvchi qilish' : 'Admin qilish'}
                    >
                      <Shield size={14} />
                    </button>
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
    </div>
  );
}
