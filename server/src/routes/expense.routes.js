const router = require('express').Router();
const authRequired = require('../middleware/authRequired');
const expenseCtrl = require('../controllers/expense.controller');

router.use(authRequired);

router.post('/', expenseCtrl.create);
router.get('/', expenseCtrl.list);
router.get('/summary/:carId', expenseCtrl.summary);
router.delete('/:id', expenseCtrl.remove);

module.exports = router;
