const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts
} = require('../controllers/productController');
const { protect, rolesOnly } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/all', protect, rolesOnly('admin', 'direktor', 'hodim'), getAllProducts);
router.get('/:id', getProduct);
router.post('/', protect, rolesOnly('admin', 'direktor'), createProduct);
router.put('/:id', protect, rolesOnly('admin', 'direktor'), updateProduct);
router.delete('/:id', protect, rolesOnly('admin', 'direktor'), deleteProduct);

module.exports = router;
