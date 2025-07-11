// Portfolio data is now loaded from portfolio-data.js
// Access via PortfolioData.photos

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const portfolioGrid = document.querySelector('.portfolio-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDescription = document.getElementById('lightbox-description');
const lightboxClose = document.querySelector('.lightbox-close');
const contactForm = document.getElementById('contactForm');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeMainGallery();
    initializeSupporters();
    initializeNavigation();
    initializeSmoothScroll();
    initializeAnimations();
    initializeForm();
    initializeLazyLoading();
    initializePerformanceOptimizations();
});

// Navigation Mobile Menu
function initializeNavigation() {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Fechar menu ao clicar em link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Header transparente no scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    });
}

// Supporters Management
function initializeSupporters() {
    loadSupportersFromAdmin();
    
    // Listen for storage changes
    window.addEventListener('storage', (e) => {
        if (e.key === 'adminSupporters') {
            loadSupportersFromAdmin();
        }
    });
    
    // Listen for messages from admin panel
    window.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'updateSupporters') {
            loadSupportersFromAdmin();
        }
    });
}

window.loadSupportersFromAdmin = function() {
    console.log('Loading supporters from admin...');
    const savedSupporters = localStorage.getItem('adminSupporters');
    console.log('Saved supporters:', savedSupporters);
    
    if (!savedSupporters) {
        console.log('No saved supporters found');
        return;
    }

    try {
        const supporters = JSON.parse(savedSupporters);
        console.log('Parsed supporters:', supporters);
        
        const supportersGrid = document.getElementById('supportersGrid');
        console.log('Supporters grid element:', supportersGrid);
        
        if (!supportersGrid) {
            console.error('Supporters grid not found!');
            return;
        }

        // Hide all supporter items first
        const allSupporterItems = supportersGrid.querySelectorAll('.supporter-item');
        console.log('Found supporter items:', allSupporterItems.length);
        
        allSupporterItems.forEach(item => {
            item.style.display = 'none';
        });

        // Show entire section if there are supporters
        const supportersSection = document.getElementById('apoiadores');
        if (supportersSection && supporters.length > 0) {
            supportersSection.style.display = 'block';
        }

        // Show and update only the saved supporters
        supporters.forEach((supporter, index) => {
            console.log(`Processing supporter ${index + 1}:`, supporter);
            const supporterElement = document.getElementById(`supporter-${index + 1}`);
            console.log(`Supporter element ${index + 1}:`, supporterElement);
            
            if (supporterElement && index < 5) { // Maximum 5 supporters
                supporterElement.style.display = 'block';
                
                const logoContainer = supporterElement.querySelector('.supporter-logo');
                if (logoContainer) {
                    if (supporter.logo) {
                        logoContainer.innerHTML = `
                            <img src="${supporter.logo}" alt="${supporter.name}" style="max-width: 120px; max-height: 60px; object-fit: contain;">
                            <span>${supporter.name}</span>
                        `;
                    } else {
                        logoContainer.innerHTML = `
                            <i class="fas fa-handshake"></i>
                            <span>${supporter.name}</span>
                        `;
                    }
                }

                // Remove old click handlers
                supporterElement.onclick = null;
                supporterElement.style.cursor = 'default';

                // Add click handler if URL exists
                if (supporter.url) {
                    supporterElement.style.cursor = 'pointer';
                    supporterElement.onclick = () => {
                        window.open(supporter.url, '_blank');
                    };
                }
            }
        });

        // If no supporters, hide the entire section
        if (supporters.length === 0) {
            if (supportersSection) {
                supportersSection.style.display = 'none';
            }
        }
        
        console.log('Supporters loaded successfully');
    } catch (error) {
        console.error('Erro ao carregar apoiadores:', error);
    }
}

// Smooth Scroll
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Main Gallery (integrated with Admin Panel)
let mainGalleryInstance = null;

function initializeMainGallery() {
    mainGalleryInstance = new MainGallery();
}

