import { createContext, useContext, useState, useCallback } from 'react';

const translations = {
  uz: {
    // Nav
    home: 'Bosh sahifa', about: 'Biz haqimizda', products: 'Mahsulotlar',
    news: 'Yangiliklar', promotions: 'Aksiyalar', contacts: 'Kontaktlar',
    login: 'Kirish', register: "Ro'yxatdan o'tish", cart: 'Savatcha',
    profile: 'Profil', search: 'Qidirish...', adminPanel: 'Admin Panel',
    logout: 'Chiqish',

    // Hero
    heroBadge: 'Xalqaro standartlardagi ishlab chiqarish',
    heroTitle1: 'Sanoat va Agrosanoat Uchun',
    heroTitle2: 'Innovatsion Polimer',
    heroTitle3: 'Yechimlar',
    heroSubtitle: "2005-yildan buyon Markaziy Osiyo agrosanoati uchun premium polimer materiallar ishlab chiqaruvchi. O'zbekistonda birinchi bo'lib 12 metrlik uch qavatli issiqxona plyonkalarini joriy etgan texnologik yetakchi.",
    catalogBtn: 'Mahsulotlar Katalogi',
    aboutBtn: 'Korxona Haqida',
    founded: 'Tashkil Topgan', maxWidth: 'Max Kenglik (Record)', highTech: 'High-Tech Plyonka',

    // Sections
    trustedPartner: 'Ishonchli Hamkor', annualCapacity: 'Tonna Yillik Quvvat',
    yearsExperience: 'Yillik Tajriba', techSolutions: 'Texnologik Yechimlar.',
    techDesc: "Fizik-mexanik ko'rsatkichlari eng yuqori bo'lgan, global sanoat talablariga javob beruvchi 3 tabaqali polimer turlari.",
    agroTitle: 'Agrosanoat Komplekslari', thermoTitle: 'Termo Qadoqlash (Shrink)',
    logisticsTitle: 'Sanoat Logistika Paketlari', moreParams: 'Batafsil Parametrlar',
    onlineCatalog: 'Onlayn Katalog', fullList: "To'liq Ro'yxat",
    globalPartners: 'Global Hamkorlarimiz va Xom Ashyo Tizimi',
    b2bOffer: 'Katta hajmdagi B2B xaridlar uchun maxsus taklif',
    b2bDesc: '"Original Grand Plast" korxonasi dilerlar, fermer xo\'jaliklari va eksportyorlar uchun eng ma\'qul narx va muddatlarda shartnoma tuzishni kafolatlaydi.',
    requestOffer: 'Kommercheskiy Taklif So\'rash', headOffice: 'Bosh Ofis',

    // Products
    productInfo: 'BATAFSIL', allProducts: 'Barcha Mahsulotlar',
    price: 'Narx', inStock: 'Mavjud', outOfStock: 'Tugagan', addToCart: 'Savatga',
    added: "Qo'shildi", som: "so'm", thickness: 'Qalinlik', width: 'Eni',

    // News
    readMore: "BATAFSIL O'QISH", allNews: 'Barcha yangiliklar',
    feature: 'Yangilik', pressRelease: 'Press-reliz', announcement: "E'lon", article: 'Maqola',
    latestNews: 'So\'nggi Yangiliklar', newsSubtitle: 'Korxona yangiliklari va e\'lonlari',
    publishedAt: 'Nashr etilgan', backToNews: 'Yangiliklarga qaytish',

    // Contacts
    contactTitle: 'Biz bilan bog\'laning',
    contactSubtitle: "Savollaringiz bo'lsa yoki buyurtma bermoqchi bo'lsangiz — murojaat qiling",
    address: 'Manzil', addressValue: "Toshkent sh., Uchtepa tumani, Foziltepa ko'chasi, 9-uy",
    phone: 'Telefon', email: 'Email', website: 'Veb-sayt',
    workHours: 'Ish vaqti', workHoursValue: 'Du-Ju: 08:00 - 18:00',
    sendMessage: 'Xabar yuborish', yourName: 'Ismingiz', yourEmail: 'Email manzilingiz',
    yourPhone: 'Telefon raqamingiz', message: 'Xabaringiz', send: 'Yuborish',

    // About
    aboutHeroBadge: '2005 yildan beri faoliyat yuritmoqda',
    aboutHeroTitle: 'Original Grand Plast MChJ',
    aboutHeroDesc: "2005-yildan buyon polietilen va polimer materiallari ishlab chiqaruvchi Markaziy Osiyodagi yetakchi korxona. O'zbekistonda birinchi bo'lib 12 metrli uch qatlamli plyonkani taqdim etgan innovatsion zavod.",
    companyHistory: 'Tarix', companyAbout: 'Korxona haqida',
    activities: 'Faoliyat', mainDirections: 'Asosiy yo\'nalishlar',
    values: 'Qadriyatlar', missionTitle: 'Missiya va maqsad',
    contactSection: 'Aloqa', contactUs: 'Biz bilan bog\'laning',
    contactDesc: "Savollaringiz bo'lsa yoki buyurtma bermoqchi bo'lsangiz — murojaat qiling",
    callNow: "Qo'ng'iroq qilish", readyToPartner: 'Hamkorlik qilishga tayyormisiz?',
    partnerDesc: "Mahsulotlar, narxlar va yetkazib berish haqida batafsil ma'lumot uchun qo'ng'iroq qiling",

    // Auth
    loginTitle: 'Tizimga kirish', loginSubtitle: 'Hisobingizga kiring va xarid qiling',
    emailPlaceholder: 'email@misol.uz', password: 'Parol', passwordPlaceholder: 'Parolingiz',
    loggingIn: 'Kirilmoqda...', noAccount: "Hisobingiz yo'qmi?",
    registerTitle: "Ro'yxatdan o'tish", registerSubtitle: "Yangi hisob yarating",
    name: 'Ism', phonePlaceholder: '+998 90 123 45 67', registering: "Ro'yxatdan o'tilmoqda...",
    haveAccount: 'Hisobingiz bormi?',

    // Footer
    footerDesc: "O'zbekistonda polietilen plyonka va qadoqlash materiallari ishlab chiqaruvchi yetakchi korxona.",
    quickLinks: "Tezkor havolalar", contactInfo: "Aloqa ma'lumotlari",
    allRightsReserved: "Barcha huquqlar himoyalangan.",

    // Cart
    cartTitle: 'Savatcha', emptyCart: "Savatingiz bo'sh", continueShopping: 'Xarid qilishda davom etish',
    total: 'Jami', checkout: 'Buyurtma berish', removeItem: "O'chirish",
  },
  ru: {
    home: 'Главная', about: 'О нас', products: 'Продукция',
    news: 'Новости', promotions: 'Акции', contacts: 'Контакты',
    login: 'Войти', register: 'Регистрация', cart: 'Корзина',
    profile: 'Профиль', search: 'Поиск...', adminPanel: 'Админ панель',
    logout: 'Выйти',

    heroBadge: 'Производство по международным стандартам',
    heroTitle1: 'Для промышленности и сельского хозяйства',
    heroTitle2: 'Инновационные полимерные',
    heroTitle3: 'Решения',
    heroSubtitle: 'С 2005 года — ведущий производитель премиальных полимерных материалов для агропромышленного комплекса Центральной Азии. Технологический лидер, впервые внедривший 12-метровые трёхслойные тепличные плёнки в Узбекистане.',
    catalogBtn: 'Каталог продукции', aboutBtn: 'О предприятии',
    founded: 'Основано', maxWidth: 'Макс. ширина (Рекорд)', highTech: 'Высокотехнологичная плёнка',

    trustedPartner: 'Надёжный партнёр', annualCapacity: 'Тонн годовой мощности',
    yearsExperience: 'Лет опыта', techSolutions: 'Технологические решения.',
    techDesc: 'Трёхслойные полимерные материалы с наивысшими физико-механическими показателями, соответствующие мировым промышленным стандартам.',
    agroTitle: 'Агропромышленные комплексы', thermoTitle: 'Термоусадочная упаковка (Shrink)',
    logisticsTitle: 'Промышленные логистические пакеты', moreParams: 'Подробные параметры',
    onlineCatalog: 'Онлайн каталог', fullList: 'Полный список',
    globalPartners: 'Глобальные партнёры и система сырья',
    b2bOffer: 'Специальное предложение для крупных B2B закупок',
    b2bDesc: '«Original Grand Plast» гарантирует заключение контрактов на самых выгодных условиях для дилеров, фермерских хозяйств и экспортёров.',
    requestOffer: 'Запросить коммерческое предложение', headOffice: 'Головной офис',

    productInfo: 'ПОДРОБНЕЕ', allProducts: 'Все продукты',
    price: 'Цена', inStock: 'В наличии', outOfStock: 'Нет в наличии', addToCart: 'В корзину',
    added: 'Добавлено', som: 'сум', thickness: 'Толщина', width: 'Ширина',

    readMore: 'ЧИТАТЬ ДАЛЕЕ', allNews: 'Все новости',
    feature: 'Новость', pressRelease: 'Пресс-релиз', announcement: 'Объявление', article: 'Статья',
    latestNews: 'Последние новости', newsSubtitle: 'Новости и объявления предприятия',
    publishedAt: 'Опубликовано', backToNews: 'Вернуться к новостям',

    contactTitle: 'Свяжитесь с нами',
    contactSubtitle: 'Если у вас есть вопросы или вы хотите сделать заказ — обращайтесь',
    address: 'Адрес', addressValue: 'г. Ташкент, Учтепинский район, ул. Фозилтепа, дом 9',
    phone: 'Телефон', email: 'Эл. почта', website: 'Веб-сайт',
    workHours: 'Режим работы', workHoursValue: 'Пн-Пт: 08:00 - 18:00',
    sendMessage: 'Отправить сообщение', yourName: 'Ваше имя', yourEmail: 'Ваш email',
    yourPhone: 'Ваш телефон', message: 'Сообщение', send: 'Отправить',

    aboutHeroBadge: 'Работает с 2005 года',
    aboutHeroTitle: 'ООО Original Grand Plast',
    aboutHeroDesc: 'Ведущее предприятие Центральной Азии по производству полиэтиленовых и полимерных материалов с 2005 года. Инновационный завод, первым в Узбекистане представивший 12-метровую трёхслойную плёнку.',
    companyHistory: 'История', companyAbout: 'О компании',
    activities: 'Деятельность', mainDirections: 'Основные направления',
    values: 'Ценности', missionTitle: 'Миссия и цели',
    contactSection: 'Контакты', contactUs: 'Свяжитесь с нами',
    contactDesc: 'Если у вас есть вопросы или вы хотите сделать заказ — свяжитесь с нами',
    callNow: 'Позвонить', readyToPartner: 'Готовы к сотрудничеству?',
    partnerDesc: 'Позвоните для получения подробной информации о продукции, ценах и доставке',

    loginTitle: 'Вход в систему', loginSubtitle: 'Войдите в аккаунт для покупок',
    emailPlaceholder: 'email@example.com', password: 'Пароль', passwordPlaceholder: 'Ваш пароль',
    loggingIn: 'Вход...', noAccount: 'Нет аккаунта?',
    registerTitle: 'Регистрация', registerSubtitle: 'Создайте новый аккаунт',
    name: 'Имя', phonePlaceholder: '+998 90 123 45 67', registering: 'Регистрация...',
    haveAccount: 'Уже есть аккаунт?',

    footerDesc: 'Ведущее предприятие по производству полиэтиленовой плёнки и упаковочных материалов в Узбекистане.',
    quickLinks: 'Быстрые ссылки', contactInfo: 'Контактная информация',
    allRightsReserved: 'Все права защищены.',

    cartTitle: 'Корзина', emptyCart: 'Ваша корзина пуста', continueShopping: 'Продолжить покупки',
    total: 'Итого', checkout: 'Оформить заказ', removeItem: 'Удалить',
  },
  en: {
    home: 'Home', about: 'About Us', products: 'Products',
    news: 'News', promotions: 'Promotions', contacts: 'Contacts',
    login: 'Login', register: 'Register', cart: 'Cart',
    profile: 'Profile', search: 'Search...', adminPanel: 'Admin Panel',
    logout: 'Logout',

    heroBadge: 'Production to international standards',
    heroTitle1: 'For Industry & Agriculture',
    heroTitle2: 'Innovative Polymer',
    heroTitle3: 'Solutions',
    heroSubtitle: 'Since 2005, a leading manufacturer of premium polymer materials for Central Asian agro-industry. The technological leader that first introduced 12-meter three-layer greenhouse films in Uzbekistan.',
    catalogBtn: 'Products Catalog', aboutBtn: 'About Company',
    founded: 'Founded', maxWidth: 'Max Width (Record)', highTech: 'High-Tech Film',

    trustedPartner: 'Trusted Partner', annualCapacity: 'Tons Annual Capacity',
    yearsExperience: 'Years Experience', techSolutions: 'Technological Solutions.',
    techDesc: 'Three-layer polymer materials with the highest physical-mechanical properties, meeting global industrial standards.',
    agroTitle: 'Agricultural Complexes', thermoTitle: 'Shrink Wrapping',
    logisticsTitle: 'Industrial Logistics Packages', moreParams: 'Detailed Parameters',
    onlineCatalog: 'Online Catalog', fullList: 'Full List',
    globalPartners: 'Global Partners & Raw Material System',
    b2bOffer: 'Special offer for large B2B purchases',
    b2bDesc: '"Original Grand Plast" guarantees contracts on the most favorable terms for dealers, farms, and exporters.',
    requestOffer: 'Request Commercial Offer', headOffice: 'Head Office',

    productInfo: 'PRODUCT INFO', allProducts: 'All Products',
    price: 'Price', inStock: 'In Stock', outOfStock: 'Out of Stock', addToCart: 'Add to Cart',
    added: 'Added', som: 'UZS', thickness: 'Thickness', width: 'Width',

    readMore: 'READ MORE', allNews: 'All news',
    feature: 'Feature', pressRelease: 'Press Release', announcement: 'Announcement', article: 'Article',
    latestNews: 'Latest News', newsSubtitle: 'Company news and announcements',
    publishedAt: 'Published', backToNews: 'Back to news',

    contactTitle: 'Contact Us',
    contactSubtitle: 'Have questions or want to place an order? Get in touch',
    address: 'Address', addressValue: 'Tashkent, Uchtepa district, Foziltepa street, 9',
    phone: 'Phone', email: 'Email', website: 'Website',
    workHours: 'Working Hours', workHoursValue: 'Mon-Fri: 08:00 - 18:00',
    sendMessage: 'Send Message', yourName: 'Your Name', yourEmail: 'Your Email',
    yourPhone: 'Your Phone', message: 'Message', send: 'Send',

    aboutHeroBadge: 'Operating since 2005',
    aboutHeroTitle: 'Original Grand Plast LLC',
    aboutHeroDesc: 'A leading enterprise in Central Asia for the production of polyethylene and polymer materials since 2005. An innovative factory that was the first in Uzbekistan to introduce 12-meter three-layer film.',
    companyHistory: 'History', companyAbout: 'About Company',
    activities: 'Activities', mainDirections: 'Main Directions',
    values: 'Values', missionTitle: 'Mission & Goals',
    contactSection: 'Contact', contactUs: 'Contact Us',
    contactDesc: 'Have questions or want to place an order? Get in touch with us',
    callNow: 'Call Now', readyToPartner: 'Ready to partner?',
    partnerDesc: 'Call for detailed information about products, prices and delivery',

    loginTitle: 'Sign In', loginSubtitle: 'Sign in to your account to shop',
    emailPlaceholder: 'email@example.com', password: 'Password', passwordPlaceholder: 'Your password',
    loggingIn: 'Signing in...', noAccount: "Don't have an account?",
    registerTitle: 'Register', registerSubtitle: 'Create a new account',
    name: 'Name', phonePlaceholder: '+998 90 123 45 67', registering: 'Registering...',
    haveAccount: 'Already have an account?',

    footerDesc: 'Leading enterprise for the production of polyethylene film and packaging materials in Uzbekistan.',
    quickLinks: 'Quick Links', contactInfo: 'Contact Information',
    allRightsReserved: 'All rights reserved.',

    cartTitle: 'Shopping Cart', emptyCart: 'Your cart is empty', continueShopping: 'Continue Shopping',
    total: 'Total', checkout: 'Checkout', removeItem: 'Remove',
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('grandplast-lang');
    return saved || 'uz';
  });

  const changeLanguage = useCallback((lang) => {
    setLanguage(lang);
    localStorage.setItem('grandplast-lang', lang);
  }, []);

  const t = useCallback((key) => {
    return translations[language]?.[key] || translations.uz[key] || key;
  }, [language]);

  // Helper to get localized field from API object (e.g. product.name_uz / name_ru / name_en)
  const tl = useCallback((obj, field) => {
    if (!obj) return '';
    const localized = obj[`${field}_${language}`];
    if (localized) return localized;
    // Fallback chain: current lang -> uz -> virtual field
    return obj[`${field}_uz`] || obj[field] || '';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, tl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
