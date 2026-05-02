const Order = require('../models/Order');
const Product = require('../models/Product');
const PromoCode = require('../models/PromoCode');
const { sendTelegramNotification } = require('../utils/telegram');
const { buildCreatedAtFilter } = require('../utils/dateRange');

const BACKOFFICE_ROLES = ['admin', 'direktor', 'hodim'];
const ORDER_STATUS_FLOW = ['kutilmoqda', 'qabul_qilindi', 'tayyorlanmoqda', 'yuklandi', 'yuborildi', 'yetkazildi'];
const PAYMENT_PLANS = ['oldindan', 'avans', 'yuklangandan_keyin'];
const PAYMENT_STATUSES = ['kutilmoqda', 'tushdi'];
const ORDER_STATUS_ALIASES = {
  kutilmoqda: 'kutilmoqda',
  "kutilmoqda": 'kutilmoqda',
  pending: 'kutilmoqda',
  qabul_qilindi: 'qabul_qilindi',
  'qabul qilindi': 'qabul_qilindi',
  qabulqilindi: 'qabul_qilindi',
  accepted: 'qabul_qilindi',
  tayyorlanmoqda: 'tayyorlanmoqda',
  tayyor: 'tayyorlanmoqda',
  preparing: 'tayyorlanmoqda',
  yuklandi: 'yuklandi',
  loaded: 'yuklandi',
  yuborildi: 'yuborildi',
  sent: 'yuborildi',
  yetkazildi: 'yetkazildi',
  delivered: 'yetkazildi',
};

function statusIndex(status) {
  return ORDER_STATUS_FLOW.indexOf(status);
}

function normalizeOrderStatus(status) {
  const raw = String(status || '').trim().toLowerCase();
  if (!raw) return '';
  if (ORDER_STATUS_FLOW.includes(raw)) return raw;
  const compact = raw.replace(/\s+/g, '_');
  if (ORDER_STATUS_FLOW.includes(compact)) return compact;
  return ORDER_STATUS_ALIASES[raw] || ORDER_STATUS_ALIASES[compact] || '';
}

// POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, phone, notes, promoCode, customerName, companyName, orderSource, paymentPlan } = req.body;
    const isBackofficeUser = BACKOFFICE_ROLES.includes(req.user.role);
    const requestedSource = orderSource === 'offline' ? 'offline' : 'online';

    if (requestedSource === 'offline' && !isBackofficeUser) {
      return res.status(403).json({
        success: false,
        message: 'Qo\'ng\'iroq orqali buyurtma qo\'shish ruxsati yo\'q'
      });
    }

    const finalOrderSource = requestedSource === 'offline' && isBackofficeUser ? 'offline' : 'online';
    const normalizedCustomerName = String(customerName || req.user.name || '').trim();
    const normalizedCompanyName = String(companyName || '').trim();
    const normalizedPaymentPlan = paymentPlan || 'avans';

    if (!normalizedCustomerName) {
      return res.status(400).json({
        success: false,
        message: 'Mijoz ismini kiriting'
      });
    }

    if (finalOrderSource === 'offline' && !normalizedCompanyName) {
      return res.status(400).json({
        success: false,
        message: 'Kompaniya nomini kiriting'
      });
    }

    if (!PAYMENT_PLANS.includes(normalizedPaymentPlan)) {
      return res.status(400).json({
        success: false,
        message: 'To\'lov turi noto\'g\'ri'
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Buyurtmada kamida bitta mahsulot bo\'lishi kerak'
      });
    }

    let orderItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const quantity = Number(item.quantity);
      if (!quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Miqdor kamida 1 bo\'lishi kerak'
        });
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Mahsulot topilmadi: ${item.product}`
        });
      }

      const displayName =
        product.name_uz ||
        product.name ||
        product.name_ru ||
        product.name_en ||
        'Mahsulot';

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `"${displayName}" yetarli miqdorda mavjud emas. Mavjud: ${product.stock}`
        });
      }

      orderItems.push({
        product: product._id,
        name: displayName,
        price: product.price,
        costPrice: product.costPrice || 0,
        quantity,
        image: product.image
      });

      totalPrice += product.price * quantity;

      // Reduce stock (no validation — supports legacy Product docs missing name_uz/description_uz)
      const setFields = {};
      if (!product.name_uz && product.name) setFields.name_uz = product.name;
      if (!product.description_uz && product.description) setFields.description_uz = product.description;

      const update = { $inc: { stock: -quantity, soldCount: quantity } };
      if (Object.keys(setFields).length) update.$set = setFields;

      const updated = await Product.collection.updateOne(
        { _id: product._id, stock: { $gte: quantity } },
        update
      );

      if (!updated.modifiedCount) {
        return res.status(400).json({
          success: false,
          message: `"${displayName}" yetarli miqdorda mavjud emas. Iltimos, qaytadan urinib ko'ring.`
        });
      }
    }

    let discountAmount = 0;
    let finalPrice = totalPrice;

    if (promoCode && finalOrderSource === 'online') {
      const promo = await PromoCode.findOne({ code: promoCode.toUpperCase() });
      if (promo && promo.isValid()) {
        discountAmount = Math.round(totalPrice * promo.discountPercent / 100);
        finalPrice = totalPrice - discountAmount;
        promo.usedCount += 1;
        await promo.save();
      } else {
        return res.status(400).json({
          success: false,
          message: 'Promokod yaroqsiz yoki muddati tugagan'
        });
      }
    }

    const order = await Order.create({
      user: req.user._id,
      customerName: normalizedCustomerName,
      companyName: normalizedCompanyName,
      orderSource: finalOrderSource,
      createdByStaff: finalOrderSource === 'offline' ? req.user._id : null,
      items: orderItems,
      totalPrice,
      discountAmount,
      finalPrice,
      promoCode: promoCode && finalOrderSource === 'online' ? promoCode.toUpperCase() : null,
      paymentPlan: normalizedPaymentPlan,
      paymentStatus: 'kutilmoqda',
      shippingAddress,
      phone,
      notes
    });

    const populatedOrder = await Order.findById(order._id).populate('user', 'name email phone');
    
    // Send Telegram notification
    sendTelegramNotification(populatedOrder).catch(err => {
      console.error('Telegram notification xatosi:', err);
    });

    res.status(201).json({ success: true, data: populatedOrder });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders (user's orders)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name_uz name_ru name_en image');
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Buyurtma topilmadi'
      });
    }

    const canAccessBackofficeOrder = ['admin', 'direktor', 'hodim'].includes(req.user.role);
    const orderUserId = order.user?._id?.toString?.() || order.user?.toString?.() || null;
    if (!canAccessBackofficeOrder && orderUserId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Ruxsat etilmagan'
      });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/admin/all (admin)
const getAllOrders = async (req, res, next) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) {
      const normalized = normalizeOrderStatus(status);
      if (normalized) query.status = normalized;
    }
    const createdAt = buildCreatedAtFilter(startDate, endDate);
    if (createdAt) query.createdAt = createdAt;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('createdByStaff', 'name role')
      .populate('items.product', 'name_uz name_ru name_en image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      data: orders,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/orders/:id/status (admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const normalizedStatus = normalizeOrderStatus(status);

    if (!ORDER_STATUS_FLOW.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri status'
      });
    }

    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Buyurtma topilmadi'
      });
    }

    const currentStatus = normalizeOrderStatus(order.status) || order.status;
    const currentIndex = statusIndex(currentStatus);
    const nextIndex = statusIndex(normalizedStatus);

    if (nextIndex < currentIndex) {
      return res.status(400).json({
        success: false,
        message: 'Statusni oldingi bosqichga qaytarib bo\'lmaydi'
      });
    }

    order.status = normalizedStatus;
    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// PUT /api/orders/:id/payment
const updateOrderPaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus } = req.body;

    if (!PAYMENT_STATUSES.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Noto\'g\'ri to\'lov statusi'
      });
    }

    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Buyurtma topilmadi'
      });
    }

    const normalizedCurrentStatus = normalizeOrderStatus(order.status) || order.status;
    if (paymentStatus === 'tushdi' && statusIndex(normalizedCurrentStatus) < statusIndex('yuklandi')) {
      return res.status(400).json({
        success: false,
        message: 'Pul tushdi statusi uchun buyurtma kamida "yuklandi" bosqichida bo\'lishi kerak'
      });
    }

    order.paymentStatus = paymentStatus;
    order.paymentReceivedAt = paymentStatus === 'tushdi' ? new Date() : null;
    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus, updateOrderPaymentStatus };
