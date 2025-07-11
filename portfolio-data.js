// Portfolio Data - Carvalho Sports Photography
// Este arquivo contém todos os dados do portfolio
// Para adicionar/remover fotos, edite este arquivo

const PortfolioData = {
    // Configuração geral
    config: {
        useRealImages: false, // Alterar para true quando tiver imagens reais
        imagePath: './images/portfolio/', // Caminho base das imagens
        placeholderService: 'https://picsum.photos/', // Serviço de placeholder
        lazyLoading: true
    },

    // Dados das fotos
    photos: [
        {
            id: 1,
            title: "Final do Campeonato",
            category: "futebol",
            description: "Momento decisivo da final do campeonato estadual",
            filename: "futebol/final-campeonato.jpg", // Caminho da imagem real
            placeholder: "800/600?random=1", // Placeholder enquanto não há imagem real
            alt: "Jogador de futebol chutando na final do campeonato",
            featured: true, // Destacar no portfolio
            date: "2024-01-15",
            location: "Estádio do Pacaembu, São Paulo",
            camera: "Canon R5",
            lens: "70-200mm f/2.8",
            settings: "1/1000s, f/2.8, ISO 1600"
        },
        {
            id: 2,
            title: "Enterrada Espetacular",
            category: "basquete",
            description: "Lance épico durante partida do NBB",
            filename: "basquete/enterrada-espetacular.jpg",
            placeholder: "800/600?random=2",
            alt: "Jogador de basquete fazendo enterrada",
            featured: true,
            date: "2024-01-14",
            location: "Ginásio do Ibirapuera, São Paulo",
            camera: "Sony A7R IV",
            lens: "85mm f/1.4",
            settings: "1/800s, f/1.8, ISO 3200"
        },
        {
            id: 3,
            title: "Saque Perfeito",
            category: "volei",
            description: "Precisão e técnica no vôlei feminino",
            filename: "volei/saque-perfeito.jpg",
            placeholder: "800/600?random=3",
            alt: "Jogadora de vôlei sacando",
            featured: false,
            date: "2024-01-13",
            location: "Ginásio Poliesportivo, Santos",
            camera: "Canon R5",
            lens: "400mm f/2.8",
            settings: "1/1250s, f/2.8, ISO 800"
        },
        {
            id: 4,
            title: "Recorde Mundial",
            category: "natacao",
            description: "Momento histórico nas piscinas olímpicas",
            filename: "natacao/recorde-mundial.jpg",
            placeholder: "800/600?random=4",
            alt: "Nadador batendo recorde mundial",
            featured: true,
            date: "2024-01-12",
            location: "Centro Aquático Olímpico, Rio de Janeiro",
            camera: "Sony A7R IV",
            lens: "70-200mm f/2.8",
            settings: "1/640s, f/2.8, ISO 1250"
        },
        {
            id: 5,
            title: "Derby Clássico",
            category: "futebol",
            description: "Emoção pura no maior clássico da cidade",
            filename: "futebol/derby-classico.jpg",
            placeholder: "800/600?random=5",
            alt: "Confronto no clássico de futebol",
            featured: false,
            date: "2024-01-11",
            location: "Arena Corinthians, São Paulo",
            camera: "Canon R5",
            lens: "300mm f/2.8",
            settings: "1/1000s, f/2.8, ISO 2000"
        },
        {
            id: 6,
            title: "Defesa Impossível",
            category: "volei",
            description: "Reflexo e agilidade em quadra",
            filename: "volei/defesa-impossivel.jpg",
            placeholder: "800/600?random=6",
            alt: "Jogador de vôlei fazendo defesa espetacular",
            featured: false,
            date: "2024-01-10",
            location: "Ginásio Mauro Pinheiro, Rio de Janeiro",
            camera: "Sony A7R IV",
            lens: "85mm f/1.4",
            settings: "1/800s, f/1.8, ISO 2500"
        },
        {
            id: 7,
            title: "Liga Nacional",
            category: "basquete",
            description: "Intensidade da liga nacional de basquete",
            filename: "basquete/liga-nacional.jpg",
            placeholder: "800/600?random=7",
            alt: "Ação durante jogo da liga nacional de basquete",
            featured: false,
            date: "2024-01-09",
            location: "Ginásio do Mineirinho, Belo Horizonte",
            camera: "Canon R5",
            lens: "135mm f/2",
            settings: "1/640s, f/2.2, ISO 1600"
        },
        {
            id: 8,
            title: "Tênis Championship",
            category: "tenis",
            description: "Precisão e técnica no saque perfeito",
            filename: "tenis/tenis-championship.jpg",
            placeholder: "800/600?random=8",
            alt: "Tenista sacando durante championship",
            featured: true,
            date: "2024-01-08",
            location: "Complexo Tênis Clube, São Paulo",
            camera: "Sony A7R IV",
            lens: "200mm f/2.8",
            settings: "1/1000s, f/2.8, ISO 640"
        },
        {
            id: 9,
            title: "Corrida de Rua",
            category: "corrida",
            description: "Velocidade e resistência urbana",
            filename: "corrida/corrida-rua.jpg",
            placeholder: "800/600?random=9",
            alt: "Corredores durante prova de rua",
            featured: false,
            date: "2024-01-07",
            location: "Avenida Paulista, São Paulo",
            camera: "Canon R5",
            lens: "24-70mm f/2.8",
            settings: "1/500s, f/4, ISO 400"
        }
    ],

    // Método para obter URL da imagem
    getImageUrl(photo, size = 'medium') {
        const { config } = this;
        
        if (config.useRealImages) {
            // Usar imagens reais
            const sizePath = size === 'thumb' ? 'thumbnails/' : '';
            return `${config.imagePath}${sizePath}${photo.filename}`;
        } else {
            // Usar placeholders
            const dimensions = {
                thumb: '400/300',
                medium: '800/600', 
                large: '1200/800'
            };
            return `${config.placeholderService}${dimensions[size] || dimensions.medium}?random=${photo.id}`;
        }
    },

    // Método para obter fotos por categoria
    getByCategory(category) {
        return this.photos.filter(photo => photo.category === category);
    },

    // Método para obter fotos em destaque
    getFeatured() {
        return this.photos.filter(photo => photo.featured);
    },

    // Método para obter foto por ID
    getById(id) {
        return this.photos.find(photo => photo.id === parseInt(id));
    },

    // Método para adicionar nova foto (para uso no admin)
    addPhoto(photoData) {
        const newId = Math.max(...this.photos.map(p => p.id)) + 1;
        const newPhoto = {
            id: newId,
            ...photoData,
            date: new Date().toISOString().split('T')[0]
        };
        this.photos.unshift(newPhoto);
        return newPhoto;
    },

    // Método para remover foto
    removePhoto(id) {
        const index = this.photos.findIndex(photo => photo.id === parseInt(id));
        if (index > -1) {
            return this.photos.splice(index, 1)[0];
        }
        return null;
    },

    // Método para atualizar foto
    updatePhoto(id, updates) {
        const photo = this.getById(id);
        if (photo) {
            Object.assign(photo, updates);
            return photo;
        }
        return null;
    }
};

// Disponibilizar globalmente
if (typeof window !== 'undefined') {
    window.PortfolioData = PortfolioData;
}

// Export para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioData;
}