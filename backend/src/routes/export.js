const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/exportController');
const auth = require('../middleware/auth');
router.use(auth);
router.get('/csv', ctrl.exportCSV);
router.get('/json', ctrl.exportJSON);
module.exports = router;
