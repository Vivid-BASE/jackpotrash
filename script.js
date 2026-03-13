document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    // Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0 // Trigger as soon as 1px is visible. Safest for mobile/tall elements.
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // Hyper Premium 3D Tilt with Smoothed Physics
    const logoCard = document.getElementById('hero-logo-card');
    const meshBg = document.querySelector('.hero-mesh-bg');
    
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    const lerpFactor = 0.18; // Increased for snappier response

    if (logoCard) {
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            targetX = (clientY / innerHeight - 0.5) * 45; 
            targetY = (clientX / innerWidth - 0.5) * -45; 
        });

        const updateTilt = () => {
            currentX += (targetX - currentX) * lerpFactor;
            currentY += (targetY - currentY) * lerpFactor;
            
            logoCard.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
            
            if (meshBg) {
                // Stronger Parallax
                meshBg.style.transform = `translate(${currentY * 3.5}px, ${currentX * 3.5}px)`;
            }
            requestAnimationFrame(updateTilt);
        };
        updateTilt();
    }

    // High-Density Particle System (Rapid Pulse)
    const particleContainer = document.getElementById('hero-particles');
    if (particleContainer) {
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'spark';
            
            const size = Math.random() * 6 + 4; // Larger base size (4px-10px)
            const left = Math.random() * 100;
            const duration = Math.random() * 1.2 + 1.2; // Even snappier movement
            const delay = Math.random() * 0.4;
            const drift = (Math.random() - 0.5) * 250; // Wider spread
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            
            const color = Math.random() > 0.4 ? '#e50914' : '#ffd700';
            particle.style.background = color;
            particle.style.boxShadow = `0 0 20px ${color}`;
            
            particle.style.setProperty('--drift', `${drift}px`);
            // Use a sharper ease-in for more aggressive "rising" feel
            particle.style.animation = `sparkFly ${duration}s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s forwards`;
            
            particleContainer.appendChild(particle);
            setTimeout(() => particle.remove(), (duration + delay) * 1000);
        };

        for (let i = 0; i < 60; i++) setTimeout(createParticle, Math.random() * 1000);
        setInterval(createParticle, 50); 
    }

    // Logo Random Sparkle (Glint) Effect
    const logoContainer = document.querySelector('.hero-logo-container');
    if (logoContainer) {
        const triggerSparkle = () => {
            const sparkle = document.createElement('div');
            sparkle.className = 'logo-sparkle';
            
            // Random position within logo
            const x = Math.random() * 80 + 10;
            const y = Math.random() * 80 + 10;
            const size = Math.random() * 15 + 10;
            
            sparkle.style.left = `${x}%`;
            sparkle.style.top = `${y}%`;
            sparkle.style.width = `${size}px`;
            sparkle.style.height = `${size}px`;
            
            logoContainer.appendChild(sparkle);
            
            // Animate glint
            sparkle.animate([
                { opacity: 0, transform: 'scale(0) rotate(0deg)' },
                { opacity: 1, transform: 'scale(1.2) rotate(90deg)', offset: 0.5 },
                { opacity: 0, transform: 'scale(0) rotate(180deg)' }
            ], {
                duration: 800,
                easing: 'ease-in-out'
            });
            
            setTimeout(() => sparkle.remove(), 800);
        };

        // Periodic Mega Glint (Every 5 seconds)
        setInterval(() => {
            logoCard.classList.add('logo-mega-pulse');
            
            // Trigger 3-5 sparkles together for impact
            for(let i=0; i<4; i++) {
                setTimeout(triggerSparkle, i * 150);
            }
            
            setTimeout(() => {
                logoCard.classList.remove('logo-mega-pulse');
            }, 2000);
        }, 5000);

        // Randomly trigger glints
        setInterval(() => {
            if (Math.random() > 0.6) triggerSparkle(); // Slightly more rare for premium feel
        }, 1200);
    }
});
