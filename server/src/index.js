// server/src/index.js
const path = require('path');

// Подтягиваем переменные из server/.env (а не из корня репо)
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

/* ----------------------------- PROD за прокси ----------------------------- */
if (IN_PROD) {
  // Нужно для корректной установки secure-кук за HTTPS-прокси (Render)
  app.set('trust proxy', 1);
}

/* --------------------------------- CORS ---------------------------------- */
// Поддержка нескольких доменов в CLIENT_ORIGIN (через запятую)
const allowedOrigins = String(CLIENT_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Разрешаем запросы без Origin (напр. Postman, SSR, health)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Корректная обработка preflight-запросов
app.options('*', cors({
  origin: (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin)),
  credentials: true,
}));

/* ----------------------------- Базовые миддлвары ----------------------------- */
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

/* --------------------- Раздача загруженных файлов --------------------- */
// ВАЖНО: до роутов
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

/* -------------------------------- Сессии -------------------------------- */
app.use(
  session({
    name: 'cc.sid',
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true, // продлеваем cookie при каждом запросе
    cookie: {
      httpOnly: true,
      sameSite: IN_PROD ? 'none' : 'lax', // для межсайтовых запросов (Vercel <-> Render)
      secure: IN_PROD,                    // cookie только по HTTPS в проде
      maxAge: 1000 * 60 * 60 * 24 * 7,    // 7 дней
    },
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      collectionName: 'sessions',
      // ttl берётся из cookie.maxAge
    }),
  })
);

/* -------------------------------- Passport ------------------------------- */
app.use(passport.initialize());
app.use(passport.session());

/* --------------------------------- Роуты --------------------------------- */
app.use('/health', require('./routes/health.routes'));
app.get('/', (_req, res) => res.send('CarCare API is running'));
app.use('/auth', require('./routes/auth.routes'));
app.use('/cars', require('./routes/car.routes'));
app.use('/expenses', require('./routes/expense.routes'));
app.use('/upload', require('./routes/upload.routes'));
app.use('/forum', require('./routes/forum'));

/* ---------------------- Глобальный обработчик ошибок ---------------------- */
app.use((err, _req, res, _next) => {
  console.error('UNCAUGHT ERROR:', err);
  // Не палим подробности в проде
  res.status(500).json({ message: 'Server error' });
});

/* ---------------------- Старт после подключения к БД ---------------------- */
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ MongoDB connected`);
      console.log(`🚀 API on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Mongo connection error:', err);
    process.exit(1);
  });
