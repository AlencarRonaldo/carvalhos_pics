@echo off
echo Iniciando servidor web para Carvalho Sports Photography...
echo.
echo Escolha uma opcao:
echo 1. Python (se instalado)
echo 2. Node.js (se instalado)
echo 3. Instrucoes para outros metodos
echo.
set /p choice="Digite sua escolha (1-3): "

if "%choice%"=="1" (
    echo Tentando iniciar com Python...
    python -c "import http.server; import socketserver; socketserver.TCPServer(('', 8000), http.server.SimpleHTTPRequestHandler).serve_forever()" 2>nul
    if errorlevel 1 (
        python3 -c "import http.server; import socketserver; socketserver.TCPServer(('', 8000), http.server.SimpleHTTPRequestHandler).serve_forever()" 2>nul
        if errorlevel 1 (
            echo Python nao encontrado ou erro ao iniciar servidor
            goto :instructions
        )
    )
) else if "%choice%"=="2" (
    echo Tentando iniciar com Node.js...
    npx http-server -p 8000 2>nul
    if errorlevel 1 (
        echo Node.js nao encontrado ou http-server nao instalado
        echo Tentando instalar http-server...
        npm install -g http-server
        npx http-server -p 8000
        if errorlevel 1 (
            echo Erro ao iniciar servidor Node.js
            goto :instructions
        )
    )
) else (
    goto :instructions
)

echo Servidor iniciado com sucesso!
echo Acesse: http://localhost:8000
echo Para parar o servidor, pressione Ctrl+C
pause
goto :end

:instructions
echo.
echo ========================================
echo INSTRUCOES PARA INICIAR SERVIDOR WEB:
echo ========================================
echo.
echo OPCAO 1 - Python (mais simples):
echo 1. Abra o prompt de comando nesta pasta
echo 2. Digite: python -m http.server 8000
echo 3. Acesse: http://localhost:8000
echo.
echo OPCAO 2 - Node.js:
echo 1. Instale Node.js (nodejs.org)
echo 2. Digite: npx http-server -p 8000
echo 3. Acesse: http://localhost:8000
echo.
echo OPCAO 3 - Live Server (VS Code):
echo 1. Instale extensao "Live Server" no VS Code
echo 2. Clique direito no index.html
echo 3. Selecione "Open with Live Server"
echo.
echo OPCAO 4 - XAMPP:
echo 1. Baixe XAMPP (apachefriends.org)
echo 2. Copie pasta para htdocs
echo 3. Acesse: http://localhost/nome-da-pasta
echo.
echo OPCAO 5 - Netlify (Deploy online):
echo 1. Va para netlify.com
echo 2. Arraste a pasta do projeto
echo 3. Site ficara online automaticamente
echo.
pause

:end