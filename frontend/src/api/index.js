const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    let data = {};
    if (res.status !== 204) {
      const raw = await res.text();
      if (raw) {
        try {
          data = JSON.parse(raw);
        } catch {
          data = { message: raw };
        }
      }
    }

    if (!res.ok) {
      let errorMessage = data.message || `So'rov bajarilmadi (${res.status})`;
      if (typeof errorMessage === 'string' && errorMessage.includes('<pre>Cannot')) {
        const match = errorMessage.match(/<pre>(.*?)<\/pre>/i);
        if (match?.[1]) {
          errorMessage = match[1];
        }
      }
      if (typeof errorMessage === 'string' && errorMessage.includes('Cannot POST /api/admin/users')) {
        errorMessage = 'Backend eski versiyada ishlayapti: POST /api/admin/users topilmadi. Backend serverni qayta ishga tushiring.';
      }
      throw new Error(errorMessage);
    }
    return data;
  } catch (err) {
    throw new Error(err.message || 'Server bilan aloqa o\'rnatib bo\'lmadi.');
  }
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
  getDashboard: (params = '') => request(`/admin/dashboard?${params}`),
  getUsers: (params = '') => request(`/admin/users?${params}`),
  createUser: (body) => request('/admin/users', { method: 'POST', body: JSON.stringify(body) }),
  updateUserRole: (id, role) => request(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  deleteUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
  
  getAllProducts: (params = '') => request(`/products/all?${params}`),
  createProduct: (body) => request('/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id, body) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  
  getAllOrders: (params = '') => request(`/orders/admin/all?${params}`),
  updateOrderStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  updateOrderPaymentStatus: (id, paymentStatus) => request(`/orders/${id}/payment`, { method: 'PUT', body: JSON.stringify({ paymentStatus }) }),
  
  getPromoCodes: (params = '') => request(`/promo?${params}`),
  createPromoCode: (body) => request('/promo', { method: 'POST', body: JSON.stringify(body) }),
  updatePromoCode: (id, body) => request(`/promo/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletePromoCode: (id) => request(`/promo/${id}`, { method: 'DELETE' }),

  // News
  getNews: (params = '') => request(`/news?${params}`),
  getNewsById: (id) => request(`/news/${id}`),
  getAllNews: (params = '') => request(`/news/all?${params}`),
  createNews: (body) => request('/news', { method: 'POST', body: JSON.stringify(body) }),
  updateNews: (id, body) => request(`/news/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteNews: (id) => request(`/news/${id}`, { method: 'DELETE' }),

  // Translate
  translate: (texts, sourceLang) => request('/translate', { method: 'POST', body: JSON.stringify({ texts, sourceLang }) }),
};
