const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/summary', reportController.summary);
router.get('/top-expenses', reportController.topExpenses);

module.exports = router;
