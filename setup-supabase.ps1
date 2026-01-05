# Supabase Setup Script for Money-Minder
# This script helps you set up Supabase database connection

Write-Host "=== Supabase Database Setup for Money-Minder ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "To get your Supabase connection string:" -ForegroundColor Yellow
Write-Host "1. Go to https://supabase.com and create/login to your account" -ForegroundColor White
Write-Host "2. Create a new project (or select existing one)" -ForegroundColor White
Write-Host "3. Go to Settings > Database" -ForegroundColor White
Write-Host "4. Scroll to 'Connection string' section" -ForegroundColor White
Write-Host "5. Select 'Session mode' under Connection pooling" -ForegroundColor White
Write-Host "6. Copy the URI connection string" -ForegroundColor White
Write-Host ""

$connectionString = Read-Host "postgresql://postgres:[Yash@expense06]@db.zkeeqsjjkbbsvkmnloyl.supabase.co:5432/postgres"

if ([string]::IsNullOrWhiteSpace($connectionString)) {
    Write-Host "Connection string is required!" -ForegroundColor Red
    exit 1
}

# Set DATABASE_URL
$env:DATABASE_URL = $connectionString
Write-Host ""
Write-Host "DATABASE_URL has been set for this session" -ForegroundColor Green
Write-Host ""

# Push database schema
Write-Host "Pushing database schema to Supabase..." -ForegroundColor Cyan
npm run db:push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== Database setup complete! ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "To run the project, use:" -ForegroundColor Yellow
    Write-Host '  $env:DATABASE_URL="' + $connectionString + '"' -ForegroundColor White
    Write-Host "  npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "The server will start on http://localhost:5000" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "=== Database setup failed! ===" -ForegroundColor Red
    Write-Host "Please check your connection string and try again." -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "- Make sure you replaced [YOUR-PASSWORD] with your actual password" -ForegroundColor White
    Write-Host "- Verify the connection string is in URI format" -ForegroundColor White
    Write-Host "- Check that your Supabase project is fully set up" -ForegroundColor White
}

