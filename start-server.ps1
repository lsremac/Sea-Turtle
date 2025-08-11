# TurtleQuest Game Server
# Simple HTTP server for local development

Write-Host "Starting TurtleQuest Game Server..." -ForegroundColor Green
Write-Host ""
Write-Host "This will start a simple HTTP server on port 8000" -ForegroundColor Yellow
Write-Host "Open your browser and go to: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

try {
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add('http://localhost:8000/')
    $listener.Start()
    
    Write-Host "Server running at http://localhost:8000/" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        $localPath = $localPath -replace '/', '\'
        
        if ($localPath -eq '\') {
            $localPath = '\index.html'
        }
        
        $fullPath = Join-Path $PWD $localPath
        
        if (Test-Path $fullPath) {
            $content = [System.IO.File]::ReadAllBytes($fullPath)
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            $response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes('File not found')
            $response.ContentLength64 = $notFound.Length
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
        }
        
        $response.Close()
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
} finally {
    if ($listener) {
        $listener.Stop()
        Write-Host "Server stopped." -ForegroundColor Yellow
    }
}
