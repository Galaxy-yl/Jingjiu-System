@echo off
chcp 65001 >nul
echo.
echo === 精简 db.json（快照 + 送货流水，不删商家）===
echo 请先关闭正在运行的后端窗口/服务，再按任意键继续……
pause >nul
cd /d "%~dp0.."
if not exist "db.json" (
  echo 未找到 backend\db.json
  pause
  exit /b 1
)
node scripts\prune-db-offline.js
echo.
pause
