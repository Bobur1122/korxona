import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Parollar mos kelmaydi');
      return;
    }

    if (form.password.length < 6) {
      setError('Parol kamida 6 belgidan iborat bo\'lishi kerak');
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.phone, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        <h1 className="auth-title">Ro'yxatdan o'tish</h1>
        <p className="auth-subtitle">Hisob yarating va xarid boshlang</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Ism</label>
            <input
              type="text"
              className="form-input"
              placeholder="To'liq ismingiz"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              id="register-name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="email@misol.uz"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              id="register-email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Telefon raqam</label>
            <input
              type="tel"
              className="form-input"
              placeholder="+998 90 123 45 67"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              id="register-phone"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Parol</label>
            <input
              type="password"
              className="form-input"
              placeholder="Kamida 6 belgi"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              id="register-password"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Parolni tasdiqlash</label>
            <input
              type="password"
              className="form-input"
              placeholder="Parolni qayta kiriting"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              id="register-confirm-password"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading} id="register-submit">
            {loading ? 'Ro\'yxatdan o\'tilmoqda...' : 'Ro\'yxatdan o\'tish'}
          </button>
        </form>

        <div className="auth-footer">
          Hisobingiz bormi? <Link to="/login">Tizimga kirish</Link>
        </div>
      </div>
    </div>
  );
}
