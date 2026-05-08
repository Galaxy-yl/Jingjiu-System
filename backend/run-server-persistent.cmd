@echo off
chcp 65001 >nul
title mian1 后端（崩溃会自动重启，窗口可最小化）
cd /d "%~dp0"

REM 可选：历史快照保留（月度总结需要），默认约 400 天；送货流水默认 90 天
REM set SNAPSHOT_RETENTION_DAYS=400
REM set DELIVERY_RETENTION_DAYS=90

echo.
echo  启动成功后，请用浏览器打开（不要双击本地 HTML 文件）：
echo    http://localhost:3000/
echo  或双击项目里的「打开系统.url」
echo.

:loop
echo [%date% %time%] 启动 node server.js ...
node server.js
echo [%date% %time%] 进程已退出 code=%errorlevel%，5 秒后自动重启...
timeout /t 5 /nobreak >nul
goto loop
