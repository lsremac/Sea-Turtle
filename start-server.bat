@echo off
echo Starting TurtleQuest Game Server...
echo.
echo This will start a simple HTTP server on port 8000
echo Open your browser and go to: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

powershell -Command "& { $listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:8000/'); $listener.Start(); Write-Host 'Server running at http://localhost:8000/'; Write-Host 'Press Ctrl+C to stop'; try { while ($listener.IsListening) { $context = $listener.GetContext(); $request = $context.Request; $response = $context.Response; $localPath = $request.Url.LocalPath; $localPath = $localPath -replace '/', '\'; if ($localPath -eq '\') { $localPath = '\index.html'; } $fullPath = Join-Path $PWD $localPath; if (Test-Path $fullPath) { $content = [System.IO.File]::ReadAllBytes($fullPath); $response.ContentLength64 = $content.Length; $response.OutputStream.Write($content, 0, $content.Length); } else { $response.StatusCode = 404; $notFound = [System.Text.Encoding]::UTF8.GetBytes('File not found'); $response.ContentLength64 = $notFound.Length; $response.OutputStream.Write($notFound, 0, $notFound.Length); } $response.Close(); } } finally { $listener.Stop(); } }"

pause
