const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/currencyController');
const auth = require('../middleware/auth');
router.get('/supported', ctrl.getSupportedCurrencies);
router.get('/rates', auth, ctrl.getExchangeRates);
router.put('/preference', auth, ctrl.updatePreferredCurrency);
module.exports = router;
