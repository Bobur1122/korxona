const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');
const PromoCode = require('./models/PromoCode');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tikuvchilik';

const products = [
  {
    name: "Klassik erkaklar ko'ylagi",
    description: "Yuqori sifatli paxta matosidan tayyorlangan klassik erkaklar ko'ylagi. Ish va rasmiy tadbirlar uchun ideal. Yengil va qulay, teri bilan yaxshi aloqa qiladi.",
    price: 189000,
    stock: 45,
    category: "ko'ylak",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=500&fit=crop",
    isActive: true
  },
  {
    name: "Zamonaviy ayollar libosi",
    description: "Elegant va zamonaviy dizayndagi ayollar libosi. Turli ranglar va o'lchamlarda mavjud. Bayram va kundalik kiyim sifatida mos keladi.",
    price: 245000,
    stock: 30,
    category: "ko'ylak",
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&h=500&fit=crop",
    isActive: true
  },
  {
    name: "Biznes kostyum (erkaklar)",
    description: "Professional ko'rinish uchun mo'ljallangan yuqori sifatli biznes kostyum. To'liq to'plam: ko'ylak, shim va jilet. Import matosidan tikilgan.",
    price: 890000,
    stock: 15,
    category: "kostyum",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
    isActive: true
  },
  {
    name: "Sport kostyum (uniseks)",
    description: "Yumshoq va qulay sport kostyum. Yugurish, sport zali va ertalabki mashqlar uchun ideal. Paxta-poliester aralashmasidan tayyorlangan.",
    price: 320000,
    stock: 60,
    category: "sport",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=500&fit=crop",
    isActive: true
  },
  {
    name: "Klassik erkaklar shimi",
    description: "Sifatli matosidan tikilgan klassik erkaklar shimi. Ofis va rasmiy tadbirlar uchun mos. Barcha o'lchamlarda mavjud.",
    price: 210000,
    stock: 55,
    category: "shim",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=500&fit=crop",
    isActive: true
  },
  {
    name: "Qishki erkaklar paltosi",
    description: "Issiq va elegant qishki palto. Sovuq kunlar uchun ideal. Yuqori sifatli jun va kashemirdan tayyorlangan. Oq rang va qora rangda mavjud.",
    price: 750000,
    stock: 20,
    category: "palto",
    image: "https://images.unsplash.com/photo-1544923246-77307dd270b9?w=500&h=500&fit=crop",
    isActive: true
  },
  {
    name: "Ayollar jinsi shimi",
    description: "Zamonaviy fason ayollar jinsi shimi. Yumshoq denim matosidan tayyorlangan. Kundalik kiyim uchun juda qulay.",
    price: 175000,
    stock: 70,
    category: "shim",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=500&fit=crop",
    isActive: true
  },
  {
    name: "Bolalar sport kiyimi",
    description: "Bolalar uchun yumshoq va qulay sport kiyimi. 100% organik paxtadan tayyorlangan. 3-12 yosh bolalarga mo'ljallangan.",
    price: 145000,
    stock: 80,
    category: "sport",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&h=500&fit=crop",
    isActive: true
  },
  {
    name: "Premium ayollar kostyumi",
    description: "Zamonaviy va elegant ayollar biznes kostyumi. Ofis va rasmiy uchrashuvlar uchun ideal tanlov. Italiya matosidan tikilgan.",
    price: 680000,
    stock: 12,
    category: "kostyum",
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500&h=500&fit=crop",
    isActive: true
  },
  {
    name: "Yozgi yengil ko'ylak",
    description: "Yoz fasli uchun ideal yengil va nafis ko'ylak. Lin matosidan tayyorlangan. Havo o'tkazuvchi va qulay.",
    price: 155000,
    stock: 40,
    category: "ko'ylak",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cda3f0a?w=500&h=500&fit=crop",
    isActive: true
  },
  {
    name: "Erkaklar sport shimi",
    description: "Qulay va zamonaviy erkaklar sport shimi. Trenirovka va kundalik hayot uchun. Elastik bel va cho'ntaklar bilan.",
    price: 135000,
    stock: 90,
    category: "sport",
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&h=500&fit=crop",
    isActive: true
  },
  {
    name: "Qishki ayollar paltosi",
    description: "Zamonaviy dizayndagi issiq ayollar paltosi. Nafis va elegant ko'rinish. Sovuq kunlar uchun ajoyib tanlov.",
    price: 820000,
    stock: 18,
    category: "palto",
    image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500&h=500&fit=crop",
    isActive: true
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB ulandi');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await PromoCode.deleteMany({});
    console.log('Eski ma\'lumotlar tozalandi');

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@tikuvpro.uz',
      phone: '+998901234567',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Admin yaratildi:', admin.email);

    // Create test user
    const user = await User.create({
      name: 'Test Foydalanuvchi',
      email: 'user@tikuvpro.uz',
      phone: '+998901112233',
      password: 'user123',
      role: 'user'
    });
    console.log('Test foydalanuvchi yaratildi:', user.email);

    // Create products
    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} ta mahsulot yaratildi`);

    // Create promo codes
    await PromoCode.create([
      { code: 'YANGI10', discountPercent: 10, isActive: true },
      { code: 'BAHOR20', discountPercent: 20, isActive: true, expiresAt: new Date('2026-06-01') },
      { code: 'VIP30', discountPercent: 30, usageLimit: 5, isActive: true }
    ]);
    console.log('Promokodlar yaratildi');

    console.log('\n✅ Seed muvaffaqiyatli bajarildi!');
    console.log('\n📋 Admin kirish ma\'lumotlari:');
    console.log('   Email: admin@tikuvpro.uz');
    console.log('   Parol: admin123');
    console.log('\n📋 Test foydalanuvchi:');
    console.log('   Email: user@tikuvpro.uz');
    console.log('   Parol: user123');
    console.log('\n🏷️ Promokodlar: YANGI10 (10%), BAHOR20 (20%), VIP30 (30%)');

    process.exit(0);
  } catch (error) {
    console.error('Seed xatosi:', error);
    process.exit(1);
  }
}

seed();
