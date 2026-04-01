const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Mahsulot nomi kiritilishi shart'],
    trim: true,
    maxlength: [200, 'Nom 200 belgidan oshmasligi kerak']
  },
  description: {
    type: String,
    required: [true, 'Tavsif kiritilishi shart'],
    maxlength: [2000, 'Tavsif 2000 belgidan oshmasligi kerak']
  },
  price: {
    type: Number,
    required: [true, 'Narx kiritilishi shart'],
    min: [0, 'Narx manfiy bo\'lishi mumkin emas']
  },
  stock: {
    type: Number,
    required: [true, 'Mavjud soni kiritilishi shart'],
    min: [0, 'Soni manfiy bo\'lishi mumkin emas'],
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: [true, 'Kategoriya kiritilishi shart'],
    trim: true,
    enum: {
      values: ['Issiqxona plyonkasi', 'Termo-usadoz plyonka', 'Polietilen paketlar', 'PET kapsulalar', 'Tom yopish materiallari', 'Bitum-polimer mastika'],
      message: 'Noto\'g\'ri kategoriya'
    }
  },
  thickness: {
    type: Number,
    min: [0, 'Qalinlik manfiy bo\'lishi mumkin emas']
  },
  width: {
    type: Number,
    min: [0, 'Eni manfiy bo\'lishi mumkin emas']
  },
  length: {
    type: Number,
    min: [0, 'Uzunlik manfiy bo\'lishi mumkin emas']
  },
  uvProtection: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    trim: true,
    default: 'shaffof'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });

module.exports = mongoose.model('Product', productSchema);
