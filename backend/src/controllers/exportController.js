const pool = require('../config/database');

exports.exportCSV = async (req, res) => {
  const { start_date, end_date, type } = req.query;
  const start = start_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const end = end_date || new Date().toISOString().split('T')[0];
  let conditions = ['e.user_id = $1', 'e.date BETWEEN $2 AND $3'];
  let params = [req.userId, start, end];
  if (type) { conditions.push(`e.type = $4`); params.push(type); }
  try {
    const result = await pool.query(
      `SELECT e.date, e.title, e.type, e.amount, c.name as category, e.notes
       FROM expenses e LEFT JOIN categories c ON e.category_id = c.id
       WHERE ${conditions.join(' AND ')} ORDER BY e.date DESC`,
      params
    );
    const header = 'Date,Title,Type,Amount,Category,Notes\n';
    const rows = result.rows.map(r =>
      `${r.date},"${r.title}",${r.type},${r.amount},"${r.category || ''}","${r.notes || ''}"`
    ).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=expenses_${start}_${end}.csv`);
    res.send(header + rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.exportJSON = async (req, res) => {
  const { start_date, end_date } = req.query;
  const start = start_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const end = end_date || new Date().toISOString().split('T')[0];
  try {
    const expenses = await pool.query(
      `SELECT e.*, c.name as category_name FROM expenses e
       LEFT JOIN categories c ON e.category_id = c.id
       WHERE e.user_id=$1 AND e.date BETWEEN $2 AND $3 ORDER BY e.date DESC`,
      [req.userId, start, end]
    );
    const summary = await pool.query(
      `SELECT type, SUM(amount) as total, COUNT(*) as count
       FROM expenses WHERE user_id=$1 AND date BETWEEN $2 AND $3 GROUP BY type`,
      [req.userId, start, end]
    );
    res.setHeader('Content-Disposition', `attachment; filename=expenses_${start}_${end}.json`);
    res.json({ period: { start, end }, summary: summary.rows, transactions: expenses.rows });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