class MainGallery {
    constructor() {
        this.currentFilter = 'all';
        this.currentView = 'grid';
        this.currentPage = 1;
        this.photosPerPage = 12;
        this.searchQuery = '';
        this.adminData = [];
        this.filteredData = [];
        this.init();
    }

    init() {
        this.loadAdminData();
        this.loadGallerySettings();
        this.renderMainGallery();
        this.bindEvents();
    }

    loadAdminData() {
        // Load photos from admin panel localStorage
        const savedPortfolio = localStorage.getItem('adminPortfolioData');
        // Use admin data only if it exists and is not an empty array
        if (savedPortfolio && JSON.parse(savedPortfolio).length > 0) {
            this.adminData = JSON.parse(savedPortfolio);
        } else if (typeof PortfolioData !== 'undefined' && PortfolioData.photos) {
            // Fallback to default data from portfolio-data.js if no admin data exists
            // We need to transform the data to match the format the gallery expects
            this.adminData = PortfolioData.photos.map(photo => ({
                id: photo.id,
                title: photo.title,
                category: photo.category,
                description: photo.description,
                image: PortfolioData.getImageUrl(photo, 'medium'), // Use the helper to get a URL
                dateAdded: photo.date
            }));
        } else {
            this.adminData = [];
        }
        this.filteredData = [...this.adminData];
    }

    loadGallerySettings() {
        // Load gallery settings from admin panel
        const savedSettings = localStorage.getItem('adminSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            // Update gallery title and subtitle if set in admin
            const titleElement = document.getElementById('galleryMainTitle');
            const subtitleElement = document.getElementById('galleryMainSubtitle');
            
            if (settings.galleryTitle && titleElement) {
                titleElement.textContent = settings.galleryTitle;
            }
            if (settings.gallerySubtitle && subtitleElement) {
                subtitleElement.textContent = settings.gallerySubtitle;
            }
        }
    }

