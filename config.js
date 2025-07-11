// Configurações do Site - Carvalho Sports Photography

const SiteConfig = {
    // Google Analytics
    analytics: {
        measurementId: 'GA_MEASUREMENT_ID', // Substituir pelo seu ID do Google Analytics
        enabled: true
    },
    
    // EmailJS Configuration
    email: {
        publicKey: 'YOUR_PUBLIC_KEY',      // Sua chave pública do EmailJS
        serviceId: 'YOUR_SERVICE_ID',      // Seu Service ID do EmailJS  
        templateId: 'YOUR_TEMPLATE_ID',    // Seu Template ID do EmailJS
        enabled: true
    },
    
    // Site Information
    site: {
        name: 'Carvalho Sports Photography',
        description: 'Especialista em fotografia esportiva profissional',
        url: 'https://carvalhosports.com',
        email: 'contato@carvalhosports.com',
        phone: '(11) 99999-9999',
        location: 'São Paulo, SP'
    },
    
    // Social Media
    social: {
        instagram: 'https://instagram.com/carvalhosports',
        facebook: 'https://facebook.com/carvalhosports',
        linkedin: 'https://linkedin.com/in/carvalho-photographer',
        youtube: 'https://youtube.com/c/carvalhosports'
    },
    
    // Portfolio Categories
    categories: {
        futebol: {
            name: 'Futebol',
            icon: '⚽',
            gradient: 'linear-gradient(135deg, #e63946, #f77f00)'
        },
        basquete: {
            name: 'Basquete', 
            icon: '🏀',
            gradient: 'linear-gradient(135deg, #f4a261, #e76f51)'
        },
        volei: {
            name: 'Vôlei',
            icon: '🏐', 
            gradient: 'linear-gradient(135deg, #2a9d8f, #264653)'
        },
        natacao: {
            name: 'Natação',
            icon: '🏊‍♂️',
            gradient: 'linear-gradient(135deg, #457b9d, #1d3557)'
        },
        tenis: {
            name: 'Tênis',
            icon: '🎾',
            gradient: 'linear-gradient(135deg, #28a745, #20c997)'
        },
        corrida: {
            name: 'Corrida',
            icon: '🏃‍♂️',
            gradient: 'linear-gradient(135deg, #fd7e14, #e83e8c)'
        }
    },
    
    // Admin Panel
    admin: {
        username: 'admin',
        password: 'carvalho123', // ALTERAR em produção!
        sessionTimeout: 3600000 // 1 hora em milliseconds
    },
    
    // Features
    features: {
        lightbox: true,
        lazyLoading: true,
        animations: true,
        contactForm: true,
        newsletter: true,
        analytics: true
    }
};

// Template de email para EmailJS
const EmailTemplate = {
    subject: 'Nova mensagem do site - {{from_name}}',
    body: `
    Nova mensagem recebida através do site:
    
    Nome: {{from_name}}
    Email: {{from_email}}
    Telefone: {{phone}}
    Tipo de Projeto: {{project_type}}
    Data do Evento: {{event_date}}
    Newsletter: {{newsletter}}
    
    Mensagem:
    {{message}}
    
    ---
    Enviado através do site Carvalho Sports Photography
    `
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SiteConfig, EmailTemplate };
}