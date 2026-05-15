const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', expenseController.getAll);
router.get('/:id', expenseController.getById);
router.post('/', expenseController.create);
router.put('/:id', expenseController.update);
router.delete('/:id', expenseController.remove);

module.exports = router;
