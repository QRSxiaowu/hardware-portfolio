@echo off
chcp 65001 >nul
echo ========================================
echo  吴学纯 - 硬件工程师作品集
echo ========================================
echo.
echo 启动本地服务器，支持手机访问...
start http://localhost:3000
node "%~dp0website\server.js"
if errorlevel 1 (
  echo.
  echo 启动失败，请确保已安装 Node.js
  pause
)
