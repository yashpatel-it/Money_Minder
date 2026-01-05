# Simple Database Setup Script
# Usage: .\setup-simple.ps1 -DatabaseUrl "postgresql://user:pass@host:port/dbname"

param(
    [Parameter(Mandatory=$true)]
    [string]$DatabaseUrl
)

Write-Host "=== Money-Minder Database Setup ===" -ForegroundColor Cyan
Write-Host ""

# Set DATABASE_URL
$env:DATABASE_URL = $DatabaseUrl
Write-Host "DATABASE_URL has been set for this session" -ForegroundColor Green
Write-Host ""

# Push database schema
Write-Host "Pushing database schema..." -ForegroundColor Cyan
npm run db:push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== Database setup complete! ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "To run the project, use:" -ForegroundColor Yellow
    Write-Host '  $env:DATABASE_URL="' + $DatabaseUrl + '"' -ForegroundColor White
    Write-Host "  npm run dev" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "=== Database setup failed! ===" -ForegroundColor Red
    Write-Host "Please check your database connection details." -ForegroundColor Red
    Write-Host "Error code: $LASTEXITCODE" -ForegroundColor Red
}

