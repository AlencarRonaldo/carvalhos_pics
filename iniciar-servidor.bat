@echo off
title Carvalho Sports Photography - Servidor Web
color 0a
echo.
echo ========================================
echo   CARVALHO SPORTS PHOTOGRAPHY
echo   Servidor Web - Inicializando...
echo ========================================
echo.

:: Verificar se está na pasta correta
if not exist "index.html" (
    echo ERRO: Arquivo index.html nao encontrado!
    echo Certifique-se de estar na pasta correta do projeto.
    echo.
    pause
    exit /b 1
)

:: Mostrar informações do projeto
echo Projeto: Carvalho Sports Photography
echo Pasta: %CD%
echo Data: %DATE% %TIME%
echo.

:: Tentar iniciar servidor Python
echo Tentando iniciar servidor web...
echo.

:: Método 1: Python 3
python -c "import http.server; import socketserver; import webbrowser; webbrowser.open('http://localhost:8000'); socketserver.TCPServer(('', 8000), http.server.SimpleHTTPRequestHandler).serve_forever()" 2>nul
if %errorlevel% equ 0 goto :success

:: Método 2: Python (versão alternativa)
python3 -c "import http.server; import socketserver; import webbrowser; webbrowser.open('http://localhost:8000'); socketserver.TCPServer(('', 8000), http.server.SimpleHTTPRequestHandler).serve_forever()" 2>nul
if %errorlevel% equ 0 goto :success

:: Método 3: Tentar com py
py -3 -c "import http.server; import socketserver; import webbrowser; webbrowser.open('http://localhost:8000'); socketserver.TCPServer(('', 8000), http.server.SimpleHTTPRequestHandler).serve_forever()" 2>nul
if %errorlevel% equ 0 goto :success

:: Se Python não funcionar, mostrar alternativas
goto :alternatives

:success
echo.
echo ========================================
echo   SERVIDOR INICIADO COM SUCESSO!
echo ========================================
echo.
echo URLs Importantes:
echo ► Site Principal: http://localhost:8000
echo ► Admin Panel:    http://localhost:8000/admin
echo ► Galeria:        http://localhost:8000/gallery.html
echo.
echo Login Admin: admin / carvalho123
echo.
echo O navegador sera aberto automaticamente...
echo Para parar o servidor: Ctrl + C
echo.
pause
goto :end

:alternatives
color 0c
echo.
echo ========================================
echo   PYTHON NAO ENCONTRADO!
echo ========================================
echo.
echo SOLUCOES ALTERNATIVAS:
echo.
echo 1. INSTALAR PYTHON:
echo    ► https://python.org/downloads
echo    ► Marque "Add to PATH" na instalacao
echo.
echo 2. USAR NODE.JS:
echo    ► npm install -g http-server
echo    ► http-server -p 8000
echo.
echo 3. USAR XAMPP:
echo    ► Baixe em apachefriends.org
echo    ► Copie pasta para htdocs
echo    ► Inicie Apache
echo.
echo 4. USAR LIVE SERVER (VS CODE):
echo    ► Instale extensao "Live Server"
echo    ► Clique direito no index.html
echo    ► "Open with Live Server"
echo.
echo 5. DEPLOY ONLINE (NETLIFY):
echo    ► Arraste pasta para netlify.com
echo    ► Site fica online em segundos
echo.
echo Pressione qualquer tecla para fechar...
pause > nul

:end