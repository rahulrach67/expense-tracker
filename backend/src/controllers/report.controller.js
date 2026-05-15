const ExpenseModel = require('../models/expense.model');
exports.getSummary = async (req, res) => {
  try { res.json({ success: true, data: await ExpenseModel.getSummary(req.query) }); }
  catch (err) { res.status(500).json({ success: false, error: err.message }); }
};
exports.getByCategory = async (req, res) => {
  try { res.json({ success: true, data: await ExpenseModel.getByCategory(req.query) }); }
  catch (err) { res.status(500).json({ success: false, error: err.message }); }
};
exports.getMonthlyTrend = async (req, res) => {
  try { res.json({ success: true, data: await ExpenseModel.getMonthlyTrend(req.query) }); }
  catch (err) { res.status(500).json({ success: false, error: err.message }); }
};
exports.getDailyTrend = async (req, res) => {
  try { res.json({ success: true, data: await ExpenseModel.getDailyTrend(req.query) }); }
  catch (err) { res.status(500).json({ success: false, error: err.message }); }
};
exports.getTopExpenses = async (req, res) => {
  try { res.json({ success: true, data: await ExpenseModel.getTopExpenses(req.query) }); }
  catch (err) { res.status(500).json({ success: false, error: err.message }); }
};
