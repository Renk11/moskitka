import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3001;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.use((req, res, next) => {
  console.log('--- NEW REQUEST ---');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use(express.text({ type: '*/*' }));

app.get('/', (req, res) => {
  res.status(200).send('Telegram order server is running');
});

app.post('/send-order', (req, res) => {
  try {
    console.log('POST /send-order entered');
    console.log('BODY TYPE:', typeof req.body);
    console.log('BODY:', req.body);

    return res.status(200).json({
      ok: true,
      message: 'TEST_OK_FROM_RAILWAY',
    });
  } catch (error) {
    console.error('TEST ROUTE ERROR:', error);
    return res.status(500).json({
      ok: false,
      error: error.message || 'Test route error',
    });
  }
});

    console.log('RAW BODY:', req.body);

    let body = {};

    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      console.log('PARSED BODY:', body);
    } catch (parseError) {
      console.error('JSON PARSE ERROR:', parseError);
      return res.status(400).json({
        ok: false,
        error: 'Некорректный JSON в body',
      });
    }

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
    } = body;

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

    console.log('MESSAGE READY');

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
        }),
      }
    );

    console.log('TELEGRAM STATUS:', telegramResponse.status);

    const telegramData = await telegramResponse.json();
    console.log('TELEGRAM RESPONSE:', telegramData);

    if (!telegramData.ok) {
      return res.status(500).json({
        ok: false,
        error: telegramData.description || 'Telegram API error',
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Заявка отправлена в Telegram',
    });
  } catch (error) {
    console.error('SERVER ERROR FULL:', error);
    return res.status(500).json({
      ok: false,
      error: error.message || 'Server error',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});