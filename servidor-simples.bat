@echo off
cls
echo ============================================
echo     CARVALHO SPORTS - SERVIDOR RAPIDO
echo ============================================
echo.
echo Iniciando servidor na porta 8000...
echo Aguarde...
echo.

start "Carvalho Sports" /min cmd /c "timeout /t 3 >nul && start http://localhost:8000"

python -m http.server 8000

echo.
echo Servidor finalizado.
pause