const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title_uz: { type: String, required: [true, 'Sarlavha (UZ) kiritilishi shart'], trim: true, maxlength: 300 },
  title_ru: { type: String, required: [true, 'Sarlavha (RU) kiritilishi shart'], trim: true, maxlength: 300 },
  title_en: { type: String, required: [true, 'Sarlavha (EN) kiritilishi shart'], trim: true, maxlength: 300 },

  content_uz: { type: String, required: [true, 'Matn (UZ) kiritilishi shart'], maxlength: 10000 },
  content_ru: { type: String, required: [true, 'Matn (RU) kiritilishi shart'], maxlength: 10000 },
  content_en: { type: String, required: [true, 'Matn (EN) kiritilishi shart'], maxlength: 10000 },

  image: { type: String, default: '' },
  category: {
    type: String,
    default: 'yangilik',
    enum: ['yangilik', 'aksiya', 'elon', 'maqola']
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

newsSchema.virtual('title').get(function() { return this.title_uz; });
newsSchema.virtual('content').get(function() { return this.content_uz; });
newsSchema.set('toJSON', { virtuals: true });
newsSchema.set('toObject', { virtuals: true });

newsSchema.index({ title_uz: 'text', title_ru: 'text', title_en: 'text' });

module.exports = mongoose.model('News', newsSchema);
