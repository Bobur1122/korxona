# TikuvPro — Professional Tikuvchilik Web Ilovasi

## Tezkor sozlash

### 1. MongoDB o'rnatish va ishga tushirish
MongoDB kompyuteringizda o'rnatilgan bo'lishi kerak:
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) dan yuklab oling
- O'rnatgandan keyin `mongod` xizmatini ishga tushiring

### 2. Ma'lumotlarni yuklash (Seed)
```bash
cd backend
npm run seed
```

Bu buyruq quyidagilarni yaratadi:
- **Admin:** email: `admin@tikuvpro.uz`, parol: `admin123`
- **Test user:** email: `user@tikuvpro.uz`, parol: `user123`
- 12 ta namuna mahsulotlar
- 3 ta promokodlar: `YANGI10` (10%), `BAHOR20` (20%), `VIP30` (30%)

### 3. Loyihani ishga tushirish
```bash
npm run dev
```
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Admin panelga kirish
1. http://localhost:3000/login ga o'ting
2. `admin@tikuvpro.uz` / `admin123` bilan kiring
3. http://localhost:3000/admin ga o'ting
