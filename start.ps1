# Start Money-Minder Development Server
# This script sets up the environment and starts the server

Write-Host "=== Starting Money-Minder ===" -ForegroundColor Cyan
Write-Host ""

# Set DATABASE_URL (URL-encoded password: @ becomes %40)
$env:DATABASE_URL = "postgresql://postgres:Yash%40expense06@db.zkeeqsjjkbbsvkmnloyl.supabase.co:5432/postgres"
$env:NODE_ENV = "development"

Write-Host "Environment variables set:" -ForegroundColor Green
Write-Host "  DATABASE_URL: Configured" -ForegroundColor White
Write-Host "  NODE_ENV: development" -ForegroundColor White
Write-Host ""

Write-Host "Starting development server..." -ForegroundColor Cyan
Write-Host "Server will be available at: http://localhost:5000" -ForegroundColor Yellow
Write-Host ""

# Start the server
npm run dev

