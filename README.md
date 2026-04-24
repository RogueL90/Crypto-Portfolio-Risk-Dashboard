# Crypto Portfolio Risk Dashboard

A local tool for running quick crypto portfolio risk checks.

Enter coin IDs + amounts, pick an analysis window, and get per-coin stats like volatility, trend, and estimated profit/loss. Previous queries are saved and can be reopened from history.

## What This Tool Uses

- Frontend: `React`, `Vite`, `Axios`, custom CSS
- Backend: `FastAPI`, `Pydantic`, `NumPy`, `httpx`, `PyMySQL`, `python-dotenv`
- Data: MySQL + CoinGecko API

## Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL 8+

### 1) Clone Repo

```bash
git clone <your-repo-url>
cd "Crypto Portfolio Risk Dashboard"
```

### 2) Set Up Database

Run the schema file in MySQL:

```sql
source backend/schema.sql;
```

This creates the `coinapp` database and required tables.

### 3) Start Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install fastapi "uvicorn[standard]" numpy httpx pymysql python-dotenv
```

Create `backend/.env`:

```env
MYSQL_HOST=localhost
MYSQL_USER=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=coinapp
```

Run the API server:

```bash
uvicorn main:app --reload --port 8000
```

### 4) Start Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## How To Use

1. Add one or more rows of coin symbol + amount held.
2. Enter number of days to analyze.
3. Click **Analyze**.
4. Review stats for each coin.
5. Use **History** to reopen previous requests.

## What The Analysis Calculates

For each coin, the backend computes:

- Current, min, max, and average price
- Volatility (standard deviation via `NumPy`)
- Trend slope (`np.polyfit`)
- Percent change over selected period
- Estimated profit based on amount held

## API Routes

- `POST /addrequest` - save request
- `GET /requests` - list request history
- `GET /analyze/{requestId}` - run/fetch analysis for a saved request

## Notes

- Coin IDs should match CoinGecko IDs (example: `bitcoin`, `ethereum`).
- Backend CORS is configured for frontend at `http://localhost:5173`.
