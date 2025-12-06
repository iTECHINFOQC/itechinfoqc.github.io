// Language Toggle
let currentLanguage = localStorage.getItem('language') || 'en';
const languageToggle = document.getElementById('languageToggle');

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Update all elements with data-en and data-fr attributes
    document.querySelectorAll('[data-en][data-fr]').forEach(element => {
        if (lang === 'en') {
            element.textContent = element.getAttribute('data-en');
        } else {
            element.textContent = element.getAttribute('data-fr');
        }
    });
    
    // Update button labels
    const langEn = document.querySelector('.lang-en');
    const langFr = document.querySelector('.lang-fr');
    
    if (lang === 'en') {
        langEn.style.display = 'none';
        langFr.style.display = 'inline';
    } else {
        langEn.style.display = 'inline';
        langFr.style.display = 'none';
    }
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLanguage);
});

// Language toggle button
languageToggle.addEventListener('click', () => {
    const newLang = currentLanguage === 'en' ? 'fr' : 'en';
    setLanguage(newLang);
});

// Mobile Menu Toggle
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when a link is clicked
const navLinks = navMenu.querySelectorAll('a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar-container')) {
        navMenu.classList.remove('active');
    }
});

// Form Handling with Formspree Service
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);

    // Show loading state
    const submitButton = contactForm.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    try {
        // Send to Formspree (public form endpoint)
        // Replace with your actual Formspree endpoint
        const response = await fetch('https://formspree.io/f/xkgdzkeq', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Success
            formMessage.className = 'form-message success';
            formMessage.textContent = '✓ Message sent successfully! We\'ll contact you within 24 hours.';
            contactForm.reset();
            
            // Clear message after 5 seconds
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 5000);
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        // Fallback: Show mailto link or generic error
        console.error('Form error:', error);
        
        // Provide fallback option
        const emailSubject = encodeURIComponent('iTECHINFO Service Request');
        const emailBody = encodeURIComponent(
            `Name: ${formData.get('name')}\n` +
            `Email: ${formData.get('email')}\n` +
            `Phone: ${formData.get('phone')}\n` +
            `Service: ${formData.get('service')}\n\n` +
            `Message:\n${formData.get('message')}`
        );
        
        formMessage.className = 'form-message error';
        formMessage.innerHTML = `Network error. Please try emailing us directly at <a href="mailto:contact@itechinfo.site?subject=${emailSubject}&body=${emailBody}" style="color: #ff9999; text-decoration: underline;">contact@itechinfo.site</a>`;
        
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }, 8000);
    }

    // Restore button state
    submitButton.textContent = originalText;
    submitButton.disabled = false;
});

// Smooth scroll behavior enhancement
const scrollLinks = document.querySelectorAll('a[href^="#"]');
scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const element = document.querySelector(href);
            const offsetTop = element.offsetTop - 60; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe service cards and portfolio cards
const cardsToObserve = document.querySelectorAll('.service-card, .portfolio-card, .stat-item');
cardsToObserve.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active class styling (CSS will need to be updated to support this)
const style = document.createElement('style');
style.textContent = `
    .nav-menu a.active {
        color: var(--accent-color);
    }
    
    .nav-menu a.active:after {
        width: 100%;
    }
`;
document.head.appendChild(style);
