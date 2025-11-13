# Git Repository Setup Script
# Run this script after Git is installed

Write-Host "Setting up Git repository and creating feature branch..." -ForegroundColor Green
Write-Host ""

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Check if Git is available
try {
    $gitVersion = git --version 2>&1
    Write-Host "Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Git is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "After installation, restart PowerShell and run this script again." -ForegroundColor Yellow
    exit 1
}

# Initialize git if not already initialized
if (-not (Test-Path .git)) {
    Write-Host "Initializing Git repository..." -ForegroundColor Cyan
    git init
    Write-Host ""
}

# Add the remote (will update if it already exists)
Write-Host "Adding remote origin..." -ForegroundColor Cyan
git remote remove origin 2>$null
git remote add origin https://github.com/foresight-sports/commercial-wires-augie.git
Write-Host "Remote added: $(git remote get-url origin)" -ForegroundColor Green
Write-Host ""

# Check current branch status
Write-Host "Current branch status:" -ForegroundColor Cyan
git branch
Write-Host ""

# Create a new feature branch for development
$branchName = "feature/development"
Write-Host "Creating new feature branch: $branchName" -ForegroundColor Cyan
git checkout -b $branchName 2>$null
if ($LASTEXITCODE -ne 0) {
    git checkout $branchName
}
Write-Host ""

# Add all files
Write-Host "Adding all files..." -ForegroundColor Cyan
git add .
Write-Host ""

# Create initial commit if needed
Write-Host "Checking if initial commit is needed..." -ForegroundColor Cyan
$commitCount = (git rev-list --count HEAD 2>$null)
if ([string]::IsNullOrEmpty($commitCount) -or $commitCount -eq "0") {
    git commit -m "Initial commit: Commercial wires application setup"
    Write-Host "Initial commit created." -ForegroundColor Green
} else {
    Write-Host "Repository already has commits." -ForegroundColor Yellow
}
Write-Host ""

Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Current branch: $(git branch --show-current)" -ForegroundColor Cyan
Write-Host "Remote: origin -> $(git remote get-url origin)" -ForegroundColor Cyan
Write-Host ""
Write-Host "To push this branch:" -ForegroundColor Yellow
Write-Host "  git push -u origin $branchName" -ForegroundColor White
Write-Host ""
Write-Host "To create and push main branch:" -ForegroundColor Yellow
Write-Host "  git checkout -b main" -ForegroundColor White
Write-Host "  git push -u origin main" -ForegroundColor White
Write-Host ""


