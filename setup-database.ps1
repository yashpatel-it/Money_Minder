# Database Setup Script for Money-Minder
# This script helps you set up the database connection

Write-Host "=== Money-Minder Database Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if DATABASE_URL is already set
if ($env:DATABASE_URL) {
    Write-Host "DATABASE_URL is currently set to: $env:DATABASE_URL" -ForegroundColor Yellow
    Write-Host ""
    $useExisting = Read-Host "Do you want to use this existing DATABASE_URL? (y/n)"
    if ($useExisting -eq "y" -or $useExisting -eq "Y") {
        Write-Host "Using existing DATABASE_URL..." -ForegroundColor Green
        Write-Host ""
        Write-Host "Pushing database schema..." -ForegroundColor Cyan
        npm run db:push
        exit
    }
}

Write-Host "Please provide your PostgreSQL connection details:" -ForegroundColor Yellow
Write-Host ""

$host = Read-Host "Database Host (default: localhost)"
if ([string]::IsNullOrWhiteSpace($host)) { $host = "localhost" }

$port = Read-Host "Database Port (default: 5432)"
if ([string]::IsNullOrWhiteSpace($port)) { $port = "5432" }

$database = Read-Host "Database Name (default: moneyminder)"
if ([string]::IsNullOrWhiteSpace($database)) { $database = "moneyminder" }

$username = Read-Host "Database Username (default: postgres)"
if ([string]::IsNullOrWhiteSpace($username)) { $username = "postgres" }

$password = Read-Host "Database Password" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

# Construct DATABASE_URL
$databaseUrl = "postgresql://${username}:${passwordPlain}@${host}:${port}/${database}"

Write-Host ""
Write-Host "Setting DATABASE_URL environment variable for this session..." -ForegroundColor Cyan
$env:DATABASE_URL = $databaseUrl

Write-Host ""
Write-Host "Pushing database schema..." -ForegroundColor Cyan
npm run db:push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== Database setup complete! ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "To run the project, use:" -ForegroundColor Yellow
    Write-Host '  $env:DATABASE_URL="' + $databaseUrl + '"' -ForegroundColor White
    Write-Host "  npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "Or set DATABASE_URL permanently in your system environment variables." -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "=== Database setup failed! ===" -ForegroundColor Red
    Write-Host "Please check your database connection details and try again." -ForegroundColor Red
}

