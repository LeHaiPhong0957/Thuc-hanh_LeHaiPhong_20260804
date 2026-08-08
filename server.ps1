# POWERSHELL WEB SERVER FOR LE HAI PHONG - SEAWIND
$port = 3000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Server running at http://localhost:$port"

$publicDir = Join-Path (Get-Location) "public"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $req = $context.Request
        $res = $context.Response

        $res.Headers.Add("Access-Control-Allow-Origin", "*")

        $path = $req.Url.AbsolutePath
        if ($path -eq "/") { $path = "/index.html" }

        if ($req.HttpMethod -eq "POST" -and $path -eq "/api/exams/submit") {
            $reader = New-Object System.IO.StreamReader($req.InputStream)
            $bodyStr = $reader.ReadToEnd()
            $bodyJson = $bodyStr | ConvertFrom-Json
            
            $switches = 0
            if ($bodyJson.tabSwitches) { $switches = [int]$bodyJson.tabSwitches }

            $ans = $bodyJson.answers
            $count = 0
            if ($ans -and $ans.'1' -eq 'B') { $count++ }
            if ($ans -and $ans.'2' -eq 'C') { $count++ }
            if ($ans -and $ans.'3' -eq 'A') { $count++ }

            $percent = [math]::Round(($count / 3.0) * 100)
            $passed = ($percent -ge 70)
            $warnMsg = "Thao tac lam bai nghiem tuc, hop le."
            if ($switches -gt 0) { $warnMsg = "Canh bao Anti-Cheat: Ghi nhan chuyen tab $switches lan!" }

            $jsonResp = @{
                success = $true
                data = @{
                    studentName = "Hoc Vien LE HAI PHONG-Seawind"
                    examTitle = "Bai Thi Khao Sat Nang Luc Kiem Toan Noi Bo 2026"
                    correctCount = $count
                    total = 3
                    scorePercent = $percent
                    isPassed = $passed
                    antiCheatWarning = $warnMsg
                    details = @(
                        @{ questionId = 1; question = "Khung kiem soat noi bo COSO 2013 bao gom bao nhieu thanh phan cot loi?"; userAns = $ans.'1'; correctAns = "B"; isCorrect = ($ans.'1' -eq 'B'); explanation = "Khung COSO 2013 co 5 thanh phan cot loi va 17 nguyen tac chi dao." },
                        @{ questionId = 2; question = "Tuyen phong thu thu 3 trong Mo hinh 3 Tuyen Phong Thu (3 Lines Model) la gi?"; userAns = $ans.'2'; correctAns = "C"; isCorrect = ($ans.'2' -eq 'C'); explanation = "Tuyen 3 cung cap su dam bao doc lap va khach quan cho UBKT/HDQT." },
                        @{ questionId = 3; question = "Yeuto quan trong nhat dam bao tinh Doc Lap cua Kiem toan Noi bo la gi?"; userAns = $ans.'3'; correctAns = "A"; isCorrect = ($ans.'3' -eq 'A'); explanation = "Bao cao chuc nang cho UBKT/HDQT giup KTNB doc lap." }
                    )
                }
            } | ConvertTo-Json -Depth 5

            $buffer = [System.Text.Encoding]::UTF8.GetBytes($jsonResp)
            $res.ContentType = "application/json; charset=utf-8"
            $res.OutputStream.Write($buffer, 0, $buffer.Length)
            $res.Close()
            continue
        }

        if ($req.HttpMethod -eq "POST" -and $path -eq "/api/consultation") {
            $jsonResp = @{
                success = $true
                message = "Cam on ban! Ban co van LE HAI PHONG-Seawind se goi dien toi SDT 0913275851 trong 15 phut."
            } | ConvertTo-Json

            $buffer = [System.Text.Encoding]::UTF8.GetBytes($jsonResp)
            $res.ContentType = "application/json; charset=utf-8"
            $res.OutputStream.Write($buffer, 0, $buffer.Length)
            $res.Close()
            continue
        }

        $targetFile = Join-Path $publicDir ($path.TrimStart('/').Replace('/', '\'))
        if (-not (Test-Path $targetFile) -or (Test-Path $targetFile -PathType Container)) {
            $targetFile = Join-Path $publicDir "index.html"
        }

        $bytes = [System.IO.File]::ReadAllBytes($targetFile)
        $ext = [System.IO.Path]::GetExtension($targetFile).ToLower()

        switch ($ext) {
            ".html" { $res.ContentType = "text/html; charset=utf-8" }
            ".css"  { $res.ContentType = "text/css; charset=utf-8" }
            ".js"   { $res.ContentType = "application/javascript; charset=utf-8" }
            ".json" { $res.ContentType = "application/json; charset=utf-8" }
            default { $res.ContentType = "application/octet-stream" }
        }

        $res.OutputStream.Write($bytes, 0, $bytes.Length)
        $res.Close()
    }
} finally {
    $listener.Stop()
}
