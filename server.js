import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

// ВСТАВЬ СВОИ ДАННЫЕ
const TELEGRAM_BOT_TOKEN = '8793560896:AAHh3l17CLZQKFxWRlBlG9xAeccNOpIC9ss';
const TELEGRAM_CHAT_ID = '7766557564';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Telegram order server is running');
});

app.post('/send-order', async (req, res) => {
  try {
    const {
      name,
      phone,
      comment,
      width,
      height,
      quantity,
      meshType,
      profileType,
      frameColor,
      extras,
      services,
      total,
    } = req.body;

    const extrasText =
      [
        extras?.handles ? '• Ручки пластиковые 2 шт.' : null,
        extras?.crossbar ? '• Поперечный профиль 1 шт.' : null,
        extras?.zset ? '• Крепёж Z-образный металл. 4 шт.' : null,
        extras?.install ? '• Установка' : null,
      ]
        .filter(Boolean)
        .join('\n') || '—';

    const servicesText =
      [
        services?.measureCity ? '• Выезд на замер Сыктывкар' : null,
        services?.measureArea ? '• Выезд на замер Эжва, Выльгорт, Затон' : null,
        services?.deliveryCity ? '• Доставка Сыктывкар' : null,
        services?.deliveryArea ? '• Доставка Эжва, Выльгорт, Затон' : null,
      ]
        .filter(Boolean)
        .join('\n') || '—';

    const text =
      `📩 Новая заявка с VK Mini App\n\n` +
      `👤 Имя: ${name || '-'}\n` +
      `📞 Телефон: ${phone || '-'}\n` +
      `💬 Комментарий: ${comment || '-'}\n\n` +
      `📐 Ширина: ${width || '-'} мм\n` +
      `📐 Высота: ${height || '-'} мм\n` +
      `🔢 Количество: ${quantity || '-'}\n` +
      `🕸 Тип сетки: ${meshType || '-'}\n` +
      `🪟 Профиль: ${profileType || '-'}\n` +
      `🎨 Цвет рамки: ${frameColor || '-'}\n\n` +
      `➕ Доборные элементы:\n${extrasText}\n\n` +
      `🚚 Сервис:\n${servicesText}\n\n` +
      `💰 Сумма: ${total || 0} ₽`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
        }),
      }
    );

    const telegramData = await telegramResponse.json();

    if (!telegramData.ok) {
      console.error('Telegram API error:', telegramData);
      return res.status(500).json({
        ok: false,
        error: telegramData.description || 'Telegram API error',
      });
    }

    return res.json({
      ok: true,
      message: 'Заявка отправлена в Telegram',
    });
  } catch (error) {
    console.error('Ошибка отправки заявки:', error);
    return res.status(500).json({
      ok: false,
      error: error.message || 'Server error',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});