    bindEvents() {
        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleFilterClick(btn));
        });

        // View toggle buttons
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleViewToggle(btn));
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
        
        if (clearSearch) {
            clearSearch.addEventListener('click', () => this.clearSearch());
        }

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreMainGallery');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMorePhotos());
        }

        // Listen for admin data updates
        window.addEventListener('storage', (e) => {
            if (e.key === 'adminPortfolioData') {
                this.loadAdminData();
                this.renderMainGallery();
            } else if (e.key === 'adminSettings') {
                this.loadGallerySettings();
            }
        });

        // Listen for gallery settings updates from admin panel
        window.addEventListener('gallerySettingsUpdated', (e) => {
            const { galleryTitle, gallerySubtitle } = e.detail;
            const titleElement = document.getElementById('galleryMainTitle');
            const subtitleElement = document.getElementById('galleryMainSubtitle');
            
            if (titleElement && galleryTitle) {
                titleElement.textContent = galleryTitle;
            }
            if (subtitleElement && gallerySubtitle) {
                subtitleElement.textContent = gallerySubtitle;
            }
        });
    }

    handleFilterClick(btn) {
        const newFilter = btn.dataset.filter;

        if (btn.classList.contains('active')) {
            // If clicking active filter, deactivate it and show all
            btn.classList.remove('active');
            this.currentFilter = 'all';
        } else {
            // Deactivate others and activate this one
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.currentFilter = newFilter;
        }

        this.currentPage = 1;
        this.applyFilters();
        this.renderMainGallery();
    }

    handleViewToggle(btn) {
        // Remove active class from all view buttons
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Set new view
        this.currentView = btn.dataset.view;

        // Apply view change
        this.applyViewChange();
    }

    handleSearch(query) {
        this.searchQuery = query.toLowerCase();
        const clearBtn = document.getElementById('clearSearch');
        
        if (clearBtn) {
            clearBtn.style.display = query.length > 0 ? 'block' : 'none';
        }

        this.currentPage = 1;
        this.applyFilters();
        this.renderMainGallery();
    }

    clearSearch() {
        const searchInput = document.getElementById('searchInput');
        const clearBtn = document.getElementById('clearSearch');
        
        if (searchInput) searchInput.value = '';
        if (clearBtn) clearBtn.style.display = 'none';
        
        this.searchQuery = '';
        this.currentPage = 1;
        this.applyFilters();
        this.renderMainGallery();
    }

    applyFilters() {
        this.filteredData = this.adminData.filter(photo => {
            // Category filter
            const categoryMatch = this.currentFilter === 'all' || photo.category === this.currentFilter;
            
            // Search filter
            const searchMatch = !this.searchQuery || 
                photo.title.toLowerCase().includes(this.searchQuery) ||
                photo.description.toLowerCase().includes(this.searchQuery);

            return categoryMatch && searchMatch;
        });
    }

    applyViewChange() {
        const galleryGrid = document.getElementById('mainGalleryGrid');
        if (!galleryGrid) return;

        // Remove existing view classes
        galleryGrid.classList.remove('grid', 'masonry');
        
        // Add new view class
        galleryGrid.classList.add(this.currentView);

        // Re-render for masonry layout
        if (this.currentView === 'masonry') {
            this.renderMainGallery();
        }
    }

    renderMainGallery() {
        const galleryGrid = document.getElementById('mainGalleryGrid');
        if (!galleryGrid) return;

        this.applyFilters();
        galleryGrid.innerHTML = '';

        // Calculate photos to show
        const startIndex = 0;
        const endIndex = this.currentPage * this.photosPerPage;
        const photosToShow = this.filteredData.slice(startIndex, endIndex);

        photosToShow.forEach(item => {
            const galleryItem = this.createMainGalleryItem(item);
            galleryGrid.appendChild(galleryItem);
        });

        this.updateLoadMoreButton();
    }

    createMainGalleryItem(item) {
        const div = document.createElement('div');
        div.className = 'main-gallery-item';
        
        // Use real image URL if available, otherwise fallback to placeholder
        const imageUrl = item.image || `https://picsum.photos/400/300?random=${item.id}`;
        
        div.innerHTML = `
            <img src="${imageUrl}" alt="${item.title}" loading="lazy">
            <div class="main-gallery-overlay">
                <div class="main-gallery-info">
                    <div class="main-gallery-meta">
                        <span class="main-gallery-category">${this.getCategoryLabel(item.category)}</span>
                        <span class="main-gallery-date">${this.formatDate(item.dateAdded)}</span>
                    </div>
                    <h3 class="main-gallery-title">${item.title}</h3>
                    <p class="main-gallery-description">${item.description}</p>
                </div>
            </div>
        `;
        
        // Add click event to open lightbox
        div.addEventListener('click', () => {
            this.openLightbox(item);
            // Track photo view
            if (typeof trackPortfolioView === 'function') {
                trackPortfolioView(item.title);
            }
        });
        
        return div;
    }

    getCategoryLabel(category) {
        const labels = {
            'futebol': 'Futebol',
            'basquete': 'Basquete',
            'volei': 'Vôlei',
            'natacao': 'Natação',
            'tenis': 'Tênis',
            'corrida': 'Corrida'
        };
        return labels[category] || category;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMoreMainGallery');
        const showingCount = document.getElementById('showingMainCount');
        const totalCount = document.getElementById('totalMainCount');

        const showing = Math.min(this.currentPage * this.photosPerPage, this.filteredData.length);
        const total = this.filteredData.length;

        if (showingCount) showingCount.textContent = showing;
        if (totalCount) totalCount.textContent = total;

        if (loadMoreBtn) {
            loadMoreBtn.style.display = showing < total ? 'flex' : 'none';
        }
    }

    loadMorePhotos() {
        this.currentPage++;
        this.renderMainGallery();
    }

    openLightbox(item) {
        // Use existing lightbox functionality
        const imageUrl = item.image || `https://picsum.photos/800/600?random=${item.id}`;
        
        if (lightboxImage) lightboxImage.src = imageUrl;
        if (lightboxImage) lightboxImage.alt = item.title;
        if (lightboxTitle) lightboxTitle.textContent = item.title;
        if (lightboxDescription) lightboxDescription.textContent = item.description;
        
        if (lightbox) {
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }
}

