-- Create database (run this separately if needed)
-- CREATE DATABASE expense_tracker;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(7) DEFAULT '#6366f1',
  icon VARCHAR(50) DEFAULT 'tag',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  payment_method VARCHAR(50) DEFAULT 'cash',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed default categories
INSERT INTO categories (name, color, icon) VALUES
  ('Food & Dining', '#f59e0b', 'restaurant'),
  ('Transportation', '#3b82f6', 'directions_car'),
  ('Shopping', '#ec4899', 'shopping_bag'),
  ('Entertainment', '#8b5cf6', 'movie'),
  ('Health & Medical', '#10b981', 'local_hospital'),
  ('Utilities', '#6366f1', 'bolt'),
  ('Education', '#14b8a6', 'school'),
  ('Travel', '#f97316', 'flight'),
  ('Housing', '#64748b', 'home'),
  ('Other', '#94a3b8', 'more_horiz')
ON CONFLICT (name) DO NOTHING;
