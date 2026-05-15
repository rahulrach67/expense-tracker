const router = require('express').Router();
const ctrl = require('../controllers/report.controller');
router.get('/summary', ctrl.getSummary);
router.get('/by-category', ctrl.getByCategory);
router.get('/monthly-trend', ctrl.getMonthlyTrend);
router.get('/daily-trend', ctrl.getDailyTrend);
router.get('/top-expenses', ctrl.getTopExpenses);
module.exports = router;
