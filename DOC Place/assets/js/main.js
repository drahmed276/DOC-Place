// Theme Switcher
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// Update theme icon
function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Language Switcher
const langToggle = document.querySelector('.lang-toggle');
const langText = langToggle.querySelector('.lang-text');

// Check for saved language preference
const savedLang = localStorage.getItem('language') || 'en';
setLanguage(savedLang);

// Language toggle click handler
langToggle.addEventListener('click', () => {
    const currentLang = html.getAttribute('lang');
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
});

// Set language and update UI
function setLanguage(lang) {
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    langText.textContent = lang.toUpperCase();
    
    // Update text content based on language
    updateContent(lang);
}

// Update content based on language
function updateContent(lang) {
    const translations = {
        en: {
            home: 'Home',
            products: 'Products',
            categories: 'Categories',
            about: 'About',
            contact: 'Contact',
            heroTitle: 'Your Trusted Partner for High-Quality Medical Supplies',
            heroDesc: 'Providing healthcare professionals with premium medical accessories and equipment.',
            exploreProducts: 'Explore Products',
            featuredProducts: 'Featured Products',
            productCategories: 'Product Categories',
            aboutTitle: 'About DOC Place',
            aboutDesc: 'We are committed to providing healthcare professionals with the highest quality medical supplies and accessories.',
            contactUs: 'Contact Us',
            yourName: 'Your Name',
            yourEmail: 'Your Email',
            yourMessage: 'Your Message',
            sendMessage: 'Send Message',
            privacyPolicy: 'Privacy Policy',
            termsOfService: 'Terms of Service',
            rightsReserved: 'All rights reserved.'
        },
        ar: {
            home: 'الرئيسية',
            products: 'المنتجات',
            categories: 'التصنيفات',
            about: 'من نحن',
            contact: 'اتصل بنا',
            heroTitle: 'شريكك الموثوق لتوريدات طبية عالية الجودة',
            heroDesc: 'نقدم للمهنيين الصحيين أفضل الملحقات والمعدات الطبية.',
            exploreProducts: 'تصفح المنتجات',
            featuredProducts: 'المنتجات المميزة',
            productCategories: 'تصنيفات المنتجات',
            aboutTitle: 'عن دوك بليس',
            aboutDesc: 'نحن ملتزمون بتقديم أفضل جودة من المستلزمات والملحقات الطبية للمهنيين الصحيين.',
            contactUs: 'اتصل بنا',
            yourName: 'اسمك',
            yourEmail: 'بريدك الإلكتروني',
            yourMessage: 'رسالتك',
            sendMessage: 'إرسال الرسالة',
            privacyPolicy: 'سياسة الخصوصية',
            termsOfService: 'شروط الخدمة',
            rightsReserved: 'جميع الحقوق محفوظة.'
        }
    };

    // Update navigation links
    document.querySelectorAll('.nav__link').forEach(link => {
        const key = link.getAttribute('href').replace('#', '');
        if (translations[lang][key]) {
            link.textContent = translations[lang][key];
        }
    });

    // Update hero section
    document.querySelector('.hero__title').textContent = translations[lang].heroTitle;
    document.querySelector('.hero__description').textContent = translations[lang].heroDesc;
    document.querySelector('.hero .btn').textContent = translations[lang].exploreProducts;

    // Update section titles
    document.querySelectorAll('.section-title').forEach(title => {
        const key = title.textContent.toLowerCase().replace(/\s+/g, '');
        if (translations[lang][key]) {
            title.textContent = translations[lang][key];
        }
    });

    // Update form placeholders
    document.querySelector('input[placeholder="Your Name"]').placeholder = translations[lang].yourName;
    document.querySelector('input[placeholder="Your Email"]').placeholder = translations[lang].yourEmail;
    document.querySelector('textarea').placeholder = translations[lang].yourMessage;
    document.querySelector('.contact__form .btn').textContent = translations[lang].sendMessage;

    // Update footer links
    document.querySelector('a[href="#privacy"]').textContent = translations[lang].privacyPolicy;
    document.querySelector('a[href="#terms"]').textContent = translations[lang].termsOfService;
    document.querySelector('.footer__bottom p').textContent = `© 2024 DOC Place. ${translations[lang].rightsReserved}`;
}

// Mobile Navigation Toggle
const mobileNavToggle = document.createElement('button');
mobileNavToggle.className = 'mobile-nav-toggle';
mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
document.querySelector('.nav').appendChild(mobileNavToggle);

mobileNavToggle.addEventListener('click', () => {
    document.querySelector('.nav__menu').classList.toggle('active');
    mobileNavToggle.querySelector('i').classList.toggle('fa-bars');
    mobileNavToggle.querySelector('i').classList.toggle('fa-times');
});

// Add mobile navigation styles
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .mobile-nav-toggle {
            display: block;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--text-color);
            cursor: pointer;
        }

        .nav__menu {
            position: fixed;
            top: 80px;
            left: 0;
            width: 100%;
            background-color: var(--background-color);
            padding: var(--spacing-md);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transform: translateY(-100%);
            opacity: 0;
            transition: var(--transition-base);
        }

        .nav__menu.active {
            transform: translateY(0);
            opacity: 1;
        }

        .nav__list {
            flex-direction: column;
            align-items: center;
        }
    }
`;
document.head.appendChild(style); 