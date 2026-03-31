const fetch = require('node-fetch');

const sendTelegramNotification = async (order) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log('Telegram bot sozlamalari topilmadi, xabar yuborilmadi');
    return;
  }

  const itemsList = order.items
    .map((item, i) => `  ${i + 1}. ${item.name} x${item.quantity} — ${item.price.toLocaleString()} so'm`)
    .join('\n');

  const statusLabels = {
    kutilmoqda: '⏳ Kutilmoqda',
    qabul_qilindi: '✅ Qabul qilindi',
    tayyorlanmoqda: '🔨 Tayyorlanmoqda',
    yetkazildi: '📦 Yetkazildi'
  };

  const message = `
🆕 *YANGI BUYURTMA*

📋 *Buyurtma raqami:* \`${order.orderNumber}\`
👤 *Mijoz:* ${order.user?.name || 'Noma\'lum'}
📞 *Telefon:* ${order.phone}
📍 *Manzil:* ${order.shippingAddress}

📦 *Mahsulotlar:*
${itemsList}

💰 *Jami narx:* ${order.totalPrice.toLocaleString()} so'm
${order.discountAmount > 0 ? `🏷 *Chegirma:* -${order.discountAmount.toLocaleString()} so'm\n💵 *Yakuniy narx:* ${order.finalPrice.toLocaleString()} so'm` : ''}
📊 *Status:* ${statusLabels[order.status] || order.status}
🕐 *Sana:* ${new Date(order.createdAt).toLocaleString('uz-UZ')}
  `.trim();

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
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
