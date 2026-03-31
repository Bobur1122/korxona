const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Miqdor kamida 1 bo\'lishi kerak']
  },
  image: String
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true
  },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: function(v) { return v.length > 0; },
      message: 'Buyurtmada kamida 1 ta mahsulot bo\'lishi kerak'
    }
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  finalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  promoCode: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['kutilmoqda', 'qabul_qilindi', 'tayyorlanmoqda', 'yetkazildi'],
    default: 'kutilmoqda'
  },
  shippingAddress: {
    type: String,
    required: [true, 'Yetkazish manzili kiritilishi shart']
  },
  phone: {
    type: String,
    required: [true, 'Telefon raqam kiritilishi shart']
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `TK-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderNumber: 1 });

module.exports = mongoose.model('Order', orderSchema);
