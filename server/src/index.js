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

// базовые миддлвары
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.set('trust proxy', 1);

// сессии в Mongo
app.use(session({
  name: 'cc.sid',
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: IN_PROD ? 'none' : 'lax',
    secure: IN_PROD,                     // в проде под HTTPS станет true
    maxAge: 1000 * 60 * 60 * 24 * 7,     // 7 дней
  },
  store: MongoStore.create({ mongoUrl: MONGO_URI, collectionName: 'sessions' }),
}));

app.use(passport.initialize());
app.use(passport.session());

// маршруты
app.use('/health', require('./routes/health.routes'));
app.get('/', (_req, res) => res.send('CarCare API'));
app.use('/auth', require('./routes/auth.routes'));
app.use('/cars', require('./routes/car.routes'));
app.use('/expenses', require('./routes/expense.routes'));
app.use('/uploads', express.static(require('path').join(__dirname, '..', 'uploads')));
app.use('/upload', require('./routes/upload.routes'));



// старт
connectDB()
  .then(() => app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('Mongo connection error:', err);
    process.exit(1);
  });
