const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Promokod kiritilishi shart'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [30, 'Promokod 30 belgidan oshmasligi kerak']
  },
  discountPercent: {
    type: Number,
    required: [true, 'Chegirma foizi kiritilishi shart'],
    min: [1, 'Chegirma kamida 1% bo\'lishi kerak'],
    max: [90, 'Chegirma 90% dan oshmasligi kerak']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

promoCodeSchema.methods.isValid = function() {
  if (!this.isActive) return false;
  if (this.expiresAt && new Date() > this.expiresAt) return false;
  if (this.usageLimit && this.usedCount >= this.usageLimit) return false;
  return true;
};

module.exports = mongoose.model('PromoCode', promoCodeSchema);
