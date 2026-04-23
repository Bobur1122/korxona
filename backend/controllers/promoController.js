const PromoCode = require('../models/PromoCode');
const { buildCreatedAtFilter } = require('../utils/dateRange');

// GET /api/promo
const getPromoCodes = async (req, res, next) => {
  try {
    const { startDate, endDate, isActive, search } = req.query;
    const createdAt = buildCreatedAtFilter(startDate, endDate);

    const query = {};
    if (createdAt) query.createdAt = createdAt;
    if (typeof isActive !== 'undefined' && isActive !== '') query.isActive = isActive === 'true';
    if (search) query.code = { $regex: search, $options: 'i' };

    const codes = await PromoCode.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: codes });
  } catch (error) {
    next(error);
  }
};

// POST /api/promo
const createPromoCode = async (req, res, next) => {
  try {
    const { code, discountPercent, usageLimit, expiresAt } = req.body;
    const promo = await PromoCode.create({
      code: code.toUpperCase(),
      discountPercent,
      usageLimit: usageLimit || null,
      expiresAt: expiresAt || null
    });
    res.status(201).json({ success: true, data: promo });
  } catch (error) {
    next(error);
  }
};

// PUT /api/promo/:id
const updatePromoCode = async (req, res, next) => {
  try {
    const promo = await PromoCode.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!promo) {
      return res.status(404).json({ success: false, message: 'Promokod topilmadi' });
    }
    res.json({ success: true, data: promo });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/promo/:id
const deletePromoCode = async (req, res, next) => {
  try {
    const promo = await PromoCode.findByIdAndDelete(req.params.id);
    if (!promo) {
      return res.status(404).json({ success: false, message: 'Promokod topilmadi' });
    }
    res.json({ success: true, message: 'Promokod o\'chirildi' });
  } catch (error) {
    next(error);
  }
};

// POST /api/promo/validate
const validatePromoCode = async (req, res, next) => {
  try {
    const { code } = req.body;
    const promo = await PromoCode.findOne({ code: code.toUpperCase() });

    if (!promo || !promo.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'Promokod yaroqsiz yoki muddati tugagan'
      });
    }

    res.json({
      success: true,
      data: {
        code: promo.code,
        discountPercent: promo.discountPercent
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPromoCodes, createPromoCode, updatePromoCode, deletePromoCode, validatePromoCode };
