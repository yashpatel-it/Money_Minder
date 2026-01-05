# Database Setup Guide

## Quick Setup Steps

### 1. Make sure PostgreSQL is installed and running
- Download from: https://www.postgresql.org/download/windows/
- Or use a cloud service like Supabase, Neon, or Railway

### 2. Set your DATABASE_URL

Open PowerShell in the project directory and run:

```powershell
# For local PostgreSQL (default settings)
$env:DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/moneyminder"

# Replace:
# - YOUR_PASSWORD with your PostgreSQL password
# - localhost with your database host (if different)
# - 5432 with your database port (if different)
# - moneyminder with your database name (if different)
```

### 3. Create the database (if it doesn't exist)

```powershell
# Connect to PostgreSQL and create database
psql -U postgres
CREATE DATABASE moneyminder;
\q
```

### 4. Push the database schema

```powershell
npm run db:push
```

### 5. Run the development server

```powershell
npm run dev
```

The server will start on http://localhost:5000

---

## Example: Using Supabase (Cloud Database)

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string (URI format)
5. Set it as DATABASE_URL:

```powershell
$env:DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"
npm run db:push
npm run dev
```

---

## Troubleshooting

- **"DATABASE_URL must be set"**: Make sure you've set the environment variable
- **"Connection refused"**: Check if PostgreSQL is running
- **"Authentication failed"**: Verify your username and password
- **"Database does not exist"**: Create the database first using `CREATE DATABASE moneyminder;`

