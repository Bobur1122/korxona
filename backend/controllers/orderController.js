const Order = require('../models/Order');
const Product = require('../models/Product');
const PromoCode = require('../models/PromoCode');
const { sendTelegramNotification } = require('../utils/telegram');

// POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, phone, notes, promoCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Buyurtmada kamida bitta mahsulot bo\'lishi kerak'
      });
    }

    let orderItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Mahsulot topilmadi: ${item.product}`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `"${product.name}" yetarli miqdorda mavjud emas. Mavjud: ${product.stock}`
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        costPrice: product.costPrice || 0,
        quantity: item.quantity,
        image: product.image
      });

      totalPrice += product.price * item.quantity;

      // Reduce stock
      product.stock -= item.quantity;
      product.soldCount = (product.soldCount || 0) + item.quantity;
      await product.save();
    }

    let discountAmount = 0;
    let finalPrice = totalPrice;

    if (promoCode) {
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
      items: orderItems,
      totalPrice,
      discountAmount,
      finalPrice,
      promoCode: promoCode ? promoCode.toUpperCase() : null,
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

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
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
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
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
    const validStatuses = ['kutilmoqda', 'qabul_qilindi', 'tayyorlanmoqda', 'yetkazildi'];

    if (!validStatuses.includes(status)) {
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

    const currentIndex = validStatuses.indexOf(order.status);
    const nextIndex = validStatuses.indexOf(status);

    if (nextIndex < currentIndex) {
      return res.status(400).json({
        success: false,
        message: 'Statusni oldingi bosqichga qaytarib bo\'lmaydi'
      });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus };
