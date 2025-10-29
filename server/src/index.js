// server/src/index.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') }); // подхватываем server/.env

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

// доверять прокси в проде (для корректной secure-куки за CDN/Ingress)
if (IN_PROD) {
  app.set('trust proxy', 1);
}

// базовые миддлвары
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// сессии в Mongo
app.use(session({
  name: 'cc.sid',
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true, // продлеваем maxAge при каждом запросе
  cookie: {
    httpOnly: true,
    sameSite: IN_PROD ? 'none' : 'lax', // прод: разрешить межсайтовую передачу
    secure: IN_PROD,                    // прод: нужна HTTPS, иначе кука не поедет
    maxAge: 1000 * 60 * 60 * 24 * 7,    // 7 дней
  },
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    collectionName: 'sessions',
    // ttl можно не указывать: connect-mongo сам возьмёт из cookie.maxAge
  }),
}));

app.use(passport.initialize());
app.use(passport.session());

// маршруты
app.use('/health', require('./routes/health.routes'));
app.get('/', (_req, res) => res.send('CarCare API'));
app.use('/auth', require('./routes/auth.routes'));
app.use('/cars', require('./routes/car.routes'));
app.use('/expenses', require('./routes/expense.routes'));
app.use('/upload', require('./routes/upload.routes'));
app.use('/forum', require('./routes/forum'));

// статика для загруженных фото
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// в конце server/src/index.js, после всех app.use(...)
app.use((err, _req, res, _next) => {
  console.error('UNCAUGHT ERROR:', err);
  res.status(500).json({ message: 'Server error' });
});


// старт
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Mongo connection error:', err);
    process.exit(1);
  });
