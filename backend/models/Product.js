const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Multi-language name
  name_uz: { type: String, required: [true, 'Mahsulot nomi (UZ) kiritilishi shart'], trim: true, maxlength: 200 },
  name_ru: { type: String, default: '', trim: true, maxlength: 200 },
  name_en: { type: String, default: '', trim: true, maxlength: 200 },

  // Multi-language description
  description_uz: { type: String, required: [true, 'Tavsif (UZ) kiritilishi shart'], maxlength: 2000 },
  description_ru: { type: String, default: '', maxlength: 2000 },
  description_en: { type: String, default: '', maxlength: 2000 },

  price: { type: Number, required: [true, 'Narx kiritilishi shart'], min: [0, 'Narx manfiy bo\'lishi mumkin emas'] },
  stock: { type: Number, required: true, min: 0, default: 0 },
  image: { type: String, default: '' },
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
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Backward-compat virtual getters
productSchema.virtual('name').get(function() { return this.name_uz; });
productSchema.virtual('description').get(function() { return this.description_uz; });
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

productSchema.index({ name_uz: 'text', name_ru: 'text', name_en: 'text', description_uz: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ soldCount: -1 });

module.exports = mongoose.model('Product', productSchema);
