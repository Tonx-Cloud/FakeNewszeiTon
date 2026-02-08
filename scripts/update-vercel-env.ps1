#!/usr/bin/env pwsh
# update-vercel-env.ps1 - PowerShell version for Windows
# Updated to use Gemini instead of OpenAI

if ([string]::IsNullOrEmpty($env:VERCEL_TOKEN)) {
    Write-Error "ERROR: set VERCEL_TOKEN in your environment"
    exit 1
}

$PROJECT_NAME = "FakeNewsZeiTon"
$PROJECT_ID = $env:PROJECT_ID

if ([string]::IsNullOrEmpty($env:NEW_GEMINI_KEY)) { throw "set NEW_GEMINI_KEY" }
if ([string]::IsNullOrEmpty($env:NEW_RESEND_KEY)) { throw "set NEW_RESEND_KEY" }
if ([string]::IsNullOrEmpty($env:NEW_SUPABASE_SERVICE_ROLE_KEY)) { throw "set NEW_SUPABASE_SERVICE_ROLE_KEY" }
if ([string]::IsNullOrEmpty($env:NEW_PUBLIC_APP_URL)) { throw "set NEW_PUBLIC_APP_URL" }
if ([string]::IsNullOrEmpty($env:NEW_CRON_SECRET)) { throw "set NEW_CRON_SECRET" }
if ([string]::IsNullOrEmpty($env:NEW_UNSUB_SECRET)) { throw "set NEW_UNSUB_SECRET" }
$env:NEW_GEMINI_MODEL = if ($env:NEW_GEMINI_MODEL) { $env:NEW_GEMINI_MODEL } else { "gemini-2.0-flash" }
$env:NEW_FROM_EMAIL = if ($env:NEW_FROM_EMAIL) { $env:NEW_FROM_EMAIL } else { "FakeNewsZeiTon <onboarding@resend.dev>" }

function Get-ProjectId {
    if ($PROJECT_ID) { return $PROJECT_ID }
    Write-Host "Fetching project id for $PROJECT_NAME..."
    $headers = @{"Authorization" = "Bearer $env:VERCEL_TOKEN"}
    $response = Invoke-RestMethod -Uri "https://api.vercel.com/v9/projects?name=$PROJECT_NAME" -Headers $headers
    $PROJECT_ID = $response.projects[0].id
    if ([string]::IsNullOrEmpty($PROJECT_ID)) {
        Write-Error "ERROR: cannot determine PROJECT_ID"
        exit 1
    }
    return $PROJECT_ID
}

function Upsert-Env {
    param($name, $value, $scope = "production")
    $projectId = Get-ProjectId
    Write-Host "Upserting $name ($scope)..."
    $headers = @{"Authorization" = "Bearer $env:VERCEL_TOKEN"}
    $envResponse = Invoke-RestMethod -Uri "https://api.vercel.com/v9/projects/$projectId/env" -Headers $headers
    $existing = ($envResponse.env | Where-Object { $_.key -eq $name }).id
    if ($existing) {
        Invoke-RestMethod -Uri "https://api.vercel.com/v9/projects/$projectId/env/$existing" -Headers $headers -Method Delete | Out-Null
    }
    $body = @{key=$name; value=$value; target=@($scope); type="secret"} | ConvertTo-Json
    Invoke-RestMethod -Uri "https://api.vercel.com/v9/projects/$projectId/env" -Headers $headers -Method Post -Body $body -ContentType "application/json" | Out-Null
    Write-Host " -> $name done"
}

# Gemini API (replaced OpenAI)
Upsert-Env "GEMINI_API_KEY" $env:NEW_GEMINI_KEY
Upsert-Env "GEMINI_MODEL" $env:NEW_GEMINI_MODEL

# Other variables
Upsert-Env "RESEND_API_KEY" $env:NEW_RESEND_KEY
Upsert-Env "SUPABASE_SERVICE_ROLE_KEY" $env:NEW_SUPABASE_SERVICE_ROLE_KEY
Upsert-Env "FROM_EMAIL" $env:NEW_FROM_EMAIL
Upsert-Env "PUBLIC_APP_URL" $env:NEW_PUBLIC_APP_URL
Upsert-Env "CRON_SECRET" $env:NEW_CRON_SECRET
Upsert-Env "UNSUB_SECRET" $env:NEW_UNSUB_SECRET

Write-Host ""
Write-Host "All environment variables upserted. Consider triggering a production deploy."
Write-Host ""
Write-Host "To use this script, run:"
Write-Host '  $env:VERCEL_TOKEN="your-token"'
Write-Host '  $env:NEW_GEMINI_KEY="your-gemini-key"'
Write-Host '  .\scripts\update-vercel-env.ps1'
