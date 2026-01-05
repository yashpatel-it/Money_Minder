# Supabase Setup Guide for Money-Minder

## Step 1: Create a Supabase Account and Project

1. Go to https://supabase.com
2. Click "Start your project" or "Sign in"
3. Sign up with GitHub, Google, or email
4. Click "New Project"
5. Fill in:
   - **Project Name**: Money-Minder (or any name you like)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to you
   - Click "Create new project"

## Step 2: Get Your Database Connection String

1. Wait for your project to finish setting up (takes 1-2 minutes)
2. Go to **Settings** (gear icon in the left sidebar)
3. Click on **Database** in the settings menu
4. Scroll down to **Connection string** section
5. Under **Connection pooling**, select **Session mode**
6. Copy the **URI** connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)

## Step 3: Set Up the Database Schema

Open PowerShell in the project directory and run:

```powershell
# Replace the connection string with your actual Supabase connection string
$env:DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"

# Push the database schema
npm run db:push
```

## Step 4: Run the Development Server

```powershell
# Make sure DATABASE_URL is still set
$env:DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"

# Start the server
npm run dev
```

The server will start on http://localhost:5000

---

## Quick Setup Script

You can also use the simple setup script:

```powershell
.\setup-simple.ps1 -DatabaseUrl "postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
```

Then run:
```powershell
$env:DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
npm run dev
```

---

## Important Notes

- **Replace `[YOUR-PASSWORD]`** with the database password you set when creating the project
- **Replace `xxxxx`** with your actual Supabase project reference
- The connection string format should be: `postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres`
- Keep your password secure and never commit it to version control!

---

## Troubleshooting

- **"Connection refused"**: Check if you copied the connection string correctly
- **"Authentication failed"**: Verify your password is correct (it's the one you set during project creation)
- **"Database does not exist"**: Make sure you're using the correct project reference in the connection string

