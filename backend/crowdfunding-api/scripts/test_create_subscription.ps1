$ErrorActionPreference = 'Stop'

$plans = Invoke-RestMethod -Uri 'http://localhost:8080/api/subscriptions/plans?userType=INVESTOR'
Write-Output 'Plans fetched:'
$plans | ConvertTo-Json
$planId = $plans[0].id
Write-Output "Using plan id: $planId"

$loginBody = @{ email='investor@example.com'; password='password123' } | ConvertTo-Json
$login = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -Body $loginBody -ContentType 'application/json'
Write-Output 'Login response:'
$login | ConvertTo-Json -Depth 5

$token = $login.token
Write-Output "Login token present: $($token -ne $null)"

$body = @{ subscriptionPlanId = $planId; razorpayPaymentId = 'test_pay_123' } | ConvertTo-Json
Write-Output 'Creating subscription...'
$resp = Invoke-RestMethod -Uri 'http://localhost:8080/api/subscriptions/create' -Method Post -Body $body -ContentType 'application/json' -Headers @{ Authorization = "Bearer $token" }
Write-Output 'Create response:'
$resp | ConvertTo-Json -Depth 5
