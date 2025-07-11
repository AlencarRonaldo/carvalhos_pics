// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.currentUser = null;
        this.portfolioData = [];
        this.messages = [];
        this.supporters = [];
        this.settings = {};
        
        this.init();
    }

    init() {
        this.loadSavedData();
        this.loadMockData();
        this.bindEvents();
        this.checkAuth();
    }

    loadSavedData() {
        // Load saved data from localStorage
        const savedPortfolio = localStorage.getItem('adminPortfolioData');
        const savedMessages = localStorage.getItem('adminMessages');
        const savedSupporters = localStorage.getItem('adminSupporters');
        const savedSettings = localStorage.getItem('adminSettings');

        if (savedPortfolio) {
            this.portfolioData = JSON.parse(savedPortfolio);
        }
        if (savedMessages) {
            this.messages = JSON.parse(savedMessages);
        }
        if (savedSupporters) {
            this.supporters = JSON.parse(savedSupporters);
        }
        if (savedSettings) {
            this.settings = JSON.parse(savedSettings);
        }
    }

    saveData() {
        try {
            // Save data to localStorage for persistence
            localStorage.setItem('adminPortfolioData', JSON.stringify(this.portfolioData));
            localStorage.setItem('adminMessages', JSON.stringify(this.messages));
            localStorage.setItem('adminSupporters', JSON.stringify(this.supporters));
            localStorage.setItem('adminSettings', JSON.stringify(this.settings));
        } catch (e) {
            console.error("Erro ao salvar dados no localStorage:", e);
            this.showNotification('Erro ao salvar: O armazenamento do navegador pode estar cheio. Exporte um backup e limpe os dados.', 'error');
        }
    }

    loadMockData() {
        // Only load mock data if no saved data exists
        if (this.portfolioData.length === 0) {
            this.portfolioData = [
            {
                id: 1,
                title: "Final do Campeonato",
                category: "futebol",
                description: "Momento decisivo da final do campeonato.",
                image: "/images/portfolio/futebol-01.jpg",
                dateAdded: "2024-01-15"
            },
            {
                id: 2,
                title: "Enterrada Espetacular",
                category: "basquete",
                description: "Lance épico durante a partida do NBB.",
                image: "/images/portfolio/basquete-01.jpg",
                dateAdded: "2024-01-14"
            },
            {
                id: 3,
                title: "Ataque Potente",
                category: "volei",
                description: "Cortada devastadora que garantiu o ponto.",
                image: "/images/portfolio/volei-01.jpg",
                dateAdded: "2024-01-13"
            },
            {
                id: 4,
                title: "Gol Decisivo",
                category: "futebol",
                description: "O gol que definiu o resultado da partida.",
                image: "/images/portfolio/futebol-02.jpg",
                dateAdded: "2024-01-12"
            },
            {
                id: 5,
                title: "Lance Livre Perfeito",
                category: "basquete",
                description: "Arremesso certeiro nos segundos finais.",
                image: "/images/portfolio/basquete-02.jpg",
                dateAdded: "2024-01-11"
            },
            {
                id: 6,
                title: "Defesa Impossível",
                category: "volei",
                description: "Um salvamento incrível que levantou a torcida.",
                image: "/images/portfolio/volei-02.jpg",
                dateAdded: "2024-01-10"
            },
            {
                id: 7,
                title: "Chegada Épica",
                category: "natacao",
                description: "Disputa acirrada nos 100m livre.",
                image: "/images/portfolio/natacao-01.jpg",
                dateAdded: "2024-01-09"
            },
            {
                id: 8,
                title: "Saque Perfeito",
                category: "tenis",
                description: "Um ace que selou a vitória no set.",
                image: "/images/portfolio/tenis-01.jpg",
                dateAdded: "2024-01-08"
            },
            {
                id: 9,
                title: "Borboleta Técnica",
                category: "natacao",
                description: "Técnica impecável no nado borboleta.",
                image: "/images/portfolio/natacao-02.jpg",
                dateAdded: "2024-01-07"
            }
        ];
        }

        // Only load mock messages if no saved data exists
        if (this.messages.length === 0) {
            this.messages = [
            {
                id: 1,
                sender: "João Silva",
                email: "joao@email.com",
                subject: "Evento Corporativo",
                message: "Gostaria de contratar seus serviços para um evento corporativo...",
                date: "2024-01-15",
                read: false
            },
            {
                id: 2,
                sender: "Maria Santos",
                email: "maria@email.com",
                subject: "Casamento",
                message: "Preciso de um fotógrafo para meu casamento...",
                date: "2024-01-14",
                read: false
            },
            {
                id: 3,
                sender: "Carlos Oliveira",
                email: "carlos@email.com",
                subject: "Ensaio Pessoal",
                message: "Interessado em fazer um ensaio pessoal...",
                date: "2024-01-13",
                read: true
            }
        ];
        }

        // Only load mock supporters if no saved data exists
        if (this.supporters.length === 0) {
            this.supporters = [
                {
                    id: 1,
                    name: "Equipamentos Pro",
                    logo: "", // Empty logo for icon fallback
                    url: "https://example.com"
                },
                {
                    id: 2,
                    name: "Liga Esportiva", 
                    logo: "", // Empty logo for icon fallback
                    url: "https://example.com"
                },
                {
                    id: 3,
                    name: "Arena Sports",
                    logo: "", // Empty logo for icon fallback
                    url: "https://example.com"
                }
            ];
        }
    }

    bindEvents() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Menu navigation
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => this.handleMenuClick(item));
        });

        // Add photo button
        const addPhotoBtn = document.getElementById('addPhotoBtn');
        if (addPhotoBtn) {
            addPhotoBtn.addEventListener('click', () => this.showAddPhotoModal());
        }

        // Modal close
        const modalClose = document.querySelector('.modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }

        // Cancel add photo
        const cancelAdd = document.getElementById('cancelAdd');
        if (cancelAdd) {
            cancelAdd.addEventListener('click', () => this.closeModal());
        }

        // Add photo form
        const addPhotoForm = document.getElementById('addPhotoForm');
        if (addPhotoForm) {
            addPhotoForm.addEventListener('submit', (e) => this.handleAddPhoto(e));
        }

        // File input preview for Add Modal
        const addPhotoFile = document.getElementById('addPhotoFile');
        if (addPhotoFile) {
            addPhotoFile.addEventListener('change', (e) => this.handleFilePreview(e, 'addFilePreview'));
        }

        // File input preview for Edit Modal
        const editPhotoFile = document.getElementById('editPhotoFile');
        if (editPhotoFile) {
            editPhotoFile.addEventListener('change', (e) => this.handleFilePreview(e, 'editCurrentImage'));
        }

        // Settings form
        const settingsForm = document.querySelector('.settings-form');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => this.handleSettingsUpdate(e));
        }

        // Add supporter button
        const addSupporterBtn = document.getElementById('addSupporterBtn');
        if (addSupporterBtn) {
            addSupporterBtn.addEventListener('click', () => this.addNewSupporter());
        }

        // Backup buttons
        const exportBtn = document.getElementById('exportData');
        const importBtn = document.getElementById('importData');
        const clearBtn = document.getElementById('clearData');
        const importFile = document.getElementById('importFile');
        const resetGalleryBtn = document.getElementById('resetGallery');

        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }
        if (importBtn) {
            importBtn.addEventListener('click', () => importFile.click());
        }
        if (importFile) {
            importFile.addEventListener('change', (e) => this.importData(e));
        }
        if (resetGalleryBtn) {
            resetGalleryBtn.addEventListener('click', () => this.resetGalleryData());
        }
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearAllData());
        }

        // Tab switching
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Edit photo modal
        const editPhotoForm = document.getElementById('editPhotoForm');
        if (editPhotoForm) {
            editPhotoForm.addEventListener('submit', (e) => this.handleEditPhoto(e));
        }

        const cancelEdit = document.getElementById('cancelEdit');
        if (cancelEdit) {
            cancelEdit.addEventListener('click', () => this.closeEditModal());
        }

        // Close edit modal when clicking on close button
        const editModalClose = document.querySelectorAll('#editPhotoModal .modal-close');
        editModalClose.forEach(btn => {
            btn.addEventListener('click', () => this.closeEditModal());
        });

        // Supporter modals
        const addSupporterModal = document.getElementById('addSupporterModal');
        const editSupporterModal = document.getElementById('editSupporterModal');
        const addSupporterForm = document.getElementById('addSupporterForm');
        const editSupporterForm = document.getElementById('editSupporterForm');
        const cancelAddSupporter = document.getElementById('cancelAddSupporter');
        const cancelEditSupporter = document.getElementById('cancelEditSupporter');

        // Close supporter modals
        const supporterModalCloses = document.querySelectorAll('#addSupporterModal .modal-close, #editSupporterModal .modal-close');
        supporterModalCloses.forEach(btn => {
            btn.addEventListener('click', () => this.closeSupporterModals());
        });

        if (cancelAddSupporter) {
            cancelAddSupporter.addEventListener('click', () => this.closeSupporterModals());
        }

        if (cancelEditSupporter) {
            cancelEditSupporter.addEventListener('click', () => this.closeSupporterModals());
        }

        // Supporter forms
        if (addSupporterForm) {
            addSupporterForm.addEventListener('submit', (e) => this.handleAddSupporter(e));
        }

        if (editSupporterForm) {
            editSupporterForm.addEventListener('submit', (e) => this.handleEditSupporter(e));
        }
    }

    checkAuth() {
        const isLoggedIn = localStorage.getItem('adminLoggedIn');
        if (isLoggedIn === 'true') {
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simple authentication (in production, use proper backend)
        if (username === 'admin' && password === 'carvalho123') {
            localStorage.setItem('adminLoggedIn', 'true');
            this.currentUser = { username: 'Carvalho' };
            this.showDashboard();
        } else {
            alert('Usuário ou senha incorretos');
        }
    }

    handleLogout() {
        localStorage.removeItem('adminLoggedIn');
        this.currentUser = null;
        this.showLogin();
    }

    showLogin() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('adminDashboard').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'flex';
        this.loadPortfolio();
        this.loadMessages();
        this.updateStats();
    }

    handleMenuClick(item) {
        // Remove active class from all items
        document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');

        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const sectionName = item.dataset.section;
        const section = document.getElementById(`${sectionName}-section`);
        if (section) {
            section.classList.add('active');
        }

        // Update page title
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.textContent = item.textContent.trim();
        }

        // Load section-specific data
        if (sectionName === 'portfolio') {
            this.loadPortfolio();
        } else if (sectionName === 'messages') {
            this.loadMessages();
        } else if (sectionName === 'supporters') {
            this.loadSupporters();
        }
    }

    loadPortfolio() {
        const portfolioGrid = document.querySelector('#portfolio-section .portfolio-grid');
        if (!portfolioGrid) return;

        portfolioGrid.innerHTML = '';

        this.portfolioData.forEach(item => {
            const portfolioItem = document.createElement('div');
            portfolioItem.className = 'portfolio-item';
            portfolioItem.style.cssText = `
                position: relative;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                transition: transform 0.3s ease;
            `;
            
            portfolioItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 150px; object-fit: cover;">
                <div class="portfolio-item-info" style="padding: 1rem;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #1e293b; font-size: 0.9rem;">${item.title}</h4>
                    <p style="margin: 0 0 1rem 0; color: #64748b; font-size: 0.8rem;">${item.category} • ${item.dateAdded}</p>
                    <div class="portfolio-actions" style="display: flex; gap: 0.5rem;">
                        <button class="btn-edit" data-id="${item.id}" style="
                            background: #2563eb; 
                            color: white; 
                            border: none; 
                            padding: 0.5rem 0.8rem; 
                            border-radius: 4px; 
                            cursor: pointer;
                            font-size: 0.8rem;
                        ">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn-delete" data-id="${item.id}" style="
                            background: #ef4444; 
                            color: white; 
                            border: none; 
                            padding: 0.5rem 0.8rem; 
                            border-radius: 4px; 
                            cursor: pointer;
                            font-size: 0.8rem;
                        ">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                </div>
            `;
            
            // Add event listeners
            const editBtn = portfolioItem.querySelector('.btn-edit');
            const deleteBtn = portfolioItem.querySelector('.btn-delete');
            
            editBtn.addEventListener('click', () => this.editPortfolioItem(item.id));
            deleteBtn.addEventListener('click', () => this.deletePortfolioItem(item.id));
            
            portfolioGrid.appendChild(portfolioItem);
        });
    }

    editPortfolioItem(id) {
        const item = this.portfolioData.find(p => p.id === parseInt(id));
        if (!item) return;
        
        // Preencher o modal de edição
        document.getElementById('editPhotoTitle').value = item.title;
        document.getElementById('editPhotoCategory').value = item.category;
        document.getElementById('editPhotoDescription').value = item.description;
        document.getElementById('editPhotoId').value = item.id;
        document.getElementById('editCurrentImage').src = item.image;
        document.getElementById('editPhotoUrl').value = item.image.startsWith('data:image') ? '(Imagem salva no navegador)' : item.image;
        
        // Mostrar o modal
        document.getElementById('editPhotoModal').style.display = 'flex';
    }

    handleEditPhoto(e) {
        e.preventDefault();
        
        const id = parseInt(document.getElementById('editPhotoId').value);
        const title = document.getElementById('editPhotoTitle').value;
        const category = document.getElementById('editPhotoCategory').value;
        const description = document.getElementById('editPhotoDescription').value;
        const fileInput = document.getElementById('editPhotoFile');
        
        // Encontrar e atualizar a foto
        const item = this.portfolioData.find(p => p.id === id);
        if (item) {
            const updateItem = () => {
                item.title = title;
                item.category = category;
                item.description = description;
                
                this.loadPortfolio();
                this.saveData();
                this.closeEditModal();
                this.showNotification('Foto atualizada com sucesso!', 'success');
            };

            if (fileInput.files[0]) {
                // Se uma nova imagem foi enviada, lê o arquivo
                const reader = new FileReader();
                reader.onload = (e) => {
                    item.image = e.target.result; // Salva a imagem como base64
                    updateItem();
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                // Se nenhuma imagem nova foi enviada, apenas atualiza os outros dados
                updateItem();
            }
        }

        // Limpa o campo de arquivo para a próxima edição
        fileInput.value = '';
    }

    closeEditModal() {
        document.getElementById('editPhotoModal').style.display = 'none';
    }

    deletePortfolioItem(id) {
        if (!confirm('Tem certeza que deseja excluir esta foto?')) return;

        const index = this.portfolioData.findIndex(p => p.id === parseInt(id));
        if (index > -1) {
            this.portfolioData.splice(index, 1);
            this.loadPortfolio();
            this.updateStats();
            this.saveData(); // Save changes
            this.showNotification('Foto removida com sucesso!', 'success');
        }
    }

    loadMessages() {
        const messagesList = document.querySelector('.messages-list');
        if (!messagesList) return;

        messagesList.innerHTML = '';

        this.messages.forEach(message => {
            const messageItem = document.createElement('div');
            messageItem.className = 'message-item';
            if (!message.read) {
                messageItem.style.backgroundColor = '#f0f9ff';
            }

            messageItem.innerHTML = `
                <div class="message-header">
                    <span class="message-sender">${message.sender}</span>
                    <span class="message-date">${message.date}</span>
                </div>
                <div class="message-subject">${message.subject}</div>
                <div class="message-preview">${message.message.substring(0, 100)}...</div>
            `;

            messageItem.addEventListener('click', () => {
                this.showMessageDetails(message);
            });

            messagesList.appendChild(messageItem);
        });

        // Update badge
        const unreadCount = this.messages.filter(m => !m.read).length;
        const badge = document.querySelector('.menu-item[data-section="messages"] .badge');
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    loadSupporters() {
        const supportersGrid = document.querySelector('.supporters-grid');
        if (!supportersGrid) return;

        supportersGrid.innerHTML = '';

        if (this.supporters.length === 0) {
            supportersGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #64748b;">
                    <i class="fas fa-handshake" style="font-size: 2rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>Nenhum apoiador cadastrado ainda.</p>
                    <p style="font-size: 0.9rem;">Clique em "Adicionar Apoiador" para começar.</p>
                </div>
            `;
            return;
        }

        this.supporters.forEach(supporter => {
            const supporterItem = document.createElement('div');
            supporterItem.className = 'supporter-item';
            supporterItem.style.cssText = `
                position: relative;
                background: white;
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                margin-bottom: 1rem;
            `;
            
            supporterItem.innerHTML = `
                <div class="supporter-actions">
                    <button class="btn-edit" onclick="adminPanel.editSupporter('${supporter.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="adminPanel.deleteSupporter('${supporter.id}')" title="Remover">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="supporter-content">
                    <div class="supporter-logo-thumb">
                        ${supporter.logo ? 
                            `<img src="${supporter.logo}" alt="${supporter.name}">` : 
                            `<i class="fas fa-image"></i>`
                        }
                    </div>
                    <div class="supporter-info">
                        <h3 class="supporter-title">${supporter.name}</h3>
                        <p class="supporter-url">${supporter.url || 'Sem URL definida'}</p>
                        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                            <span style="background: #10b981; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">
                                ${supporter.logo ? 'Com Logo' : 'Sem Logo'}
                            </span>
                            ${supporter.url ? 
                                `<span style="background: #3b82f6; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">
                                    Com Link
                                </span>` : ''
                            }
                        </div>
                    </div>
                </div>
            `;
            
            supportersGrid.appendChild(supporterItem);
        });
    }

    editSupporter(id) {
        const supporter = this.supporters.find(s => s.id === parseInt(id));
        if (!supporter) return;

        const newName = prompt('Nome do Apoiador:', supporter.name);
        if (!newName) return;

        const newUrl = prompt('URL do Apoiador:', supporter.url);
        if (!newUrl) return;

        const newLogo = prompt('Ícone do Apoiador (classe Font Awesome):', supporter.logo);
        if (!newLogo) return;

        const isActive = confirm('Apoiador ativo?');

        // Update supporter
        supporter.name = newName;
        supporter.url = newUrl;
        supporter.logo = newLogo;
        supporter.active = isActive;

        this.loadSupporters();
        this.saveData(); // Save changes
        this.showNotification('Apoiador atualizado com sucesso!', 'success');
    }

    deleteSupporter(id) {
        if (!confirm('Tem certeza que deseja remover este apoiador?')) return;

        const index = this.supporters.findIndex(s => s.id == id);
        if (index > -1) {
            this.supporters.splice(index, 1);
            this.loadSupporters();
            this.saveData(); // Save changes
            this.updateFrontendSupporters();
            this.showNotification('Apoiador removido com sucesso!', 'success');
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.admin-notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'admin-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                ${message}
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showAddPhotoModal() {
        const modal = document.getElementById('addPhotoModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    closeModal() {
        const modal = document.getElementById('addPhotoModal');
        if (modal) {
            modal.style.display = 'none';
            document.getElementById('addPhotoForm').reset();
            document.getElementById('addFilePreview').innerHTML = '';
        }
    }

    handleAddPhoto(e) {
        e.preventDefault();
    
        const title = document.getElementById('photoTitle').value;
        const category = document.getElementById('photoCategory').value;
        const description = document.getElementById('photoDescription').value;
        const fileInput = document.getElementById('addPhotoFile');
    
        if (!fileInput.files[0]) {
            this.showNotification('Por favor, selecione uma imagem.', 'error');
            return;
        }
    
        const reader = new FileReader();
        reader.onload = (event) => {
            const newPhoto = {
                id: Date.now(), // Use timestamp for a unique ID
                title,
                category,
                description,
                image: event.target.result, // Salva a imagem como base64
                dateAdded: new Date().toISOString().split('T')[0]
            };
    
            this.portfolioData.unshift(newPhoto);
            this.loadPortfolio();
            this.closeModal();
            this.updateStats();
            this.saveData(); // Save changes
    
            this.showNotification('Foto adicionada com sucesso!', 'success');
        };
    
        reader.readAsDataURL(fileInput.files[0]);
    }

    showMessageDetails(message) {
        alert(`
Remetente: ${message.sender}
Email: ${message.email}
Assunto: ${message.subject}

Mensagem:
${message.message}
        `);
        
        // Mark as read
        message.read = true;
        this.loadMessages();
        this.saveData(); // Save changes
    }

    updateStats() {
        // Update portfolio count
        const portfolioStat = document.querySelector('.stat-card .stat-number');
        if (portfolioStat) {
            portfolioStat.textContent = this.portfolioData.length;
        }

        // Update messages count
        const messagesStat = document.querySelectorAll('.stat-card .stat-number')[1];
        if (messagesStat) {
            messagesStat.textContent = this.messages.length;
        }
    }

    handleSettingsUpdate(e) {
        e.preventDefault();
        
        const siteName = document.getElementById('siteName').value;
        const siteDescription = document.getElementById('siteDescription').value;
        const contactEmail = document.getElementById('contactEmail').value;
        const galleryTitle = document.getElementById('galleryTitle').value;
        const gallerySubtitle = document.getElementById('gallerySubtitle').value;

        // Update settings object
        this.settings.siteName = siteName;
        this.settings.siteDescription = siteDescription;
        this.settings.contactEmail = contactEmail;
        this.settings.galleryTitle = galleryTitle;
        this.settings.gallerySubtitle = gallerySubtitle;

        this.saveData(); // Save changes
        this.showNotification('Configurações salvas com sucesso!', 'success');
        
        // Notify main gallery to update if it's listening
        window.dispatchEvent(new CustomEvent('gallerySettingsUpdated', {
            detail: { galleryTitle, gallerySubtitle }
        }));
    }

    addNewSupporter() {
        const modal = document.getElementById('addSupporterModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    closeSupporterModals() {
        const addModal = document.getElementById('addSupporterModal');
        const editModal = document.getElementById('editSupporterModal');
        
        if (addModal) addModal.style.display = 'none';
        if (editModal) editModal.style.display = 'none';
        
        // Reset forms
        const addForm = document.getElementById('addSupporterForm');
        const editForm = document.getElementById('editSupporterForm');
        
        if (addForm) addForm.reset();
        if (editForm) editForm.reset();
        
        // Clear previews
        const addPreview = document.getElementById('supporterLogoPreview');
        const editPreview = document.getElementById('editSupporterLogoPreview');
        
        if (addPreview) addPreview.innerHTML = '';
        if (editPreview) editPreview.innerHTML = '';
    }

    handleAddSupporter(e) {
        e.preventDefault();
        
        if (this.supporters.length >= 5) {
            this.showNotification('Máximo de 5 apoiadores permitido!', 'error');
            return;
        }
        
        const name = document.getElementById('supporterName').value;
        const url = document.getElementById('supporterUrl').value;
        const logoFile = document.getElementById('supporterLogo').files[0];
        
        if (!name || !logoFile) {
            this.showNotification('Nome e logo são obrigatórios!', 'error');
            return;
        }
        
        // Convert image to base64
        const reader = new FileReader();
        reader.onload = (event) => {
            const newSupporter = {
                id: Date.now(), // Use timestamp for unique ID
                name: name,
                url: url || '',
                logo: event.target.result
            };
            
            this.supporters.push(newSupporter);
            this.loadSupporters();
            this.saveData();
            this.updateFrontendSupporters();
            this.closeSupporterModals();
            this.showNotification('Apoiador adicionado com sucesso!', 'success');
        };
        
        reader.readAsDataURL(logoFile);
    }

    handleEditSupporter(e) {
        e.preventDefault();
        
        const id = document.getElementById('editSupporterId').value;
        const name = document.getElementById('editSupporterName').value;
        const url = document.getElementById('editSupporterUrl').value;
        const logoFile = document.getElementById('editSupporterLogo').files[0];
        
        const supporter = this.supporters.find(s => s.id == id);
        if (!supporter) {
            this.showNotification('Apoiador não encontrado!', 'error');
            return;
        }
        
        supporter.name = name;
        supporter.url = url || '';
        
        if (logoFile && logoFile.size > 0) {
            // Update logo if new file provided
            const reader = new FileReader();
            reader.onload = (event) => {
                supporter.logo = event.target.result;
                this.updateSupporterComplete();
            };
            reader.readAsDataURL(logoFile);
        } else {
            this.updateSupporterComplete();
        }
    }

    updateSupporterComplete() {
        this.loadSupporters();
        this.saveData();
        this.updateFrontendSupporters();
        this.closeSupporterModals();
        this.showNotification('Apoiador atualizado com sucesso!', 'success');
    }

    editSupporter(id) {
        const supporter = this.supporters.find(s => s.id == id);
        if (!supporter) return;

        // Fill form with current data
        document.getElementById('editSupporterName').value = supporter.name;
        document.getElementById('editSupporterUrl').value = supporter.url || '';
        document.getElementById('editSupporterId').value = supporter.id;
        
        // Show current logo
        const currentLogoImg = document.getElementById('editCurrentSupporterLogo');
        if (currentLogoImg && supporter.logo) {
            currentLogoImg.src = supporter.logo;
        }

        // Show modal
        const modal = document.getElementById('editSupporterModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    updateFrontendSupporters() {
        // Trigger storage event manually if same origin
        try {
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'adminSupporters',
                newValue: JSON.stringify(this.supporters),
                url: window.location.href
            }));
        } catch (e) {
            console.log('Storage event not dispatched:', e);
        }
        
        // Also try to call function directly if available
        if (window.loadSupportersFromAdmin) {
            window.loadSupportersFromAdmin();
        }
        
        // If parent window exists (iframe case)
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                type: 'updateSupporters',
                data: this.supporters
            }, '*');
        }
    }

    switchTab(tabName) {
        // Remove active from all tabs
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Add active to selected tab
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    handleFilePreview(e, previewElementId) {
        const file = e.target.files[0];
        const previewElement = document.getElementById(previewElementId);

        if (!file || !previewElement) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            if (previewElement.tagName === 'IMG') {
                previewElement.src = event.target.result;
            } else {
                previewElement.innerHTML = `<img src="${event.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 6px;">`;
            }
        };
        reader.readAsDataURL(file);
    }

    resetGalleryData() {
        if (!confirm('Isso substituirá todas as fotos da galeria pelas 9 fotos padrão. As fotos atuais serão perdidas. Deseja continuar?')) {
            return;
        }

        // Limpa os dados do portfólio atual
        this.portfolioData = [];

        // Força o carregamento dos dados mock (as 9 fotos padrão)
        this.loadMockData();

        // Salva os dados padrão no localStorage
        this.saveData();

        // Atualiza a interface
        this.loadPortfolio();
        this.updateStats();

        this.showNotification('Galeria resetada com sucesso para o padrão!', 'success');
    }

    exportData() {
        const data = {
            portfolio: this.portfolioData,
            messages: this.messages,
            supporters: this.supporters,
            settings: this.settings,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `carvalho-admin-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Backup exportado com sucesso!', 'success');
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (!data.portfolio || !data.messages || !data.supporters) {
                    throw new Error('Arquivo de backup inválido');
                }

                if (!confirm('Isso substituirá todos os dados atuais. Continuar?')) {
                    return;
                }

                this.portfolioData = data.portfolio || [];
                this.messages = data.messages || [];
                this.supporters = data.supporters || [];
                this.settings = data.settings || {};

                this.saveData();
                this.loadPortfolio();
                this.loadMessages();
                this.loadSupporters();
                this.updateStats();

                this.showNotification('Dados importados com sucesso!', 'success');
                
            } catch (error) {
                this.showNotification('Erro ao importar arquivo: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }

    clearAllData() {
        if (!confirm('ATENÇÃO: Isso apagará TODOS os dados permanentemente. Tem certeza?')) {
            return;
        }

        if (!confirm('Última confirmação: Todos os dados serão perdidos!')) {
            return;
        }

        // Clear all data
        this.portfolioData = [];
        this.messages = [];
        this.supporters = [];
        this.settings = {};

        // Clear localStorage
        localStorage.removeItem('adminPortfolioData');
        localStorage.removeItem('adminMessages');
        localStorage.removeItem('adminSupporters');
        localStorage.removeItem('adminSettings');

        // Reload interface
        this.loadMockData();
        this.loadPortfolio();
        this.loadMessages();
        this.loadSupporters();
        this.updateStats();

        // Salva os dados mock para garantir que a galeria principal não fique vazia
        this.saveData();

        this.showNotification('Todos os dados foram apagados!', 'success');
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const addModal = document.getElementById('addPhotoModal');
    const editModal = document.getElementById('editPhotoModal');
    
    if (e.target === addModal) {
        addModal.style.display = 'none';
    }
    if (e.target === editModal) {
        editModal.style.display = 'none';
    }
});