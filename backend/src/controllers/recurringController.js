const pool = require('../config/database');

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, c.name as category_name, c.icon as category_icon, c.color as category_color
       FROM recurring_transactions r
       LEFT JOIN categories c ON r.category_id = c.id
       WHERE r.user_id = $1 ORDER BY r.next_date ASC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  const { title, amount, category_id, type, frequency, next_date, notes } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO recurring_transactions (user_id, title, amount, category_id, type, frequency, next_date, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [req.userId, title, amount, category_id || null, type || 'expense', frequency || 'monthly', next_date, notes || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.update = async (req, res) => {
  const { title, amount, category_id, type, frequency, next_date, notes, is_active } = req.body;
  try {
    const result = await pool.query(
      `UPDATE recurring_transactions SET title=$1, amount=$2, category_id=$3, type=$4,
       frequency=$5, next_date=$6, notes=$7, is_active=$8
       WHERE id=$9 AND user_id=$10 RETURNING *`,
      [title, amount, category_id || null, type, frequency, next_date, notes || null, is_active, req.params.id, req.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await pool.query('DELETE FROM recurring_transactions WHERE id=$1 AND user_id=$2', [req.params.id, req.userId]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.processRecurring = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const due = await pool.query(
      `SELECT * FROM recurring_transactions WHERE user_id=$1 AND is_active=TRUE AND next_date <= $2`,
      [req.userId, today]
    );
    const processed = [];
    for (const r of due.rows) {
      await pool.query(
        `INSERT INTO expenses (user_id, title, amount, date, category_id, type, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [r.user_id, r.title, r.amount, r.next_date, r.category_id, r.type, `Auto: ${r.notes || r.title}`]
      );
      let nextDate = new Date(r.next_date);
      if (r.frequency === 'daily') nextDate.setDate(nextDate.getDate() + 1);
      else if (r.frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
      else if (r.frequency === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
      else if (r.frequency === 'yearly') nextDate.setFullYear(nextDate.getFullYear() + 1);
      await pool.query('UPDATE recurring_transactions SET next_date=$1 WHERE id=$2', [nextDate.toISOString().split('T')[0], r.id]);
      processed.push(r.title);
    }
    res.json({ processed, count: processed.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
