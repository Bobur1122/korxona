const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Legacy single-language fields (kept for backward compatibility)
  name: { type: String, default: '', trim: true, maxlength: 200 },
  description: { type: String, default: '', maxlength: 2000 },

  // Multi-language name
  name_uz: { type: String, required: [true, 'Mahsulot nomi (UZ) kiritilishi shart'], trim: true, maxlength: 200 },
  name_ru: { type: String, default: '', trim: true, maxlength: 200 },
  name_en: { type: String, default: '', trim: true, maxlength: 200 },

  // Multi-language description
  description_uz: { type: String, required: [true, 'Tavsif (UZ) kiritilishi shart'], maxlength: 2000 },
  description_ru: { type: String, default: '', maxlength: 2000 },
  description_en: { type: String, default: '', maxlength: 2000 },

  price: { type: Number, required: [true, 'Narx kiritilishi shart'], min: [0, 'Narx manfiy bo\'lishi mumkin emas'] },
  costPrice: { type: Number, default: 0, min: [0, 'Tan narx manfiy bo\'lishi mumkin emas'] },
  stock: { type: Number, required: true, min: 0, default: 0 },
  image: { type: String, default: '' },
  images: { type: [String], default: [] },
  category: {
    type: String,
    required: [true, 'Kategoriya kiritilishi shart'],
    trim: true,
    enum: {
      values: ['Issiqxona plyonkasi', 'Termo-usadoz plyonka', 'Polietilen paketlar', 'PET kapsulalar', 'Tom yopish materiallari', 'Bitum-polimer mastika'],
      message: 'Noto\'g\'ri kategoriya'
    }
  },
  thickness: { type: Number, min: 0 },
  width: { type: Number, min: 0 },
  length: { type: Number, min: 0 },
  uvProtection: { type: Boolean, default: false },
  color: { type: String, trim: true, default: 'shaffof' },
  soldCount: { type: Number, default: 0, min: 0 },
  viewCount: { type: Number, default: 0, min: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

productSchema.index({ name_uz: 'text', name_ru: 'text', name_en: 'text', description_uz: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ soldCount: -1 });
productSchema.index({ isActive: 1, category: 1, createdAt: -1 });
productSchema.index({ isActive: 1, createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
