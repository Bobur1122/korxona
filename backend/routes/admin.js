const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  createUser,
  updateUserRole,
  deleteUser
} = require('../controllers/adminController');
const { protect, adminOnly, rolesOnly } = require('../middleware/auth');

router.use(protect, rolesOnly('admin', 'direktor'));

router.get('/dashboard', getDashboardStats);
router.get('/users', adminOnly, getUsers);
router.post('/users', adminOnly, createUser);
router.put('/users/:id/role', adminOnly, updateUserRole);
router.delete('/users/:id', adminOnly, deleteUser);

module.exports = router;
