// server/src/index.js
const path = require('path');

// Подтягиваем переменные из server/.env
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

// В проде доверяем прокси (например, за Nginx/Ingress), чтобы secure-куки работали
if (IN_PROD) {
  app.set('trust proxy', 1);
}

// Базовые миддлвары
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Раздача загруженных файлов (ВАЖНО: до роутов)
app.use(
  '/uploads',
  express.static(path.join(__dirname, '..', 'uploads'))
);

// Сессии (хранятся в Mongo)
app.use(
  session({
    name: 'cc.sid',
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true, // продлеваем срок жизни при каждом запросе
    cookie: {
      httpOnly: true,
      sameSite: IN_PROD ? 'none' : 'lax', // в проде разрешаем межсайтовые куки
      secure: IN_PROD,                    // в проде нужна HTTPS
      maxAge: 1000 * 60 * 60 * 24 * 7,    // 7 дней
    },
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      collectionName: 'sessions',
      // ttl возьмётся из cookie.maxAge
    }),
  })
);

// Passport (auth)
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

// Глобальный обработчик ошибок (должен быть в самом конце после всех use)
app.use((err, _req, res, _next) => {
  console.error('UNCAUGHT ERROR:', err);
  res.status(500).json({ message: 'Server error' });
});

// Старт сервера после подключения к БД
connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 API on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('Mongo connection error:', err);
    process.exit(1);
  });
