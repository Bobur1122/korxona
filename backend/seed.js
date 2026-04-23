const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const PromoCode = require('./models/PromoCode');
require('dotenv').config();

const products = [
  {
    name_uz: 'Issiqxona plyonkasi 120 mkm (3 qatlamli)',
    description_uz: 'UV-barqaror, uch qatlamli polietilen plyonka. O\'zbekistonda birinchi bo\'lib ishlab chiqarilgan 12 metrgacha kenglikdagi issiqxona qoplamasi.',
    price: 45000, category: 'Issiqxona plyonkasi', image: '', stock: 200,
    thickness: 120, width: 12, length: 50, uvProtection: true
  },
  {
    name_uz: 'Issiqxona plyonkasi 150 mkm (3 qatlamli)',
    description_uz: 'Qalinlashtirilgan issiqxona plyonkasi. Yuqori darajada issiqlik saqlash va UV himoya. Katta issiqxonalar uchun.',
    price: 55000, category: 'Issiqxona plyonkasi', image: '', stock: 150,
    thickness: 150, width: 12, length: 50, uvProtection: true
  },
  {
    name_uz: 'Issiqxona plyonkasi 100 mkm (iqtisodiy)',
    description_uz: 'Iqtisodiy variant. Kichik va o\'rta issiqxonalar uchun maqbul. UV stabilizatorli.',
    price: 32000, category: 'Issiqxona plyonkasi', image: '', stock: 300,
    thickness: 100, width: 6, length: 100, uvProtection: true
  },
  {
    name_uz: 'Termo-usadoz plyonka 30 mkm',
    description_uz: 'Sanoat qadoqlash uchun termo-usadoz plyonka. Issiq bilan ishlov berilganda qisqarib, mahsulotni mustahkam o\'raydi.',
    price: 18000, category: 'Termo-usadoz plyonka', image: '', stock: 500,
    thickness: 30, width: 0.5, length: 200, uvProtection: false
  },
  {
    name_uz: 'Termo-usadoz plyonka 50 mkm (mustahkam)',
    description_uz: 'Qalinlashtirilgan termo-usadoz plyonka. Og\'ir yuklar va paletalarni o\'rash uchun. Omborxona va logistika uchun.',
    price: 25000, category: 'Termo-usadoz plyonka', image: '', stock: 400,
    thickness: 50, width: 0.5, length: 150, uvProtection: false
  },
  {
    name_uz: 'Polietilen paket (umumiy maqsad)',
    description_uz: 'Ko\'p maqsadli polietilen paketlar. Mahsulotlarni saqlash va tashishda ishlatiladi. Turli hajm va qalinlikda.',
    price: 8000, category: 'Polietilen paketlar', image: '', stock: 1000,
    thickness: 40, width: 0.4, length: 0.6, uvProtection: false
  },
  {
    name_uz: 'Vakuumli pul qadoqlash paketi',
    description_uz: 'Banklar uchun maxsus mustahkam qatlamga ega vakuum usuli bilan pulni qadoqlash sumkasi.',
    price: 15000, category: 'Polietilen paketlar', image: '', stock: 600,
    thickness: 80, width: 0.3, length: 0.4, uvProtection: false
  },
  {
    name_uz: 'PET kapsulalar (suv uchun, 1L)',
    description_uz: 'Suv idishlari uchun egiluvchan polikarbonat kapsula. 1 litrli idishlar uchun ~28 gramm.',
    price: 5000, category: 'PET kapsulalar', image: '', stock: 2000,
    thickness: 28, width: 1, length: 1, uvProtection: false
  },
  {
    name_uz: 'PET kapsulalar (yog\' uchun, 5-10L)',
    description_uz: 'Yog\' idishlari uchun mustahkam PET kapsula. 5-10 litr hajmdagi idishlar uchun 84-140 gramm.',
    price: 12000, category: 'PET kapsulalar', image: '', stock: 1500,
    thickness: 84, width: 1, length: 10, uvProtection: false
  },
  {
    name_uz: 'Roof Cover (gidroizolyatsiya)',
    description_uz: '"Roof Cover" — tom yopish va gidroizolyatsiya uchun rulonli material. Issiq va sovuqqa chidamli.',
    price: 35000, category: 'Tom yopish materiallari', image: '', stock: 250,
    thickness: 3, width: 1, length: 15, uvProtection: false
  },
  {
    name_uz: 'Roof Cover (alyuminiyli)',
    description_uz: 'Alyuminiy folga qatlami bilan kuchaytirilgan tom yopish materiali. Yuqori suv va issiqlikka chidamli.',
    price: 48000, category: 'Tom yopish materiallari', image: '', stock: 200,
    thickness: 4, width: 1.5, length: 15, uvProtection: false
  },
  {
    name_uz: 'Bitum-polimer mastika (20 kg)',
    description_uz: 'Gidroizolyatsiya va hermetizatsiya ishlari uchun maxsus polimer aralashma. Qurilish va ta\'mirlash uchun.',
    price: 65000, category: 'Bitum-polimer mastika', image: '', stock: 300,
    thickness: 20, width: 1, length: 1, uvProtection: false
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB ulandi');
    await Promise.all([Product.deleteMany({}), User.deleteMany({}), PromoCode.deleteMany({})]);
    console.log('Eski ma\'lumotlar tozalandi');

    await User.create({ name: 'Admin', email: 'admin@grandplast.uz', phone: '+998996066333', password: 'admin123', role: 'admin' });
    await User.create({ name: 'Test Foydalanuvchi', email: 'user@grandplast.uz', phone: '+998991112233', password: 'user123', role: 'user' });
    await Product.insertMany(products);
    await PromoCode.insertMany([
      { code: 'YANGI10', discountPercent: 10, usageLimit: 100, expiresAt: new Date('2026-12-31') },
      { code: 'AGRO20', discountPercent: 20, usageLimit: 50, expiresAt: new Date('2026-12-31') },
      { code: 'VIP30', discountPercent: 30, usageLimit: 20, expiresAt: new Date('2026-12-31') }
    ]);

    console.log('\nSeed muvaffaqiyatli! Admin: admin@grandplast.uz / admin123');
    process.exit(0);
  } catch (err) {
    console.error('Seed xatosi:', err);
    process.exit(1);
  }
}
seed();
