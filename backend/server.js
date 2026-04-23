const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { protect, adminOnly } = require('./middleware/auth');

// Route imports
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const promoRoutes = require('./routes/promo');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');
const newsRoutes = require('./routes/news');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/promo', promoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/news', newsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server ishlayapti' });
});

// Auto-translate endpoint
app.post('/api/translate', protect, adminOnly, async (req, res) => {
  try {
    const translate = (await import('google-translate-api-x')).default;
    const { texts, sourceLang } = req.body;
    // texts = { field1: "text1", field2: "text2" }
    // sourceLang = "uz" | "ru" | "en"
    if (!texts || !sourceLang) {
      return res.status(400).json({ success: false, message: 'texts va sourceLang kerak' });
    }

    const langMap = { uz: 'uz', ru: 'ru', en: 'en' };
    const targetLangs = Object.keys(langMap).filter(l => l !== sourceLang);

    const results = {};
    for (const lang of targetLangs) {
      results[lang] = {};
      for (const [field, text] of Object.entries(texts)) {
        if (!text || !text.trim()) {
          results[lang][field] = '';
          continue;
        }
        try {
          const translated = await translate(text, { from: langMap[sourceLang], to: langMap[lang] });
          results[lang][field] = translated.text;
        } catch (e) {
          results[lang][field] = text; // fallback to original
        }
      }
    }

    res.json({ success: true, data: results });
  } catch (err) {
    console.error('Translate error:', err);
    res.status(500).json({ success: false, message: 'Tarjima xatosi: ' + err.message });
  }
});

// Temporary seed endpoint — DELETE AFTER USE
app.get('/api/seed', async (req, res) => {
  if (req.query.key !== 'ogp2005') return res.status(403).json({ error: 'Invalid key' });
  try {
    const Product = require('./models/Product');
    const User = require('./models/User');
    const PromoCode = require('./models/PromoCode');

    await Promise.all([Product.deleteMany({}), User.deleteMany({}), PromoCode.deleteMany({})]);

    await User.create({ name: 'Admin', email: 'admin@grandplast.uz', phone: '+998996066333', password: 'admin123', role: 'admin' });
    await User.create({ name: 'Test Foydalanuvchi', email: 'user@grandplast.uz', phone: '+998991112233', password: 'user123', role: 'user' });

    const products = [
      { name_uz: 'Issiqxona plyonkasi 120 mkm (3 qatlamli)', description_uz: 'UV-barqaror, uch qatlamli polietilen plyonka. 12 metrgacha kenglik.', price: 45000, category: 'Issiqxona plyonkasi', image: '', stock: 200, thickness: 120, width: 12, length: 50, uvProtection: true },
      { name_uz: 'Issiqxona plyonkasi 150 mkm (3 qatlamli)', description_uz: 'Qalinlashtirilgan issiqxona plyonkasi. Yuqori UV himoya.', price: 55000, category: 'Issiqxona plyonkasi', image: '', stock: 150, thickness: 150, width: 12, length: 50, uvProtection: true },
      { name_uz: 'Issiqxona plyonkasi 100 mkm (iqtisodiy)', description_uz: 'Iqtisodiy variant. UV stabilizatorli.', price: 32000, category: 'Issiqxona plyonkasi', image: '', stock: 300, thickness: 100, width: 6, length: 100, uvProtection: true },
      { name_uz: 'Termo-usadoz plyonka 30 mkm', description_uz: 'Sanoat qadoqlash uchun termo-usadoz plyonka.', price: 18000, category: 'Termo-usadoz plyonka', image: '', stock: 500, thickness: 30, width: 0.5, length: 200, uvProtection: false },
      { name_uz: 'Termo-usadoz plyonka 50 mkm', description_uz: 'Mustahkam termo-usadoz plyonka. Omborxona uchun.', price: 25000, category: 'Termo-usadoz plyonka', image: '', stock: 400, thickness: 50, width: 0.5, length: 150, uvProtection: false },
      { name_uz: 'Polietilen paket (umumiy)', description_uz: 'Turli hajmdagi polietilen paketlar.', price: 8000, category: 'Polietilen paketlar', image: '', stock: 1000, thickness: 40, width: 0.4, length: 0.6, uvProtection: false },
      { name_uz: 'Vakuumli pul qadoqlash paketi', description_uz: 'Banklar uchun vakuum paket.', price: 15000, category: 'Polietilen paketlar', image: '', stock: 600, thickness: 80, width: 0.3, length: 0.4, uvProtection: false },
      { name_uz: 'PET kapsulalar (suv, 1L)', description_uz: 'Suv idishlari uchun kapsula. ~28 gr.', price: 5000, category: 'PET kapsulalar', image: '', stock: 2000, thickness: 28, width: 1, length: 1, uvProtection: false },
      { name_uz: 'PET kapsulalar (yog, 5-10L)', description_uz: 'Yog idishlari uchun PET kapsula. 84-140 gr.', price: 12000, category: 'PET kapsulalar', image: '', stock: 1500, thickness: 84, width: 1, length: 10, uvProtection: false },
      { name_uz: 'Roof Cover (gidroizolyatsiya)', description_uz: 'Tom yopish va gidroizolyatsiya materiali.', price: 35000, category: 'Tom yopish materiallari', image: '', stock: 250, thickness: 3, width: 1, length: 15, uvProtection: false },
      { name_uz: 'Roof Cover (alyuminiyli)', description_uz: 'Alyuminiy folga qatlamli tom yopish materiali.', price: 48000, category: 'Tom yopish materiallari', image: '', stock: 200, thickness: 4, width: 1.5, length: 15, uvProtection: false },
      { name_uz: 'Bitum-polimer mastika (20 kg)', description_uz: 'Gidroizolyatsiya uchun polimer mastika.', price: 65000, category: 'Bitum-polimer mastika', image: '', stock: 300, thickness: 20, width: 1, length: 1, uvProtection: false }
    ];
    await Product.insertMany(products);

    await PromoCode.insertMany([
      { code: 'YANGI10', discountPercent: 10, usageLimit: 100, expiresAt: new Date('2026-12-31') },
      { code: 'AGRO20', discountPercent: 20, usageLimit: 50, expiresAt: new Date('2026-12-31') },
      { code: 'VIP30', discountPercent: 30, usageLimit: 20, expiresAt: new Date('2026-12-31') }
    ]);

    res.json({ success: true, message: 'Baza yangilandi! Admin: admin@grandplast.uz / admin123' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Error handler
app.use(errorHandler);

// Start server AFTER database connection
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const connected = await connectDB();
  
  if (!connected) {
    console.log('MongoDB ga ulanib bo\'lmadi. 5 sekunddan keyin qayta urinish...');
    setTimeout(startServer, 5000);
    return;
  }

  app.listen(PORT, () => {
    console.log(`Server ${PORT}-portda ishlayapti`);
    console.log(`MongoDB ulangan, server tayyor!`);
  });
};

startServer();

module.exports = app;
