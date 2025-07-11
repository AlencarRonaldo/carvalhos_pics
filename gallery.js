// Gallery JavaScript
class PhotoGallery {
    constructor() {
        this.photos = [];
        this.filteredPhotos = [];
        this.currentPage = 1;
        this.photosPerPage = 20;
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.currentView = 'grid';
        this.currentLightboxIndex = 0;
        this.searchQuery = '';
        
        this.init();
    }

    init() {
        this.loadPhotos();
        this.bindEvents();
        this.setupIntersectionObserver();
        this.initializeGallery();
    }

    loadPhotos() {
        // Load photos from gallery-data.js
        if (typeof galleryPhotos !== 'undefined') {
            this.photos = galleryPhotos;
            this.filteredPhotos = [...this.photos];
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

        // Sort functionality
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => this.handleSort(e.target.value));
        }

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMorePhotos());
        }

        // Lightbox events
        this.bindLightboxEvents();

        // Window resize
        window.addEventListener('resize', () => this.handleResize());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
    }

    bindLightboxEvents() {
        // Close lightbox
        const closeLightbox = document.getElementById('closeLightbox');
        if (closeLightbox) {
            closeLightbox.addEventListener('click', () => this.closeLightbox());
        }

        // Navigation
        const prevPhoto = document.getElementById('prevPhoto');
        const nextPhoto = document.getElementById('nextPhoto');
        
        if (prevPhoto) {
            prevPhoto.addEventListener('click', () => this.showPreviousPhoto());
        }
        
        if (nextPhoto) {
            nextPhoto.addEventListener('click', () => this.showNextPhoto());
        }

        // Lightbox actions
        const shareBtn = document.getElementById('shareBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const favoriteBtn = document.getElementById('favoriteBtn');
        const fullscreenBtn = document.getElementById('fullscreenBtn');

        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.showShareModal());
        }
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadPhoto());
        }
        
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', () => this.toggleFavorite());
        }
        
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }

        // Info panel toggle
        const photoInfoPanel = document.getElementById('photoInfoPanel');
        if (photoInfoPanel) {
            const infoToggleBtn = document.createElement('button');
            infoToggleBtn.innerHTML = '<i class="fas fa-info-circle"></i>';
            infoToggleBtn.className = 'lightbox-btn info-toggle';
            infoToggleBtn.title = 'Informações da Foto';
            infoToggleBtn.addEventListener('click', () => this.toggleInfoPanel());
            
            const lightboxActions = document.querySelector('.lightbox-actions');
            if (lightboxActions) {
                lightboxActions.insertBefore(infoToggleBtn, shareBtn);
            }
        }

        // Share modal
        this.bindShareModalEvents();

        // Close lightbox on background click
        const lightbox = document.getElementById('advancedLightbox');
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    this.closeLightbox();
                }
            });
        }
    }

    bindShareModalEvents() {
        const shareModal = document.getElementById('shareModal');
        const modalClose = shareModal?.querySelector('.modal-close');
        const shareBtns = shareModal?.querySelectorAll('.share-btn');

        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeShareModal());
        }

        if (shareBtns) {
            shareBtns.forEach(btn => {
                btn.addEventListener('click', () => this.handleShare(btn.dataset.platform));
            });
        }

        if (shareModal) {
            shareModal.addEventListener('click', (e) => {
                if (e.target === shareModal) {
                    this.closeShareModal();
                }
            });
        }
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        this.observer.unobserve(img);
                    }
                }
            });
        });
    }

    initializeGallery() {
        this.updateFilterCounts();
        this.renderPhotos();
        this.updateStats();
    }

    handleFilterClick(btn) {
        // Remove active class from all filter buttons
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Set new filter
        this.currentFilter = btn.dataset.filter;
        this.currentPage = 1;

        // Apply filter and render
        this.applyFilters();
        this.renderPhotos();
        this.updateStats();
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
        this.renderPhotos();
        this.updateStats();
    }

    clearSearch() {
        const searchInput = document.getElementById('searchInput');
        const clearBtn = document.getElementById('clearSearch');
        
        if (searchInput) searchInput.value = '';
        if (clearBtn) clearBtn.style.display = 'none';
        
        this.searchQuery = '';
        this.currentPage = 1;
        this.applyFilters();
        this.renderPhotos();
        this.updateStats();
    }

    handleSort(sortBy) {
        this.currentSort = sortBy;
        this.applySorting();
        this.renderPhotos();
    }

    applyFilters() {
        this.filteredPhotos = this.photos.filter(photo => {
            // Category filter
            const categoryMatch = this.currentFilter === 'all' || photo.category === this.currentFilter;
            
            // Search filter
            const searchMatch = !this.searchQuery || 
                photo.title.toLowerCase().includes(this.searchQuery) ||
                photo.description.toLowerCase().includes(this.searchQuery) ||
                photo.location.toLowerCase().includes(this.searchQuery) ||
                photo.event.toLowerCase().includes(this.searchQuery);

            return categoryMatch && searchMatch;
        });

        this.applySorting();
    }

    applySorting() {
        this.filteredPhotos.sort((a, b) => {
            switch (this.currentSort) {
                case 'newest':
                    return new Date(b.date) - new Date(a.date);
                case 'oldest':
                    return new Date(a.date) - new Date(b.date);
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'category':
                    return a.category.localeCompare(b.category);
                case 'featured':
                    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
                default:
                    return 0;
            }
        });
    }

    applyViewChange() {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) return;

        // Remove existing view classes
        galleryGrid.classList.remove('grid', 'masonry', 'list');
        
        // Add new view class
        galleryGrid.classList.add(this.currentView);

        // Re-render for masonry layout
        if (this.currentView === 'masonry') {
            this.renderPhotos();
        }
    }

    renderPhotos() {
        const galleryGrid = document.getElementById('galleryGrid');
        if (!galleryGrid) return;

        // Clear existing photos
        galleryGrid.innerHTML = '';

        // Calculate photos to show
        const startIndex = 0;
        const endIndex = this.currentPage * this.photosPerPage;
        const photosToShow = this.filteredPhotos.slice(startIndex, endIndex);

        // Render photos
        photosToShow.forEach((photo, index) => {
            const photoElement = this.createPhotoElement(photo, index);
            galleryGrid.appendChild(photoElement);
        });

        // Update load more button
        this.updateLoadMoreButton();

        // Initialize lazy loading for images
        this.initLazyLoading();
    }

    createPhotoElement(photo, index) {
        const photoItem = document.createElement('div');
        photoItem.className = 'gallery-item';
        photoItem.dataset.index = index;

        photoItem.innerHTML = `
            <img class="gallery-item-image" 
                 data-src="${photo.image}" 
                 alt="${photo.title}"
                 loading="lazy">
            
            <div class="gallery-item-overlay">
                <div class="gallery-item-info">
                    <div class="gallery-item-meta">
                        <span class="gallery-item-category">${this.getCategoryLabel(photo.category)}</span>
                        <span class="gallery-item-date">${this.formatDate(photo.date)}</span>
                    </div>
                    <h3 class="gallery-item-title">${photo.title}</h3>
                    <p class="gallery-item-description">${photo.description}</p>
                </div>
            </div>

            ${photo.featured ? '<div class="gallery-item-featured">Destaque</div>' : ''}
            
            <div class="gallery-item-tags">
                ${photo.tags.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;

        // Add click event to open lightbox
        photoItem.addEventListener('click', () => this.openLightbox(this.filteredPhotos.indexOf(photo)));

        return photoItem;
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

    initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            this.observer.observe(img);
        });
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const showingCount = document.getElementById('showingCount');
        const totalCount = document.getElementById('totalCount');

        const showing = Math.min(this.currentPage * this.photosPerPage, this.filteredPhotos.length);
        const total = this.filteredPhotos.length;

        if (showingCount) showingCount.textContent = showing;
        if (totalCount) totalCount.textContent = total;

        if (loadMoreBtn) {
            loadMoreBtn.style.display = showing < total ? 'flex' : 'none';
        }
    }

    loadMorePhotos() {
        this.currentPage++;
        this.renderPhotos();
        
        // Smooth scroll to new content
        const newPhotos = document.querySelectorAll('.gallery-item');
        if (newPhotos.length > 0) {
            const lastNewPhoto = newPhotos[Math.min((this.currentPage - 1) * this.photosPerPage, newPhotos.length - 1)];
            lastNewPhoto.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    updateFilterCounts() {
        const categories = ['all', 'futebol', 'basquete', 'volei', 'natacao', 'tenis', 'corrida'];
        
        categories.forEach(category => {
            const count = category === 'all' 
                ? this.photos.length 
                : this.photos.filter(photo => photo.category === category).length;
                
            const countElement = document.getElementById(`count-${category}`);
            if (countElement) {
                countElement.textContent = count;
            }
        });
    }

    updateStats() {
        const totalPhotos = document.getElementById('totalPhotos');
        if (totalPhotos) {
            totalPhotos.textContent = this.photos.length + '+';
        }
    }

    // Lightbox Methods
    openLightbox(index) {
        this.currentLightboxIndex = index;
        const lightbox = document.getElementById('advancedLightbox');
        const photo = this.filteredPhotos[index];

        if (!lightbox || !photo) return;

        // Show lightbox
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Load photo
        this.loadLightboxPhoto(photo);
        this.updateLightboxInfo(photo);
        this.updateLightboxCounter();
        this.generateThumbnails();

        // Track view event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'photo_view', {
                'photo_id': photo.id,
                'photo_title': photo.title,
                'photo_category': photo.category
            });
        }
    }

    closeLightbox() {
        const lightbox = document.getElementById('advancedLightbox');
        if (lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        }

        // Close info panel if open
        const infoPanel = document.getElementById('photoInfoPanel');
        if (infoPanel) {
            infoPanel.classList.remove('active');
        }
    }

    loadLightboxPhoto(photo) {
        const lightboxImage = document.getElementById('lightboxImage');
        const loadingIndicator = document.querySelector('.lightbox-loading');

        if (!lightboxImage) return;

        // Show loading
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }

        // Load image
        lightboxImage.onload = () => {
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        };

        lightboxImage.src = photo.image;
        lightboxImage.alt = photo.title;
    }

    updateLightboxInfo(photo) {
        // Update photo details
        const photoTitle = document.getElementById('photoTitle');
        const photoDescription = document.getElementById('photoDescription');
        const photoDate = document.getElementById('photoDate');
        const photoLocation = document.getElementById('photoLocation');
        const photoCamera = document.getElementById('photoCamera');
        const photoSettings = document.getElementById('photoSettings');
        const photoTags = document.getElementById('photoTags');

        if (photoTitle) photoTitle.textContent = photo.title;
        if (photoDescription) photoDescription.textContent = photo.description;
        if (photoDate) photoDate.textContent = this.formatDate(photo.date);
        if (photoLocation) photoLocation.textContent = photo.location;
        if (photoCamera) photoCamera.textContent = photo.camera;
        if (photoSettings) photoSettings.textContent = photo.settings;

        if (photoTags) {
            photoTags.innerHTML = photo.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        }
    }

    updateLightboxCounter() {
        const currentIndex = document.getElementById('currentPhotoIndex');
        const totalPhotos = document.getElementById('totalPhotosCount');

        if (currentIndex) currentIndex.textContent = this.currentLightboxIndex + 1;
        if (totalPhotos) totalPhotos.textContent = this.filteredPhotos.length;
    }

    generateThumbnails() {
        const thumbnailsStrip = document.getElementById('thumbnailsStrip');
        if (!thumbnailsStrip) return;

        thumbnailsStrip.innerHTML = '';

        // Generate thumbnails for current filtered photos
        this.filteredPhotos.forEach((photo, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail-item';
            if (index === this.currentLightboxIndex) {
                thumbnail.classList.add('active');
            }

            thumbnail.innerHTML = `<img src="${photo.image}" alt="${photo.title}">`;
            
            thumbnail.addEventListener('click', () => {
                this.currentLightboxIndex = index;
                this.loadLightboxPhoto(photo);
                this.updateLightboxInfo(photo);
                this.updateLightboxCounter();
                this.updateThumbnailsActive();
            });

            thumbnailsStrip.appendChild(thumbnail);
        });
    }

    updateThumbnailsActive() {
        const thumbnails = document.querySelectorAll('.thumbnail-item');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentLightboxIndex);
        });
    }

    showPreviousPhoto() {
        if (this.currentLightboxIndex > 0) {
            this.currentLightboxIndex--;
            const photo = this.filteredPhotos[this.currentLightboxIndex];
            this.loadLightboxPhoto(photo);
            this.updateLightboxInfo(photo);
            this.updateLightboxCounter();
            this.updateThumbnailsActive();
        }
    }

    showNextPhoto() {
        if (this.currentLightboxIndex < this.filteredPhotos.length - 1) {
            this.currentLightboxIndex++;
            const photo = this.filteredPhotos[this.currentLightboxIndex];
            this.loadLightboxPhoto(photo);
            this.updateLightboxInfo(photo);
            this.updateLightboxCounter();
            this.updateThumbnailsActive();
        }
    }

    toggleInfoPanel() {
        const infoPanel = document.getElementById('photoInfoPanel');
        if (infoPanel) {
            infoPanel.classList.toggle('active');
        }
    }

    showShareModal() {
        const shareModal = document.getElementById('shareModal');
        if (shareModal) {
            shareModal.style.display = 'block';
        }
    }

    closeShareModal() {
        const shareModal = document.getElementById('shareModal');
        if (shareModal) {
            shareModal.style.display = 'none';
        }
    }

    handleShare(platform) {
        const photo = this.filteredPhotos[this.currentLightboxIndex];
        const url = window.location.href;
        const text = `Confira esta foto incrível: ${photo.title}`;

        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
                break;
            case 'copy':
                navigator.clipboard.writeText(url).then(() => {
                    this.showNotification('Link copiado para a área de transferência!');
                });
                this.closeShareModal();
                return;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }

        this.closeShareModal();
    }

    downloadPhoto() {
        const photo = this.filteredPhotos[this.currentLightboxIndex];
        const link = document.createElement('a');
        link.href = photo.image;
        link.download = `${photo.title}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showNotification('Download iniciado!');
    }

    toggleFavorite() {
        const favoriteBtn = document.getElementById('favoriteBtn');
        const photo = this.filteredPhotos[this.currentLightboxIndex];
        
        photo.favorited = !photo.favorited;
        
        if (favoriteBtn) {
            const icon = favoriteBtn.querySelector('i');
            if (photo.favorited) {
                icon.className = 'fas fa-heart';
                this.showNotification('Foto adicionada aos favoritos!');
            } else {
                icon.className = 'far fa-heart';
                this.showNotification('Foto removida dos favoritos!');
            }
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            const lightbox = document.getElementById('advancedLightbox');
            if (lightbox && lightbox.requestFullscreen) {
                lightbox.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    handleKeyboardNavigation(e) {
        const lightbox = document.getElementById('advancedLightbox');
        if (lightbox.style.display !== 'block') return;

        switch (e.key) {
            case 'Escape':
                this.closeLightbox();
                break;
            case 'ArrowLeft':
                this.showPreviousPhoto();
                break;
            case 'ArrowRight':
                this.showNextPhoto();
                break;
            case ' ':
                e.preventDefault();
                this.toggleInfoPanel();
                break;
        }
    }

    handleResize() {
        // Adjust masonry layout if needed
        if (this.currentView === 'masonry') {
            this.renderPhotos();
        }
    }

    showNotification(message) {
        // Remove existing notification
        const existing = document.querySelector('.gallery-notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'gallery-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-check-circle"></i>
                ${message}
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PhotoGallery();
});

// Mobile menu toggle (if exists)
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
});