function renderPortfolio(filter) {
    portfolioGrid.innerHTML = '';
    
    const portfolioData = PortfolioData.photos;
    const filteredData = filter === 'all' 
        ? portfolioData 
        : portfolioData.filter(item => item.category === filter);
    
    filteredData.forEach(item => {
        const portfolioItem = createPortfolioItem(item);
        portfolioGrid.appendChild(portfolioItem);
    });
    
    // Adicionar animação de entrada
    setTimeout(() => {
        document.querySelectorAll('.portfolio-item').forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                item.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100 * index);
            }, 10);
        });
    }, 10);
}

function createPortfolioItem(item) {
    const div = document.createElement('div');
    div.className = 'portfolio-item';
    div.setAttribute('data-category', item.category);
    
    // Usar configurações do SiteConfig se disponível
    const categories = (typeof SiteConfig !== 'undefined') ? SiteConfig.categories : {
        futebol: { icon: '⚽', gradient: 'linear-gradient(135deg, #e63946, #f77f00)' },
        basquete: { icon: '🏀', gradient: 'linear-gradient(135deg, #f4a261, #e76f51)' },
        volei: { icon: '🏐', gradient: 'linear-gradient(135deg, #2a9d8f, #264653)' },
        natacao: { icon: '🏊‍♂️', gradient: 'linear-gradient(135deg, #457b9d, #1d3557)' },
        tenis: { icon: '🎾', gradient: 'linear-gradient(135deg, #28a745, #20c997)' },
        corrida: { icon: '🏃‍♂️', gradient: 'linear-gradient(135deg, #fd7e14, #e83e8c)' }
    };
    
    const categoryConfig = categories[item.category] || categories.futebol;
    div.style.background = categoryConfig.gradient;
    
    // Usar imagem real se disponível
    const imageUrl = PortfolioData.getImageUrl(item, 'medium');
    const hasRealImage = PortfolioData.config.useRealImages;
    
    div.innerHTML = hasRealImage ? `
        <img src="${imageUrl}" alt="${item.alt || item.title}" class="portfolio-image" loading="lazy">
        <div class="portfolio-overlay"></div>
        <div class="portfolio-content">
            <h3 class="portfolio-title">${item.title}</h3>
            <p class="portfolio-category">${item.category}</p>
            <p class="portfolio-date">${item.date}</p>
        </div>
    ` : `
        <div class="portfolio-placeholder">
            <div class="portfolio-icon">${categoryConfig.icon}</div>
        </div>
        <div class="portfolio-content">
            <h3 class="portfolio-title">${item.title}</h3>
            <p class="portfolio-category">${item.category}</p>
        </div>
    `;
    
    // Adicionar evento de clique para lightbox
    div.addEventListener('click', () => {
        openLightbox(item);
        // Track portfolio view
        if (typeof trackPortfolioView === 'function') {
            trackPortfolioView(item.title);
        }
    });
    
    return div;
}

function openLightbox(item) {
    // Usar imagem real ou placeholder
    const imageUrl = PortfolioData.getImageUrl(item, 'large');
    
    lightboxImage.src = imageUrl;
    lightboxImage.alt = item.alt || item.title;
    lightboxTitle.textContent = item.title;
    
    // Mostrar informações detalhadas
    const detailedInfo = `
        ${item.description}
        ${item.location ? `<br><strong>Local:</strong> ${item.location}` : ''}
        ${item.camera ? `<br><strong>Equipamento:</strong> ${item.camera}` : ''}
        ${item.settings ? `<br><strong>Configurações:</strong> ${item.settings}` : ''}
    `;
    lightboxDescription.innerHTML = detailedInfo;
    
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Animação de entrada
    lightbox.style.opacity = '0';
    setTimeout(() => {
        lightbox.style.opacity = '1';
    }, 10);
}

