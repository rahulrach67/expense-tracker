const pool = require('../config/database');

exports.getBudgets = async (req, res) => {
  const { month } = req.query;
  const currentMonth = month || new Date().toISOString().slice(0, 7);
  try {
    const result = await pool.query(
      `SELECT b.*, c.name as category_name, c.icon as category_icon, c.color as category_color,
        COALESCE(
          (SELECT SUM(e.amount) FROM expenses e
           WHERE e.category_id = b.category_id AND e.user_id = b.user_id
           AND TO_CHAR(e.date, 'YYYY-MM') = b.month AND e.type = 'expense'), 0
        ) as spent
       FROM budgets b
       LEFT JOIN categories c ON b.category_id = c.id
       WHERE b.user_id = $1 AND b.month = $2
       ORDER BY c.name`,
      [req.userId, currentMonth]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.setBudget = async (req, res) => {
  const { category_id, amount, month } = req.body;
  const targetMonth = month || new Date().toISOString().slice(0, 7);
  try {
    const result = await pool.query(
      `INSERT INTO budgets (user_id, category_id, amount, month)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, category_id, month)
       DO UPDATE SET amount = EXCLUDED.amount
       RETURNING *`,
      [req.userId, category_id, amount, targetMonth]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    await pool.query('DELETE FROM budgets WHERE id=$1 AND user_id=$2', [req.params.id, req.userId]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getBudgetSummary = async (req, res) => {
  const currentMonth = new Date().toISOString().slice(0, 7);
  try {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_budgets,
        SUM(b.amount) as total_budget_amount,
        SUM(COALESCE(
          (SELECT SUM(e.amount) FROM expenses e
           WHERE e.category_id = b.category_id AND e.user_id = b.user_id
           AND TO_CHAR(e.date, 'YYYY-MM') = b.month AND e.type = 'expense'), 0
        )) as total_spent,
        COUNT(CASE WHEN COALESCE(
          (SELECT SUM(e.amount) FROM expenses e
           WHERE e.category_id = b.category_id AND e.user_id = b.user_id
           AND TO_CHAR(e.date, 'YYYY-MM') = b.month AND e.type = 'expense'), 0
        ) > b.amount THEN 1 END) as over_budget_count
       FROM budgets b WHERE b.user_id=$1 AND b.month=$2`,
      [req.userId, currentMonth]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
