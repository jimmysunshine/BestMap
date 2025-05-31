@echo off
chcp 65001>nul

echo.
echo ============================================
echo              开发服务器启动工具
echo ============================================
echo.

echo [1/3] 检查进程状态...
taskkill /F /IM "node.exe" 2>nul
if not errorlevel 1 (
    echo      √ Node.js 进程已终止
) else (
    echo      - 未发现运行中的进程
)

echo.
echo [2/3] 清理开发目录...
if exist ".next" (
    rd /s /q ".next" 2>nul
    echo      √ .next 目录已清理
) else (
    echo      - .next 目录不存在
)

echo.
echo [3/3] 启动开发服务器...
echo ============================================
echo.

npm run dev 