# Script to sync files from Downloads folder and prepare for push
# This will copy any updated files and prepare the repository for GitHub Desktop

Write-Host "Syncing files from Downloads folder to GitHub repository..." -ForegroundColor Green
Write-Host ""

$sourcePath = "C:\Users\ajones\Downloads\commercial-wires-main\commercial-wires-main"
$targetPath = "C:\Users\ajones\Documents\GitHub\Commercial-Wires-Augie"

if (-not (Test-Path $sourcePath)) {
    Write-Host "ERROR: Source path not found: $sourcePath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $targetPath)) {
    Write-Host "ERROR: Target path not found: $targetPath" -ForegroundColor Red
    exit 1
}

Write-Host "Source: $sourcePath" -ForegroundColor Cyan
Write-Host "Target: $targetPath" -ForegroundColor Cyan
Write-Host ""

# Files and folders to sync (excluding node_modules, .git, etc.)
$excludePatterns = @(
    "node_modules",
    ".git",
    ".github",
    "dist",
    "build",
    ".next",
    "*.log",
    ".DS_Store"
)

$filesCopied = 0
$filesSkipped = 0

# Function to copy files recursively
function Copy-FilesRecursive {
    param(
        [string]$Source,
        [string]$Destination,
        [string[]]$Exclude
    )
    
    $items = Get-ChildItem -Path $Source -Force
    
    foreach ($item in $items) {
        $shouldExclude = $false
        foreach ($pattern in $Exclude) {
            if ($item.Name -like $pattern) {
                $shouldExclude = $true
                break
            }
        }
        
        if ($shouldExclude) {
            continue
        }
        
        $destPath = Join-Path $Destination $item.Name
        
        if ($item.PSIsContainer) {
            if (-not (Test-Path $destPath)) {
                New-Item -ItemType Directory -Path $destPath -Force | Out-Null
            }
            Copy-FilesRecursive -Source $item.FullName -Destination $destPath -Exclude $Exclude
        } else {
            $copy = $false
            if (-not (Test-Path $destPath)) {
                $copy = $true
            } else {
                $sourceTime = $item.LastWriteTime
                $destTime = (Get-Item $destPath).LastWriteTime
                if ($sourceTime -gt $destTime) {
                    $copy = $true
                }
            }
            
            if ($copy) {
                Copy-Item -Path $item.FullName -Destination $destPath -Force
                $script:filesCopied++
                Write-Host "Copied: $($item.FullName.Replace($Source, ''))" -ForegroundColor Green
            } else {
                $script:filesSkipped++
            }
        }
    }
}

Write-Host "Starting file sync..." -ForegroundColor Cyan
Write-Host ""

Copy-FilesRecursive -Source $sourcePath -Destination $targetPath -Exclude $excludePatterns

Write-Host ""
Write-Host "Sync complete!" -ForegroundColor Green
Write-Host "Files copied: $filesCopied" -ForegroundColor Cyan
Write-Host "Files skipped (up to date): $filesSkipped" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Open GitHub Desktop" -ForegroundColor White
Write-Host "2. The repository should show changes" -ForegroundColor White
Write-Host "3. Review the changes in the left sidebar" -ForegroundColor White
Write-Host "4. Stage all files (check the box at the top)" -ForegroundColor White
Write-Host "5. Enter a commit message" -ForegroundColor White
Write-Host "6. Click 'Commit to main'" -ForegroundColor White
Write-Host "7. Click 'Push origin' to push to GitHub" -ForegroundColor White
Write-Host ""

