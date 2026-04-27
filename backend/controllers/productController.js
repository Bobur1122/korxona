const Product = require('../models/Product');
const Order = require('../models/Order');
const { buildCreatedAtFilter } = require('../utils/dateRange');

function normalizeProductImages(body, { keepMissing = false } = {}) {
  const next = { ...(body || {}) };

  const hasImage = Object.prototype.hasOwnProperty.call(next, 'image');
  const hasImages = Object.prototype.hasOwnProperty.call(next, 'images');

  if (keepMissing && !hasImage && !hasImages) return next;

  const images = Array.isArray(next.images)
    ? next.images.filter((u) => typeof u === 'string' && u.trim() !== '')
    : undefined;

  const image = typeof next.image === 'string' ? next.image.trim() : undefined;

  if (images && images.length) {
    next.images = images;
    next.image = images[0];
  } else if (image) {
    next.image = image;
    next.images = [image];
  } else {
    next.image = '';
    next.images = [];
  }

  return next;
}

// GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
    // Treat legacy products with missing `isActive` as active.
    const query = { isActive: { $ne: false } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { name_uz: { $regex: search, $options: 'i' } },
        { name_ru: { $regex: search, $options: 'i' } },
        { name_en: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { description_uz: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { price: 1 };
    if (sort === 'price_desc') sortObj = { price: -1 };
    if (sort === 'name') sortObj = { name_uz: 1 };
    if (sort === 'popular') sortObj = { soldCount: -1, createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    let products = [];

    if (sort === 'popular') {
      const filteredIds = await Product.find(query).select('_id').lean();
      const idList = filteredIds.map((item) => item._id);

      const soldAgg = idList.length
        ? await Order.aggregate([
            { $unwind: '$items' },
            { $match: { 'items.product': { $in: idList } } },
            { $group: { _id: '$items.product', soldQty: { $sum: '$items.quantity' } } }
          ])
        : [];

      const soldMap = new Map(soldAgg.map((row) => [String(row._id), row.soldQty]));
      const allProducts = await Product.find(query).sort({ createdAt: -1 }).lean();

      allProducts.sort((a, b) => {
        const aSold = soldMap.get(String(a._id)) ?? a.soldCount ?? 0;
        const bSold = soldMap.get(String(b._id)) ?? b.soldCount ?? 0;
        if (aSold !== bSold) return bSold - aSold;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      products = allProducts.slice(skip, skip + Number(limit));
    } else {
      products = await Product.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit))
        .lean();
    }

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Mahsulot topilmadi'
      });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// POST /api/products (admin)
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(normalizeProductImages(req.body));
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id (admin)
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, normalizeProductImages(req.body, { keepMissing: true }), {
      new: true,
      runValidators: true
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Mahsulot topilmadi'
      });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id (admin)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Mahsulot topilmadi'
      });
    }
    res.json({ success: true, message: 'Mahsulot o\'chirildi' });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/all (admin - includes inactive)
const getAllProducts = async (req, res, next) => {
  try {
    const { startDate, endDate, isActive, category, search } = req.query;
    const createdAt = buildCreatedAtFilter(startDate, endDate);

    const query = {};
    if (createdAt) query.createdAt = createdAt;
    if (typeof isActive !== 'undefined' && isActive !== '') query.isActive = isActive === 'true';
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { name_uz: { $regex: search, $options: 'i' } },
        { name_ru: { $regex: search, $options: 'i' } },
        { name_en: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { description_uz: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getAllProducts };
