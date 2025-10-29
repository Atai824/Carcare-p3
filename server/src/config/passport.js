const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(
// config/passport.js
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password', passReqToCallback: false },
    async (email, password, done) => {
      try {
        const normEmail = String(email).trim().toLowerCase();
        const user = await User.findOne({ email: normEmail });
        if (!user) return done(null, false, { message: 'User not found' });
        const ok = await user.comparePassword(password);
        if (!ok) return done(null, false, { message: 'Invalid credentials' });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }));


// хранение id в сессии
passport.serializeUser((user, done) => done(null, user.id));
// восстановление пользователя из id
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (e) {
    done(e);
  }
});

module.exports = passport;
