const router = require('express').Router();
const { register, login, me, logout } = require('../controllers/auth.controller');
const authRequired = require('../middleware/authRequired');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authRequired, me);
router.post('/logout', authRequired, logout);

module.exports = router;
