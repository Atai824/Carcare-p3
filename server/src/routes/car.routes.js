const router = require('express').Router();
const authRequired = require('../middleware/authRequired');
const carCtrl = require('../controllers/car.controller');

router.use(authRequired);

router.post('/', carCtrl.create);
router.get('/', carCtrl.list);
router.get('/:id', carCtrl.getOne);
router.put('/:id', carCtrl.update);
router.delete('/:id', carCtrl.remove);

module.exports = router;
