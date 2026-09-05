#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Bump the version of Retro Alarm Card and create a matching Git tag.

.DESCRIPTION
    1. Reads the current CARD_VERSION from retro-alarm-card.js
    2. Optionally accepts a new version as argument (CalVer: YYYY.M.X)
    3. Updates the version string in retro-alarm-card.js
    4. Commits the change
    5. Creates an annotated Git tag
    6. Optionally pushes tag + commit to origin

.PARAMETER Version
    New version in CalVer format YYYY.M.X (e.g. 2026.9.1).
    If omitted, auto-increments the patch number (X) of the current version.

.PARAMETER Push
    If set, automatically pushes the commit and tag to origin/main.

.EXAMPLE
    .\bump-version.ps1                        # auto-increment patch
    .\bump-version.ps1 -Version 2026.9.2     # specific version
    .\bump-version.ps1 -Version 2026.9.1 -Push  # bump + push
#>

param(
    [string]$Version = "",
    [switch]$Push
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = $PSScriptRoot
$JsFile = Join-Path $Root "retro-alarm-card.js"

if (-not (Test-Path $JsFile)) {
    Write-Error "Cannot find retro-alarm-card.js in $Root"
    exit 1
}

# --- Read current version ---
$content = Get-Content $JsFile -Raw
$match = [regex]::Match($content, "const CARD_VERSION\s*=\s*'([^']+)'")
if (-not $match.Success) {
    Write-Error "Could not find CARD_VERSION in $JsFile"
    exit 1
}
$currentVersion = $match.Groups[1].Value
Write-Host "Current version: $currentVersion" -ForegroundColor Cyan

# --- Determine new version ---
if ($Version -eq "") {
    # Auto-increment patch (X in YYYY.M.X)
    $parts = $currentVersion -split '\.'
    if ($parts.Count -lt 3) {
        Write-Error "Version '$currentVersion' is not in YYYY.M.X format"
        exit 1
    }
    $patch = [int]$parts[2] + 1
    $Version = "$($parts[0]).$($parts[1]).$patch"
    Write-Host "Auto-incremented to:  $Version" -ForegroundColor Yellow
} else {
    # Validate format YYYY.M.X
    if ($Version -notmatch '^\d{4}\.\d+\.\d+$') {
        Write-Error "Version '$Version' must be in YYYY.M.X format (e.g. 2026.9.1)"
        exit 1
    }
    Write-Host "Target version:       $Version" -ForegroundColor Yellow
}

if ($currentVersion -eq $Version) {
    Write-Host "Already at version $Version. Nothing to do." -ForegroundColor Green
    exit 0
}

# --- Check that no tag already exists for the new version ---
$existingTag = git tag --list $Version 2>$null
if ($existingTag) {
    Write-Error "Git tag '$Version' already exists. Choose a different version."
    exit 1
}

# --- Update version in JS file (header comment + const) ---
$updated = $content `
    -replace "(?m)(^\s*\*\s*Version:\s*)[\d.]+", "`${1}$Version" `
    -replace "(?m)(const CARD_VERSION\s*=\s*')[^']+(')", "`${1}$Version`${2}"

Set-Content $JsFile $updated -NoNewline -Encoding UTF8
Write-Host "Updated retro-alarm-card.js" -ForegroundColor Green

# --- Git commit ---
Push-Location $Root
try {
    git add retro-alarm-card.js
    git commit -m "chore: bump version to $Version"
    Write-Host "Committed: chore: bump version to $Version" -ForegroundColor Green

    # --- Create annotated Git tag ---
    git tag -a $Version -m "Release $Version"
    Write-Host "Created tag: $Version" -ForegroundColor Green

    if ($Push) {
        git push origin main
        git push origin $Version
        Write-Host "Pushed to origin/main + tag $Version" -ForegroundColor Green
        Write-Host ""
        Write-Host "Done! Now go to GitHub > Releases > Draft a new release" -ForegroundColor Cyan
        Write-Host "and publish release '$Version' to make it visible in HACS." -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "Done! To push:" -ForegroundColor Cyan
        Write-Host "   git push origin main && git push origin $Version" -ForegroundColor White
        Write-Host ""
        Write-Host "   Then on GitHub > Releases > Draft a new release, publish '$Version'." -ForegroundColor Cyan
    }
} finally {
    Pop-Location
}
