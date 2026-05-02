const express = require('express');
const router = express.Router();
const { getNews, getNewsById, getAllNews, createNews, updateNews, deleteNews } = require('../controllers/newsController');
const { protect, rolesOnly } = require('../middleware/auth');

router.get('/', getNews);
router.get('/all', protect, rolesOnly('admin', 'direktor'), getAllNews);
router.get('/:id', getNewsById);
router.post('/', protect, rolesOnly('admin', 'direktor'), createNews);
router.put('/:id', protect, rolesOnly('admin', 'direktor'), updateNews);
router.delete('/:id', protect, rolesOnly('admin', 'direktor'), deleteNews);

module.exports = router;
