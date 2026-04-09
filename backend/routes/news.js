const express = require('express');
const router = express.Router();
const { getNews, getNewsById, getAllNews, createNews, updateNews, deleteNews } = require('../controllers/newsController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getNews);
router.get('/all', protect, adminOnly, getAllNews);
router.get('/:id', getNewsById);
router.post('/', protect, adminOnly, createNews);
router.put('/:id', protect, adminOnly, updateNews);
router.delete('/:id', protect, adminOnly, deleteNews);

module.exports = router;
