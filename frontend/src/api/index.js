const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  let res;
  try {
    res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
  } catch (err) {
    throw new Error('Server bilan aloqa o\'rnatib bo\'lmadi. Backend ishlayotganini tekshiring.');
  }

  let data;
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    throw new Error('Server xato javob qaytardi. Backend va MongoDB ishlayotganini tekshiring.');
  }

  if (!res.ok) {
    throw new Error(data.message || 'So\'rov bajarilmadi');
  }

  return data;
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getProfile: () => request('/auth/profile'),
  updateProfile: (body) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),

  // Products
  getProducts: (params = '') => request(`/products?${params}`),
  getProduct: (id) => request(`/products/${id}`),
  
  // Orders
  createOrder: (body) => request('/orders', { method: 'POST', body: JSON.stringify(body) }),
  getMyOrders: () => request('/orders'),
  getOrder: (id) => request(`/orders/${id}`),
  
  // Promo
  validatePromo: (code) => request('/promo/validate', { method: 'POST', body: JSON.stringify({ code }) }),
  
  // Admin
  getDashboard: () => request('/admin/dashboard'),
  getUsers: () => request('/admin/users'),
  updateUserRole: (id, role) => request(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  deleteUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
  
  getAllProducts: () => request('/products/all'),
  createProduct: (body) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id, body) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  
  getAllOrders: (params = '') => request(`/orders/admin/all?${params}`),
  updateOrderStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  
  getPromoCodes: () => request('/promo'),
  createPromoCode: (body) => request('/promo', { method: 'POST', body: JSON.stringify(body) }),
  updatePromoCode: (id, body) => request(`/promo/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletePromoCode: (id) => request(`/promo/${id}`, { method: 'DELETE' }),
};
