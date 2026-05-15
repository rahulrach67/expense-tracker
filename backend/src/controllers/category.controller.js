const CategoryModel = require('../models/category.model');
exports.getAll = async (req, res) => {
  try { res.json({ success: true, data: await CategoryModel.getAll() }); }
  catch (err) { res.status(500).json({ success: false, error: err.message }); }
};
exports.create = async (req, res) => {
  try {
    const { name, color, icon } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'name required' });
    const item = await CategoryModel.create({ name, color, icon });
    res.status(201).json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};
exports.update = async (req, res) => {
  try {
    const item = await CategoryModel.update(req.params.id, req.body);
    if (!item) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};
exports.delete = async (req, res) => {
  try {
    const item = await CategoryModel.delete(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
};
