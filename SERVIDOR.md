# 🚀 Como Iniciar o Servidor Web

## Por que preciso de um servidor?
JavaScript modules, CORS e algumas funcionalidades só funcionam através de um servidor web, não abrindo o arquivo HTML diretamente no navegador.

## 🎯 MÉTODOS RÁPIDOS

### 1️⃣ **MAIS FÁCIL - Execute o arquivo start-server.bat**
```bash
# Duplo clique no arquivo start-server.bat
# ou execute no prompt:
start-server.bat
```

### 2️⃣ **Python (se instalado)**
```bash
# Abra o prompt nesta pasta e digite:
python -m http.server 8000
# ou
python3 -m http.server 8000

# Acesse: http://localhost:8000
```

### 3️⃣ **Node.js (se instalado)**
```bash
# Instale o http-server globalmente:
npm install -g http-server

# Execute na pasta do projeto:
http-server -p 8000

# Acesse: http://localhost:8000
```

### 4️⃣ **Visual Studio Code - Live Server**
1. Instale a extensão "Live Server"
2. Clique direito no `index.html`
3. Selecione "Open with Live Server"
4. Abrirá automaticamente no navegador

### 5️⃣ **XAMPP (Windows)**
1. Baixe e instale XAMPP
2. Copie a pasta do projeto para `htdocs`
3. Inicie Apache no painel do XAMPP
4. Acesse: `http://localhost/carvalho-sports-photography`

## 🌐 DEPLOY ONLINE (GRATUITO)

### **Netlify** (Recomendado)
1. Vá para [netlify.com](https://netlify.com)
2. Arraste a pasta do projeto
3. Site ficará online em segundos
4. URL será gerada automaticamente

### **Vercel**
1. Vá para [vercel.com](https://vercel.com)
2. Conecte seu GitHub ou faça upload
3. Deploy automático

### **GitHub Pages**
1. Suba os arquivos para GitHub
2. Vá em Settings > Pages
3. Selecione branch main
4. Site ficará em: `username.github.io/repo-name`

## 🔧 VERIFICANDO SE ESTÁ FUNCIONANDO

### ✅ Teste estas funcionalidades:
- [x] Página inicial carrega
- [x] Galeria funciona com filtros
- [x] Lightbox abre e navega
- [x] Admin panel (/admin) funciona
- [x] Formulário de contato envia
- [x] Responsivo no mobile

### 🚨 Se algo não funcionar:
1. Verifique o console do navegador (F12)
2. Certifique-se que está acessando via servidor (localhost:8000)
3. Não abra o HTML diretamente no navegador

## 📱 TESTANDO NO MOBILE
```
# Se estiver na mesma rede WiFi:
http://SEU-IP-LOCAL:8000

# Para descobrir seu IP:
# Windows: ipconfig
# Linux/Mac: ifconfig
```

## 🎉 URLS IMPORTANTES
- **Site Principal**: http://localhost:8000
- **Galeria**: http://localhost:8000/gallery.html  
- **Admin Panel**: http://localhost:8000/admin
- **Login Admin**: usuario: `admin` / senha: `carvalho123`

---
*Depois que escolher um método e o servidor estiver rodando, todas as funcionalidades do site estarão disponíveis!*