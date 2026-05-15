const fs = require('fs');
const path = require('path');
const pool = require('./database');

const initializeDatabase = async () => {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await pool.query(sql);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err.message);
  }
};

module.exports = initializeDatabase;
