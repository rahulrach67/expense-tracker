const pool = require('../config/database');

exports.getAll = async (req, res) => {
  const { page = 1, limit = 20, type, category_id, start_date, end_date, search } = req.query;
  const offset = (page - 1) * limit;
  let conditions = ['e.user_id = $1'];
  let params = [req.userId];
  let idx = 2;

  if (type) { conditions.push(`e.type = $${idx++}`); params.push(type); }
  if (category_id) { conditions.push(`e.category_id = $${idx++}`); params.push(category_id); }
  if (start_date) { conditions.push(`e.date >= $${idx++}`); params.push(start_date); }
  if (end_date) { conditions.push(`e.date <= $${idx++}`); params.push(end_date); }
  if (search) { conditions.push(`(e.title ILIKE $${idx} OR e.notes ILIKE $${idx})`); params.push(`%${search}%`); idx++; }

  const where = conditions.join(' AND ');
  console.log(idx,"the where becomeeeeeeeeee================================",where);
  
  try {
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM expenses e WHERE ${where}`, params
    );
    const total = parseInt(countResult.rows[0].count);

    params.push(limit, offset);
    const result = await pool.query(
      `SELECT e.*, c.name as category_name, c.icon as category_icon, c.color as category_color
       FROM expenses e
       LEFT JOIN categories c ON e.category_id = c.id
  `

    );
    console.log(params,"the datata becomeeeeeeeeeeeeeeeeeeeeeeeeeeeee======================",result.rows);
    
    res.json({ data: result.rows, total, page: +page, limit: +limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.log("the eroor becomee=============================",err);
    
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, c.name as category_name, c.icon as category_icon, c.color as category_color
       FROM expenses e LEFT JOIN categories c ON e.category_id = c.id
       WHERE e.id = $1 AND e.user_id = $2`,
      [req.params.id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.create = async (req, res) => {
  const { title, amount, date, category_id, notes, type } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO expenses (title, amount, date, category_id, user_id, notes, type)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, amount, date, category_id || null, req.userId, notes || null, type || 'expense']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.update = async (req, res) => {
  const { title, amount, date, category_id, notes, type } = req.body;
  try {
    const result = await pool.query(
      `UPDATE expenses SET title=$1, amount=$2, date=$3, category_id=$4, notes=$5, type=$6, updated_at=NOW()
       WHERE id=$7 AND user_id=$8 RETURNING *`,
      [title, amount, date, category_id || null, notes || null, type || 'expense', req.params.id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM expenses WHERE id=$1 AND user_id=$2 RETURNING id', [req.params.id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
