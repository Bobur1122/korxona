const fetch = require('node-fetch');

const statusLabels = {
  kutilmoqda: 'Kutilmoqda',
  qabul_qilindi: 'Qabul qilindi',
  tayyorlanmoqda: 'Tayyorlanmoqda',
  yuklandi: 'Yuklandi',
  yuborildi: 'Yuborildi',
  yetkazildi: 'Yetkazildi',
};

const paymentPlanLabels = {
  oldindan: 'Oldindan',
  avans: 'Avans',
  yuklangandan_keyin: 'Yuklangandan keyin',
};

const sendTelegramNotification = async (order) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log('Telegram bot sozlamalari topilmadi, xabar yuborilmadi');
    return;
  }

  const itemsList = order.items
    .map((item, i) => `${i + 1}. ${item.name} x${item.quantity} - ${item.price.toLocaleString()} so'm`)
    .join('\n');

  const customerLabel = order.customerName || order.user?.name || 'Noma\'lum';
  const companyLabel = order.companyName || '-';
  const sourceLabel = order.orderSource === 'offline' ? "Qo'ng'iroq orqali" : 'Online';
  const paymentPlanLabel = paymentPlanLabels[order.paymentPlan] || order.paymentPlan || '-';

  const message = [
    '*YANGI BUYURTMA*',
    '',
    `Buyurtma raqami: ${order.orderNumber}`,
    `Mijoz: ${customerLabel}`,
    `Kompaniya: ${companyLabel}`,
    `Turi: ${sourceLabel}`,
    `Telefon: ${order.phone}`,
    `Manzil: ${order.shippingAddress}`,
    `To'lov turi: ${paymentPlanLabel}`,
    '',
    'Mahsulotlar:',
    itemsList,
    '',
    `Jami narx: ${order.totalPrice.toLocaleString()} so'm`,
    order.discountAmount > 0
      ? `Chegirma: -${order.discountAmount.toLocaleString()} so'm\nYakuniy narx: ${order.finalPrice.toLocaleString()} so'm`
      : `Yakuniy narx: ${order.finalPrice.toLocaleString()} so'm`,
    `Status: ${statusLabels[order.status] || order.status}`,
    `Sana: ${new Date(order.createdAt).toLocaleString('uz-UZ')}`,
  ].join('\n');

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error('Telegram xabar xatosi:', data.description);
    } else {
      console.log('Telegram xabar yuborildi');
    }
  } catch (error) {
    console.error('Telegram xabar yuborishda xato:', error.message);
  }
};

module.exports = { sendTelegramNotification };
