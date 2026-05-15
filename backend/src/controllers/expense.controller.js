const ExpenseModel = require('../models/expense.model');

exports.getAll = async (req, res) => {
  try {
    const result = await ExpenseModel.getAll(req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
exports.getById = async (req, res) => {
  try {
    const item = await ExpenseModel.getById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
exports.create = async (req, res) => {
  try {
    const { title, amount, category_id, date, description, payment_method } = req.body;
    if (!title || !amount) return res.status(400).json({ success: false, error: 'title and amount required' });
    const item = await ExpenseModel.create({ title, amount, category_id, date, description, payment_method });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
exports.update = async (req, res) => {
  try {
    const item = await ExpenseModel.update(req.params.id, req.body);
    if (!item) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
exports.delete = async (req, res) => {
  try {
    const item = await ExpenseModel.delete(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
