# Quick Start Guide - Money-Minder

## ✅ Correct Way to Start (PowerShell)

**Important**: In PowerShell, you must use `.\` before script names!

```powershell
# Method 1: Use the startup script (RECOMMENDED)
.\start.ps1
```

**OR manually:**

```powershell
# Method 2: Manual start
$env:DATABASE_URL="postgresql://postgres:Yash%40expense06@db.zkeeqsjjkbbsvkmnloyl.supabase.co:5432/postgres"
npm run dev
```

## 🌐 Access the App

Once the server starts (takes 10-15 seconds), open in your browser:

```
http://localhost:5000
```

## 📝 Common Commands

```powershell
# Start server
.\start.ps1

# Or manually:
$env:DATABASE_URL="postgresql://postgres:Yash%40expense06@db.zkeeqsjjkbbsvkmnloyl.supabase.co:5432/postgres"
npm run dev

# Push database schema (if needed)
$env:DATABASE_URL="postgresql://postgres:Yash%40expense06@db.zkeeqsjjkbbsvkmnloyl.supabase.co:5432/postgres"
npm run db:push
```

## ⚠️ PowerShell Script Rules

- ✅ Correct: `.\start.ps1`
- ❌ Wrong: `start.ps1`
- ❌ Wrong: `\start.ps1`

The `.\` tells PowerShell to run the script from the current directory.

## 🎯 What You'll See

1. **First Time**: Login/Register page
2. **After Login**: Dashboard with your financial summary
3. **Navigation**: 
   - Dashboard (home)
   - Expenses (add/view expenses)
   - Incomes (add/view incomes)
   - Categories (manage categories)

## 🔧 Troubleshooting

If the server doesn't start:
1. Make sure DATABASE_URL is set
2. Check if port 5000 is available
3. Look for error messages in the terminal
4. Try stopping any existing Node processes and restart

