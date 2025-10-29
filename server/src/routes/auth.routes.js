// routes/auth.routes.js
const router = require('express').Router();
const passport = require('passport');
const { register, me, logout } = require('../controllers/auth.controller');
const authRequired = require('../middleware/authRequired');

router.post('/register', register);

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message || 'Invalid credentials' });
    req.logIn(user, (err2) => {
      if (err2) return next(err2);
      return res.json({ ok: true, user: { _id: user._id, name: user.name, email: user.email } });
    });
  })(req, res, next);
});

router.get('/me', authRequired, me);
router.post('/logout', authRequired, logout);

module.exports = router;
