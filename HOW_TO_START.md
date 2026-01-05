# How to Start Money-Minder Project

## 📍 Where is the HTTP Server Code?

### Backend (HTTP Server):
- **Main Server File**: `server/index.ts` - This is where the Express HTTP server starts
- **API Routes**: `server/routes.ts` - All API endpoints (login, expenses, incomes, etc.)
- **Database**: `server/storage.ts` - Database operations
- **Database Connection**: `server/db.ts` - PostgreSQL connection

### Frontend (React App):
- **Entry Point**: `client/src/main.tsx` - React app starts here
- **Main App**: `client/src/App.tsx` - Main React component
- **Pages**: `client/src/pages/` - All page components
  - `Dashboard.tsx` - Main dashboard
  - `ExpensesPage.tsx` - Expenses management
  - `IncomesPage.tsx` - Income management
  - `AuthPage.tsx` - Login/Register

## 🚀 How to Start the Project

### Step 1: Set Database URL
```powershell
$env:DATABASE_URL="postgresql://postgres:Yash%40expense06@db.zkeeqsjjkbbsvkmnloyl.supabase.co:5432/postgres"
```

### Step 2: Start the Server
```powershell
npm run dev
```

**OR use the startup script:**
```powershell
.\start.ps1
```

### Step 3: Open in Browser
Once the server starts, open:
```
http://localhost:5000
```

## 📂 Project Structure

```
Money-Minder/
├── server/              # Backend HTTP Server
│   ├── index.ts        # ⭐ HTTP Server Entry Point (Line 87-97 starts server on port 5000)
│   ├── routes.ts       # ⭐ API Routes (All HTTP endpoints)
│   ├── storage.ts      # Database operations
│   └── db.ts          # Database connection
│
├── client/             # Frontend React App
│   ├── index.html     # HTML entry point
│   └── src/
│       ├── main.tsx    # ⭐ React Entry Point
│       ├── App.tsx     # Main React component
│       └── pages/      # All page components
│
└── shared/            # Shared code between frontend/backend
    ├── schema.ts      # Database schema
    └── routes.ts      # API route definitions
```

## 🔍 Key Code Locations

### HTTP Server Starts Here:
**File**: `server/index.ts`
- **Line 6-7**: Creates Express app and HTTP server
- **Line 63**: Registers all API routes
- **Line 87-97**: Starts listening on port 5000

### API Endpoints Defined Here:
**File**: `server/routes.ts`
- **Line 72-94**: Auth routes (register, login, logout)
- **Line 117-138**: Expense routes
- **Line 141-162**: Income routes
- **Line 184-207**: Stats/summary route (calculates totals)

### Frontend Starts Here:
**File**: `client/src/main.tsx`
- Renders the React app
- Loads `App.tsx` component

## 🎯 Quick Start Commands

```powershell
# 1. Set database connection
$env:DATABASE_URL="postgresql://postgres:Yash%40expense06@db.zkeeqsjjkbbsvkmnloyl.supabase.co:5432/postgres"

# 2. Start server (runs both backend and frontend)
npm run dev

# 3. Open browser
# Go to: http://localhost:5000
```

## 📝 What Happens When You Run `npm run dev`?

1. **Starts Express Server** (`server/index.ts`)
2. **Connects to Supabase Database** (`server/db.ts`)
3. **Registers API Routes** (`server/routes.ts`)
4. **Starts Vite Dev Server** (for React frontend)
5. **Serves on Port 5000** - Both API and frontend on same port

## 🌐 Access Points

- **Frontend**: http://localhost:5000
- **API Endpoints**: http://localhost:5000/api/*
  - `/api/auth/register` - Register user
  - `/api/auth/login` - Login
  - `/api/expenses` - Get/Create expenses
  - `/api/incomes` - Get/Create incomes
  - `/api/stats/summary` - Get financial summary

