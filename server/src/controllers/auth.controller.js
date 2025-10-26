const passport = require('passport');
const User = require('../models/User');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already in use' });

    const user = await User.create({ name, email, password });

    // автологин после регистрации
    req.login(user, (err) => {
      if (err) return next(err);
      const safe = { id: user.id, name: user.name, email: user.email };
      return res.status(201).json({ user: safe });
    });
  } catch (e) {
    next(e);
  }
};

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info?.message || 'Invalid credentials' });
    req.login(user, (err2) => {
      if (err2) return next(err2);
      const safe = { id: user.id, name: user.name, email: user.email };
      return res.json({ user: safe });
    });
  })(req, res, next);
};

exports.me = (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  return res.json({ user: req.user }); // пароль уже снят в deserialize
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('cc.sid');
      return res.json({ ok: true });
    });
  });
};
