import express from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

// Разрешаем запросы из VK Mini App
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Принимаем body как текст
app.use(express.text({ type: '*/*' }));

app.get('/', (req, res) => {
  res.status(200).send('Telegram order server is running');
});

// ВРЕМЕННЫЙ ТЕСТОВЫЙ маршрут БЕЗ Telegram
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

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});