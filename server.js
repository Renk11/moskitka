import express from 'express';

console.log('SERVER FILE LOADED');

const app = express();
const PORT = process.env.PORT || 3001;

app.use((req, res, next) => {
  console.log('MIDDLEWARE HIT:', req.method, req.path);
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use(express.text({ type: '*/*' }));

app.get('/', (req, res) => {
  console.log('GET / HIT');
  res.status(200).send('Telegram order server is running');
});

app.post('/send-order', (req, res) => {
  console.log('POST /send-order entered');
  console.log('BODY TYPE:', typeof req.body);
  console.log('BODY:', req.body);

  return res.status(200).json({
    ok: true,
    message: 'TEST_OK_FROM_RAILWAY',
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});