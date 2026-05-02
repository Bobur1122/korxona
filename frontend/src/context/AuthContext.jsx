import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);
const BACKOFFICE_ROLES = ['admin', 'direktor', 'hodim'];
const BACKOFFICE_PATH_BY_ROLE = {
  admin: '/admin',
  direktor: '/director',
  hodim: '/hodim',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getProfile()
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (name, email, phone, password) => {
    const res = await api.register({ name, email, phone, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const role = user?.role || null;
  const isAdmin = role === 'admin';
  const isDirector = role === 'direktor';
  const isHodim = role === 'hodim';
  const isBackoffice = role ? BACKOFFICE_ROLES.includes(role) : false;
  const backofficePath = role ? BACKOFFICE_PATH_BY_ROLE[role] || '/admin' : null;

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateUser,
      isAdmin,
      isDirector,
      isHodim,
      isBackoffice,
      backofficePath,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
