# Expense Tracker Application

A full-stack expense tracking web application built with **Angular 9**, **Node.js 12**, **Express.js**, and **PostgreSQL**.

## Features
- User authentication (register/login with JWT)
- Add/edit/delete income and expense transactions
- Category management (default + custom categories)
- Advanced filtering (by type, category, date range, search)
- Dashboard with summary cards and charts
- Reports with daily trend, category breakdown, top expenses
- Pagination and responsive design

## Tech Stack
| Layer      | Technology         |
|------------|--------------------|
| Frontend   | Angular 9, Angular Material, Chart.js / ng2-charts |
| Backend    | Node.js 12, Express.js |
| Database   | PostgreSQL          |
| Auth       | JWT (jsonwebtoken) + bcryptjs |

---

## Prerequisites
- Node.js 12.22.10
- npm 6.x
- PostgreSQL 12+
- Angular CLI 9: `npm install -g @angular/cli@9`

---

## Setup Instructions

### 1. PostgreSQL — Create Database & Tables

```bash
psql -U postgres
CREATE DATABASE expense_tracker;
\c expense_tracker
\i backend/src/config/init.sql
\q
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials and JWT secret
npm install
npm start         # or: npm run dev (uses nodemon)
```

Backend runs on: `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend
npm install
ng serve
```

Frontend runs on: `http://localhost:4200`

---

## API Endpoints

### Auth
| Method | Endpoint             | Description       |
|--------|----------------------|-------------------|
| POST   | /api/auth/register   | Register user     |
| POST   | /api/auth/login      | Login user        |
| GET    | /api/auth/me         | Get current user  |

### Expenses
| Method | Endpoint             | Description                    |
|--------|----------------------|--------------------------------|
| GET    | /api/expenses        | List (filter by type/date/cat) |
| POST   | /api/expenses        | Create expense/income          |
| PUT    | /api/expenses/:id    | Update                         |
| DELETE | /api/expenses/:id    | Delete                         |

### Categories
| Method | Endpoint             | Description         |
|--------|----------------------|---------------------|
| GET    | /api/categories      | List all categories |
| POST   | /api/categories      | Create custom       |
| DELETE | /api/categories/:id  | Delete custom       |

### Reports
| Method | Endpoint                   | Description              |
|--------|----------------------------|--------------------------|
| GET    | /api/reports/summary       | Summary + charts data    |
| GET    | /api/reports/top-expenses  | Top 10 expenses          |

---

## Environment Variables (backend/.env)

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expinit
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your_secure_secret_key
JWT_EXPIRES_IN=7d
```

---

## Project Structure

```
expense-tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js       # PostgreSQL connection pool
│   │   │   └── init.sql          # DB schema + seed data
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── expenseController.js
│   │   │   ├── categoryController.js
│   │   │   └── reportController.js
│   │   ├── middleware/
│   │   │   └── auth.js           # JWT middleware
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── expenses.js
│   │   │   ├── categories.js
│   │   │   └── reports.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   │   ├── auth/          # Login, Register
    │   │   │   ├── layout/        # Sidenav layout
    │   │   │   ├── dashboard/     # Dashboard with charts
    │   │   │   ├── expenses/      # List + Form dialog
    │   │   │   ├── reports/       # Analytics & charts
    │   │   │   └── categories/    # Category management
    │   │   ├── guards/            # AuthGuard
    │   │   ├── models/            # TypeScript interfaces
    │   │   ├── services/          # Auth, Expense services + interceptor
    │   │   ├── app.module.ts
    │   │   └── app-routing.module.ts
    │   ├── environments/
    │   ├── styles.scss
    │   └── index.html
    ├── angular.json
    └── package.json
```
