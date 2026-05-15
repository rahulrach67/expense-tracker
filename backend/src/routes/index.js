const express = require('express');
const router = express.Router();
const expenseCtrl  = require('../controllers/expenseController');
const categoryCtrl = require('../controllers/categoryController');
const reportCtrl   = require('../controllers/reportController');

// Expense routes
router.get('/expenses',         expenseCtrl.getExpenses);
router.get('/expenses/:id',     expenseCtrl.getExpenseById);
router.post('/expenses',        expenseCtrl.createExpense);
router.put('/expenses/:id',     expenseCtrl.updateExpense);
router.delete('/expenses/:id',  expenseCtrl.deleteExpense);

// Category routes
router.get('/categories',       categoryCtrl.getCategories);
router.post('/categories',      categoryCtrl.createCategory);
router.delete('/categories/:id',categoryCtrl.deleteCategory);

// Report routes
router.get('/reports/dashboard',          reportCtrl.getDashboardStats);
router.get('/reports/monthly',            reportCtrl.getMonthlySummary);
router.get('/reports/category-breakdown', reportCtrl.getCategoryBreakdown);
router.get('/reports/daily',              reportCtrl.getDailySummary);
router.get('/reports/top-expenses',       reportCtrl.getTopExpenses);

module.exports = router;
