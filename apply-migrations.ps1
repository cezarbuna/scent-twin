# PowerShell script to apply Supabase migrations
# Run this after setting your SUPABASE_ACCESS_TOKEN

Write-Host "🚀 ScentTwin Database Migration Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if access token is set
if (-not $env:SUPABASE_ACCESS_TOKEN) {
    Write-Host "⚠️  SUPABASE_ACCESS_TOKEN not set!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please get your access token from: https://app.supabase.com/account/tokens" -ForegroundColor Yellow
    Write-Host "Then run:" -ForegroundColor Yellow
    Write-Host '  $env:SUPABASE_ACCESS_TOKEN="your-token-here"' -ForegroundColor Green
    Write-Host ""
    exit 1
}

Write-Host "✅ Access token found" -ForegroundColor Green
Write-Host ""

# Link to project
Write-Host "🔗 Linking to Supabase project..." -ForegroundColor Cyan
npx supabase link --project-ref kzgdpypsofeydsltvlaa

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to link to project" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Linked successfully" -ForegroundColor Green
Write-Host ""

# Push migrations
Write-Host "📤 Pushing migrations to cloud database..." -ForegroundColor Cyan
npx supabase db push

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push migrations" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ All migrations applied successfully!" -ForegroundColor Green
Write-Host ""

# Generate TypeScript types
Write-Host "📝 Generating TypeScript types..." -ForegroundColor Cyan
npx supabase gen types typescript --linked | Out-File -FilePath "src/app/core/models/database.types.ts" -Encoding utf8

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Failed to generate types (you can do this manually later)" -ForegroundColor Yellow
} else {
    Write-Host "✅ TypeScript types generated" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Visit https://app.supabase.com/project/kzgdpypsofeydsltvlaa" -ForegroundColor White
Write-Host "2. Check Table Editor to see your 8 tables and 15 sample perfumes" -ForegroundColor White
Write-Host "3. Check Authentication - Policies to verify RLS is enabled" -ForegroundColor White
Write-Host "4. Run ng serve to start the app and test Supabase integration" -ForegroundColor White
Write-Host ""

