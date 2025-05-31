$OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['*:Encoding'] = 'utf8'

function Write-Log {
    param(
        [string]$Message,
        [string]$Type = "INFO"
    )
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Output "[$timestamp] [$Type] $Message"
}

# 使用最基本的命令
Write-Host "`n>> 正在检查进程..." -ForegroundColor Cyan

Get-Process "node" -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "   正在停止进程: $($_.Id)" -ForegroundColor Gray
    Stop-Process -Id $_.Id -Force
}

Write-Host "`n>> 正在清理缓存..." -ForegroundColor Cyan
if (Test-Path ".next") {
    Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   清理完成" -ForegroundColor Green
}

Write-Host "`n>> 启动开发服务器..." -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Gray

npm run dev 