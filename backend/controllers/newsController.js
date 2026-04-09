const News = require('../models/News');

// GET /api/news (public)
const getNews = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await News.countDocuments(query);
    const news = await News.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

    res.json({ success: true, data: news, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
  } catch (error) { next(error); }
};

// GET /api/news/:id
const getNewsById = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: 'Yangilik topilmadi' });
    res.json({ success: true, data: news });
  } catch (error) { next(error); }
};

// GET /api/news/all (admin)
const getAllNews = async (req, res, next) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json({ success: true, data: news });
  } catch (error) { next(error); }
};

// POST /api/news (admin)
const createNews = async (req, res, next) => {
  try {
    const news = await News.create(req.body);
    res.status(201).json({ success: true, data: news });
  } catch (error) { next(error); }
};

// PUT /api/news/:id (admin)
const updateNews = async (req, res, next) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!news) return res.status(404).json({ success: false, message: 'Yangilik topilmadi' });
    res.json({ success: true, data: news });
  } catch (error) { next(error); }
};

// DELETE /api/news/:id (admin)
const deleteNews = async (req, res, next) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: 'Yangilik topilmadi' });
    res.json({ success: true, message: 'Yangilik o\'chirildi' });
  } catch (error) { next(error); }
};

module.exports = { getNews, getNewsById, getAllNews, createNews, updateNews, deleteNews };
