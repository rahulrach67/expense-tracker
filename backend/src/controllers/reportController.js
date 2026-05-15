const pool = require('../config/database');

exports.summary = async (req, res) => {
  const { start_date, end_date } = req.query;
  const start = start_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const end = end_date || new Date().toISOString().split('T')[0];
  try {
    const totals = await pool.query(
      `SELECT type, SUM(amount) as total, COUNT(*) as count
       FROM expenses WHERE user_id=$1 AND date BETWEEN $2 AND $3 GROUP BY type`,
      [req.userId, start, end]
    );
    const byCategory = await pool.query(
      `SELECT c.name, c.icon, c.color, e.type, SUM(e.amount) as total, COUNT(*) as count
       FROM expenses e LEFT JOIN categories c ON e.category_id = c.id
       WHERE e.user_id=$1 AND e.date BETWEEN $2 AND $3
       GROUP BY c.name, c.icon, c.color, e.type ORDER BY total DESC`,
      [req.userId, start, end]
    );
    const byDay = await pool.query(
      `SELECT date, type, SUM(amount) as total
       FROM expenses WHERE user_id=$1 AND date BETWEEN $2 AND $3
       GROUP BY date, type ORDER BY date ASC`,
      [req.userId, start, end]
    );
    const byMonth = await pool.query(
      `SELECT TO_CHAR(date, 'YYYY-MM') as month, type, SUM(amount) as total
       FROM expenses WHERE user_id=$1
       GROUP BY month, type ORDER BY month ASC`,
      [req.userId]
    );

    let totalIncome = 0, totalExpense = 0;
    totals.rows.forEach(r => {
      if (r.type === 'income') totalIncome = parseFloat(r.total);
      else totalExpense = parseFloat(r.total);
    });

    res.json({
      period: { start, end },
      summary: { totalIncome, totalExpense, balance: totalIncome - totalExpense },
      byCategory: byCategory.rows,
      byDay: byDay.rows,
      byMonth: byMonth.rows
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.topExpenses = async (req, res) => {
  const { start_date, end_date, limit = 10 } = req.query;
  const start = start_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const end = end_date || new Date().toISOString().split('T')[0];
  try {
    const result = await pool.query(
      `SELECT e.*, c.name as category_name, c.icon as category_icon, c.color as category_color
       FROM expenses e LEFT JOIN categories c ON e.category_id = c.id
       WHERE e.user_id=$1 AND e.type='expense' AND e.date BETWEEN $2 AND $3
       ORDER BY e.amount DESC LIMIT $4`,
      [req.userId, start, end, limit]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
