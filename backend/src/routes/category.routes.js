const router = require('express').Router();
const ctrl = require('../controllers/category.controller');
router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);
module.exports = router;
