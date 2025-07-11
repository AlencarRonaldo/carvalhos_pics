// Test Gallery - Script simples para debug
console.log('test-gallery.js carregado');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, iniciando galeria de teste...');
    
    // Dados de teste simples
    const testPhotos = [
        {
            id: 1,
            title: "Final do Campeonato",
            category: "futebol",
            description: "Momento decisivo da final do campeonato estadual",
            image: "https://picsum.photos/400/300?random=1",
            dateAdded: "2024-01-15"
        },
        {
            id: 2,
            title: "Enterrada Espetacular",
            category: "basquete",
            description: "Lance épico durante partida do NBB",
            image: "https://picsum.photos/400/300?random=2",
            dateAdded: "2024-01-14"
        },
        {
            id: 3,
            title: "Ataque Potente",
            category: "volei",
            description: "Cortada devastadora que fechou o set",
            image: "https://picsum.photos/400/300?random=3",
            dateAdded: "2024-01-13"
        }
    ];
    
    // Encontrar o container da galeria
    const galleryGrid = document.getElementById('mainGalleryGrid');
    console.log('galleryGrid encontrado:', !!galleryGrid);
    
    if (galleryGrid) {
        console.log('Renderizando fotos de teste...');
        
        // Limpar grid
        galleryGrid.innerHTML = '';
        
        // Adicionar fotos de teste
        testPhotos.forEach(photo => {
            const photoElement = document.createElement('div');
            photoElement.className = 'main-gallery-item';
            photoElement.innerHTML = `
                <img src="${photo.image}" alt="${photo.title}" loading="lazy">
                <div class="main-gallery-overlay">
                    <div class="main-gallery-info">
                        <div class="main-gallery-meta">
                            <span class="main-gallery-category">${photo.category}</span>
                            <span class="main-gallery-date">${photo.dateAdded}</span>
                        </div>
                        <h3 class="main-gallery-title">${photo.title}</h3>
                        <p class="main-gallery-description">${photo.description}</p>
                    </div>
                </div>
            `;
            
            galleryGrid.appendChild(photoElement);
        });
        
        console.log('Fotos adicionadas:', testPhotos.length);
        
        // Atualizar contadores
        const countElements = ['count-all', 'count-futebol', 'count-basquete', 'count-volei'];
        countElements.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = id === 'count-all' ? testPhotos.length : 1;
            }
        });
        
        // Atualizar contador de fotos mostradas
        const showingCount = document.getElementById('showingMainCount');
        const totalCount = document.getElementById('totalMainCount');
        if (showingCount) showingCount.textContent = testPhotos.length;
        if (totalCount) totalCount.textContent = testPhotos.length;
        
    } else {
        console.error('Element mainGalleryGrid não encontrado!');
        
        // Criar uma mensagem de debug
        const debugDiv = document.createElement('div');
        debugDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff0000;
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 9999;
            font-family: Arial;
        `;
        debugDiv.innerHTML = `
            <h3>GALERIA DEBUG</h3>
            <p>Element #mainGalleryGrid não encontrado!</p>
            <p>Verifique se o HTML está correto.</p>
        `;
        document.body.appendChild(debugDiv);
    }
});