-- Create database (run manually if needed)
-- CREATE DATABASE expense_tracker;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(20),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  date DATE NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  notes TEXT,
  type VARCHAR(10) DEFAULT 'expense' CHECK (type IN ('expense', 'income')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default categories seed
INSERT INTO categories (name, icon, color, is_default) VALUES
  ('Food & Dining', 'restaurant', '#FF6B6B', TRUE),
  ('Transportation', 'directions_car', '#4ECDC4', TRUE),
  ('Shopping', 'shopping_bag', '#45B7D1', TRUE),
  ('Entertainment', 'movie', '#FFA07A', TRUE),
  ('Health', 'local_hospital', '#98D8C8', TRUE),
  ('Utilities', 'bolt', '#F7DC6F', TRUE),
  ('Rent/Housing', 'home', '#BB8FCE', TRUE),
  ('Salary', 'work', '#52BE80', TRUE),
  ('Freelance', 'laptop', '#5DADE2', TRUE),
  ('Others', 'more_horiz', '#AAB7B8', TRUE)
ON CONFLICT DO NOTHING;
