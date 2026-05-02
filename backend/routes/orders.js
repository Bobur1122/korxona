const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  updateOrderPaymentStatus
} = require('../controllers/orderController');
const { protect, rolesOnly } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/admin/all', protect, rolesOnly('admin', 'direktor', 'hodim'), getAllOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, rolesOnly('admin', 'direktor'), updateOrderStatus);
router.put('/:id/payment', protect, rolesOnly('admin', 'direktor'), updateOrderPaymentStatus);

module.exports = router;
