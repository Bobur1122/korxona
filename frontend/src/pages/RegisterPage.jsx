import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const { t } = useLanguage();
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
      setError(t('passwordMismatch'));
      return;
    }

    if (form.password.length < 6) {
      setError(t('passwordMinLength'));
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
        <h1 className="auth-title">{t('registerTitle')}</h1>
        <p className="auth-subtitle">{t('registerSubtitle')}</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('name')}</label>
            <input
              type="text"
              className="form-input"
              placeholder={t('fullNamePlaceholder')}
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              id="register-name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('email')}</label>
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
            <label className="form-label">{t('phoneLabel')}</label>
            <input
              type="tel"
              className="form-input"
              placeholder={t('phonePlaceholder')}
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              id="register-phone"
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('password')}</label>
            <input
              type="password"
              className="form-input"
              placeholder={t('minPasswordPlaceholder')}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              id="register-password"
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('confirmPassword')}</label>
            <input
              type="password"
              className="form-input"
              placeholder={t('confirmPasswordPlaceholder')}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              id="register-confirm-password"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading} id="register-submit">
            {loading ? t('registerLoading') : t('register')}
          </button>
        </form>

        <div className="auth-footer">
          {t('haveAccount')} <Link to="/login">{t('signIn')}</Link>
        </div>
      </div>
    </div>
  );
}
