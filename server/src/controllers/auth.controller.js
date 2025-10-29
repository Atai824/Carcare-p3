const bcrypt = require('bcryptjs');
const User = require('../models/User'); // проверь путь к модели

const publicUser = (u) => ({ _id: u._id, name: u.name, email: u.email });

// controllers/auth.controller.js (register)
exports.register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    email = String(email).trim().toLowerCase();
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    // ВАЖНО: НЕ хешируем здесь — доверяем pre('save') из модели
    const user = await User.create({ name: name.trim(), email, password });

    req.login(user, (err) => {
      if (err) {
        console.error('req.login error:', err);
        return res.status(500).json({ message: 'Could not create session' });
      }
      return res.json({ ok: true, user: publicUser(user) });
    });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ message: 'Email is already registered' });
    }
    console.error('REGISTER ERROR:', e);
    return res.status(500).json({ message: 'Registration failed' });
  }
};


exports.login = async (req, res, next) => {
  // твой текущий login через passport-local — оставь как есть
  next();
};

exports.me = (req, res) => {
  if (!req.user) return res.json({ user: null });
  res.json({ user: { _id: req.user._id, name: req.user.name, email: req.user.email } });
};

// controllers/auth.controller.js (logout)
exports.logout = (req, res) => {
  req.logout(() => {
    const sid = req.sessionID; // можно не использовать
    req.session.destroy(() => {
      res.clearCookie('cc.sid');
      res.json({ ok: true });
    });
  });
};

