const express = require('express');
const router = express.Router();
const {
  getPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  validatePromoCode
} = require('../controllers/promoController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/validate', protect, validatePromoCode);
router.get('/', protect, adminOnly, getPromoCodes);
router.post('/', protect, adminOnly, createPromoCode);
router.put('/:id', protect, adminOnly, updatePromoCode);
router.delete('/:id', protect, adminOnly, deletePromoCode);

module.exports = router;
