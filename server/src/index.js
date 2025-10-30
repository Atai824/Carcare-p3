// server/src/index.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
require('./config/passport');

const { connectDB } = require('./config/db');
const { PORT, CLIENT_ORIGIN, SESSION_SECRET, IN_PROD, MONGO_URI } = require('./config/env');

const app = express();

// В проде (Render за прокси) — доверяем прокси для корректной установки secure-кук
if (IN_PROD) app.set('trust proxy', 1);

// Преобразуем CLIENT_ORIGIN в массив (поддержка списка через запятую)
const allowedOrigins = (CLIENT_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// На всякий случай добавим Vercel/Render домены, если их нет
[
  'https://carcare-p3.vercel.app',
  'https://carcare-p3.onrender.com'
].forEach(o => { if (!allowedOrigins.includes(o)) allowedOrigins.push(o); });

app.use(
  cors({
    origin: [
      'https://carcare-p3.vercel.app',
      'https://carcare-p3.onrender.com'
    ],
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Статика для /uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Сессия
app.use(
  session({
    name: 'cc.sid',
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      sameSite: IN_PROD ? 'none' : 'lax', // важно для разных доменов
      secure: IN_PROD,                    // в проде обязательно HTTPS
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      collectionName: 'sessions',
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Роуты
app.use('/health', require('./routes/health.routes'));
app.get('/', (_req, res) => res.send('CarCare API'));
app.use('/auth', require('./routes/auth.routes'));
app.use('/cars', require('./routes/car.routes'));
app.use('/expenses', require('./routes/expense.routes'));
app.use('/upload', require('./routes/upload.routes'));
app.use('/forum', require('./routes/forum'));

// Глобальный обработчик ошибок
app.use((err, _req, res, _next) => {
  console.error('UNCAUGHT ERROR:', err);
  res.status(500).json({ message: 'Server error' });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Mongo connection error:', err);
    process.exit(1);
  });
