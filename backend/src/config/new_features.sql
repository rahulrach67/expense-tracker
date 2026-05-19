-- NEW FEATURES SQL - Run in Supabase SQL Editor

-- 1. BUDGET MANAGEMENT
CREATE TABLE IF NOT EXISTS budgets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  month VARCHAR(7) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, category_id, month)
);

-- 2. RECURRING TRANSACTIONS
CREATE TABLE IF NOT EXISTS recurring_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  type VARCHAR(10) DEFAULT 'expense' CHECK (type IN ('expense', 'income')),
  frequency VARCHAR(20) DEFAULT 'monthly' CHECK (frequency IN ('daily','weekly','monthly','yearly')),
  next_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CURRENCY PREFERENCE
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_currency VARCHAR(10) DEFAULT 'INR';
