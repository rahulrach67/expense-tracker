const pool = require('../config/db');

class ExpenseModel {
  async getAll({ page = 1, limit = 10, category_id, start_date, end_date, search } = {}) {
    const offset = (page - 1) * limit;
    let conditions = [];
    let params = [];
    let idx = 1;
    if (category_id) { conditions.push(`e.category_id = $${idx++}`); params.push(category_id); }
    if (start_date)  { conditions.push(`e.date >= $${idx++}`); params.push(start_date); }
    if (end_date)    { conditions.push(`e.date <= $${idx++}`); params.push(end_date); }
    if (search)      { conditions.push(`(e.title ILIKE $${idx} OR e.description ILIKE $${idx++})`); params.push(`%${search}%`); }
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const countResult = await pool.query(`SELECT COUNT(*) FROM expenses e ${where}`, params);
    const total = parseInt(countResult.rows[0].count);
    params.push(limit, offset);
    const result = await pool.query(`
      SELECT e.*, c.name AS category_name, c.color AS category_color, c.icon AS category_icon
      FROM expenses e LEFT JOIN categories c ON e.category_id = c.id
      ${where} ORDER BY e.date DESC, e.created_at DESC
      LIMIT $${idx} OFFSET $${idx + 1}`, params);
    return { data: result.rows, total, page: +page, limit: +limit, pages: Math.ceil(total / limit) };
  }

  async getById(id) {
    const r = await pool.query(
      `SELECT e.*, c.name AS category_name, c.color AS category_color, c.icon AS category_icon
       FROM expenses e LEFT JOIN categories c ON e.category_id = c.id WHERE e.id = $1`, [id]);
    return r.rows[0];
  }

  async create({ title, amount, category_id, date, description, payment_method }) {
    const r = await pool.query(
      `INSERT INTO expenses (title, amount, category_id, date, description, payment_method)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [title, amount, category_id || null, date || new Date(), description || null, payment_method || 'cash']);
    return r.rows[0];
  }

  async update(id, { title, amount, category_id, date, description, payment_method }) {
    const r = await pool.query(
      `UPDATE expenses SET title=$1,amount=$2,category_id=$3,date=$4,description=$5,payment_method=$6,updated_at=NOW()
       WHERE id=$7 RETURNING *`,
      [title, amount, category_id || null, date, description || null, payment_method || 'cash', id]);
    return r.rows[0];
  }

  async delete(id) {
    const r = await pool.query('DELETE FROM expenses WHERE id=$1 RETURNING *', [id]);
    return r.rows[0];
  }

  async getSummary({ start_date, end_date } = {}) {
    const params = []; let where = '';
    if (start_date && end_date) { where = 'WHERE date >= $1 AND date <= $2'; params.push(start_date, end_date); }
    const r = await pool.query(
      `SELECT COUNT(*) AS total_count, COALESCE(SUM(amount),0) AS total_amount,
              COALESCE(AVG(amount),0) AS avg_amount, COALESCE(MAX(amount),0) AS max_amount,
              COALESCE(MIN(amount),0) AS min_amount FROM expenses ${where}`, params);
    return r.rows[0];
  }

  async getByCategory({ start_date, end_date } = {}) {
    const params = []; let cond = '';
    if (start_date && end_date) { cond = 'AND e.date >= $1 AND e.date <= $2'; params.push(start_date, end_date); }
    const r = await pool.query(
      `SELECT c.id,c.name,c.color,c.icon,COUNT(e.id) AS count,COALESCE(SUM(e.amount),0) AS total
       FROM categories c LEFT JOIN expenses e ON e.category_id = c.id ${cond}
       GROUP BY c.id,c.name,c.color,c.icon ORDER BY total DESC`, params);
    return r.rows;
  }

  async getMonthlyTrend({ year } = {}) {
    const r = await pool.query(
      `SELECT TO_CHAR(date,'YYYY-MM') AS month, TO_CHAR(date,'Mon YYYY') AS month_label,
              COALESCE(SUM(amount),0) AS total, COUNT(*) AS count
       FROM expenses WHERE EXTRACT(YEAR FROM date)=$1
       GROUP BY TO_CHAR(date,'YYYY-MM'),TO_CHAR(date,'Mon YYYY') ORDER BY month ASC`,
      [year || new Date().getFullYear()]);
    return r.rows;
  }

  async getDailyTrend({ start_date, end_date }) {
    const r = await pool.query(
      `SELECT date::TEXT, COALESCE(SUM(amount),0) AS total, COUNT(*) AS count
       FROM expenses WHERE date >= $1 AND date <= $2 GROUP BY date ORDER BY date ASC`,
      [start_date, end_date]);
    return r.rows;
  }

  async getTopExpenses({ limit = 5, start_date, end_date } = {}) {
    const params = [limit]; let where = '';
    if (start_date && end_date) { where = 'WHERE e.date >= $2 AND e.date <= $3'; params.push(start_date, end_date); }
    const r = await pool.query(
      `SELECT e.*,c.name AS category_name,c.color AS category_color FROM expenses e
       LEFT JOIN categories c ON e.category_id=c.id ${where} ORDER BY e.amount DESC LIMIT $1`, params);
    return r.rows;
  }
}

module.exports = new ExpenseModel();
