$token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJpbnZlc3RvckBleGFtcGxlLmNvbSIsImlhdCI6MTc3MDIxODk1OSwiZXhwIjoxNzcwMzA1MzU5fQ.BszYgAWeGWKTD_I96wLGoRwEBbbMMtfk830cF0yLwoeX22suJA8zkq3uvlegOqg-dp5b5cuLhg2ZEDIQ9N6YCg'
Write-Output 'Checking active subscription...'
$resp = Invoke-RestMethod -Uri 'http://localhost:8080/api/subscriptions/active' -Headers @{ Authorization = "Bearer $token" }
$resp | ConvertTo-Json -Depth 5