function closeLightbox() {
    lightbox.style.opacity = '0';
    setTimeout(() => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Event listeners para lightbox
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'block') {
        closeLightbox();
    }
});

// Animações de entrada
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Aplicar animação a elementos específicos
    const animatedElements = document.querySelectorAll(
        '.detail-item, .contact-item, .stat'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease';
        observer.observe(el);
    });
}

// Formulário de contato
function initializeForm() {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Mostrar loading
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitButton.disabled = true;
        
        // Enviar formulário via EmailJS
        try {
            const formData = new FormData(contactForm);
            
            // Check if EmailJS is available, otherwise use simulation
            if (typeof emailjs !== 'undefined') {
                await submitContactForm(formData);
            } else {
                console.log('EmailJS not available, using simulation');
                await simulateFormSubmission();
            }
            
            // Track form submission
            if (typeof trackFormSubmission === 'function') {
                trackFormSubmission('Contact Form');
            }
            
            // Sucesso
            showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            contactForm.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            // Erro
            showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
        } finally {
            // Restaurar botão
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}

async function submitContactForm(formData) {
    // EmailJS configuration
    const serviceID = 'YOUR_SERVICE_ID'; // Substituir pelo seu Service ID do EmailJS
    const templateID = 'YOUR_TEMPLATE_ID'; // Substituir pelo seu Template ID do EmailJS
    
    // Prepare template parameters
    const templateParams = {
        from_name: formData.get('nome'),
        from_email: formData.get('email'),
        phone: formData.get('telefone') || 'Não informado',
        project_type: formData.get('tipo-projeto'),
        event_date: formData.get('data-evento') || 'Não informado',
        message: formData.get('mensagem'),
        newsletter: formData.get('newsletter') ? 'Sim' : 'Não',
        to_name: 'Carvalho Sports Photography'
    };
    
    try {
        // Send email using EmailJS
        const result = await emailjs.send(serviceID, templateID, templateParams);
        console.log('Email sent successfully:', result);
        return result;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw error;
    }
}

// Fallback function for testing
async function simulateFormSubmission() {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });
}

function showNotification(message, type) {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#22c55e' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Adicionar CSS para animações de notificação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Typing effect para o hero
function initializeTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Iniciar depois de um pequeno delay
    setTimeout(typeWriter, 1000);
}

// Parallax effect para hero
function initializeParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Counter animation para estatísticas
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/\D/g, ''));
                const suffix = counter.textContent.replace(/\d/g, '');
                
                animateCounter(counter, target, suffix);
                observer.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target, suffix) {
    let current = 0;
    const increment = target / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 20);
}

// Inicializar efeitos adicionais quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    initializeTypingEffect();
    initializeParallax();
    initializeCounters();
});

// Lazy loading otimizado para imagens
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Preload da imagem
                const imageLoader = new Image();
                imageLoader.onload = () => {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    img.classList.remove('lazy');
                };
                imageLoader.src = img.dataset.src;
                
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px', // Carrega 50px antes de aparecer
        threshold: 0.1
    });
    
    images.forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
    });
}

// Performance optimization
function optimizePerformance() {
    // Debounce scroll events
    let ticking = false;
    
    function updateOnScroll() {
        // Scroll effects aqui
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
}

// Função específica para otimizações de performance
function initializePerformanceOptimizations() {
    // Preload de recursos críticos
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = resource;
        document.head.appendChild(link);
    });
    
    // Otimização de scroll
    let ticking = false;
    function updateOnScroll() {
        // Header background baseado no scroll
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
    
    // Preload de imagens do portfolio
    setTimeout(() => {
        const portfolioData = PortfolioData.photos;
        portfolioData.slice(0, 6).forEach(item => {
            const img = new Image();
            img.src = PortfolioData.getImageUrl(item, 'medium');
        });
    }, 2000);
}

// Inicializar otimizações
document.addEventListener('DOMContentLoaded', function() {
    initializeLazyLoading();
    optimizePerformance();
});