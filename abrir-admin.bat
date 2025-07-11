@echo off
echo ========================================
echo   ABRINDO PAINEL ADMINISTRATIVO
echo ========================================
echo.
echo Verificando se o servidor esta rodando...
echo.

:: Tentar abrir o admin panel
start http://localhost:8000/admin

:: Verificar se funcionou
timeout /t 2 /nobreak >nul

:: Se não conseguir abrir, mostrar instruções
echo.
echo Se a pagina nao abriu automaticamente:
echo.
echo 1. Certifique-se que o servidor esta rodando
echo 2. Execute: iniciar-servidor.bat
echo 3. Depois acesse: http://localhost:8000/admin
echo.
echo Login: admin
echo Senha: carvalho123
echo.
pause