const pool = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM categories WHERE user_id = $1 OR is_default = TRUE ORDER BY is_default DESC, name ASC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  const { name, icon, color } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO categories (name, icon, color, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, icon || 'category', color || '#607D8B', req.userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM categories WHERE id=$1 AND user_id=$2 RETURNING id', [req.params.id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found or default category' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
