const pool = require('../config/db');
class CategoryModel {
  async getAll() {
    const r = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    return r.rows;
  }
  async getById(id) {
    const r = await pool.query('SELECT * FROM categories WHERE id=$1',[id]);
    return r.rows[0];
  }
  async create({name,color,icon}) {
    const r = await pool.query('INSERT INTO categories (name,color,icon) VALUES ($1,$2,$3) RETURNING *',[name,color||'#6366f1',icon||'tag']);
    return r.rows[0];
  }
  async update(id,{name,color,icon}) {
    const r = await pool.query('UPDATE categories SET name=$1,color=$2,icon=$3 WHERE id=$4 RETURNING *',[name,color,icon,id]);
    return r.rows[0];
  }
  async delete(id) {
    const r = await pool.query('DELETE FROM categories WHERE id=$1 RETURNING *',[id]);
    return r.rows[0];
  }
}
module.exports = new CategoryModel();
