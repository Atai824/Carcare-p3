const router = require('express').Router();
const authRequired = require('../middleware/authRequired');
const ctrl = require('../controllers/upload.controller');

router.use(authRequired);

// чек к расходу
router.post('/receipt/:expenseId', ctrl.attachReceipt);

// фото в галерею авто
router.post('/car-photo/:carId', ctrl.addCarPhoto);

// (опц.) удалить фото по имени
router.delete('/car-photo/:carId/:filename', ctrl.removeCarPhoto);

module.exports = router;
