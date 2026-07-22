/* dark mode */
function applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);

    var btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.textContent = themeName === 'dark' ? '[light]' : '[dark]';
    }
}

function initThemeToggle() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    var saved = localStorage.getItem('theme') || 'light';
    applyTheme(saved);

    btn.addEventListener('click', function () {
        var current = localStorage.getItem('theme') || 'light';
        if (current === 'dark') {
            applyTheme('light');
        } else {
            applyTheme('dark');
        }
    });
}

/* typing animation */
var roles = [
    "Embedded Systems Engineer",
    "Software Engineer",
    "CNC Machinist",
    "Mechanic",
    "Problem Solver"
];

var roleIndex = 0;
var charIndex = 0;
var deleting = false;

function typeRole() {
    var el = document.getElementById('typed-role');
    if (!el) return;

    var current = roles[roleIndex];

    if (!deleting) {
        el.textContent = '~$ ' + current.slice(0, charIndex + 1) + '_';
        charIndex++;
        if (charIndex >= current.length) {
            deleting = true;
            setTimeout(typeRole, 1500);
            return;
        }
        setTimeout(typeRole, 80);
    } else {
        el.textContent = '~$ ' + current.slice(0, charIndex) + '_';
        charIndex--;
        if (charIndex < 0) {
            deleting = false;
            charIndex = 0;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(typeRole, 400);
            return;
        }
        setTimeout(typeRole, 40);
    }
}

/* mobile menu toggle */
function initMenuToggle() {
    var btn = document.getElementById('menu-toggle');
    var links = document.getElementById('nav-links');
    if (!btn || !links) return;

    btn.addEventListener('click', function () {
        links.classList.toggle('open');
        var expanded = links.classList.contains('open');
        btn.setAttribute('aria-expanded', expanded);
    });

    /* close menu when a link is tapped */
    links.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            links.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        });
    });

    /* close menu when clicking outside */
    document.addEventListener('click', function (e) {
        if (!links.contains(e.target) && e.target !== btn) {
            links.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        }
    });
}

/* hero spacer + progressive blur */
function initHeroSpacer() {
    var hero = document.querySelector('.hero-section');
    var spacer = document.querySelector('.hero-spacer');
    var heroBg = document.querySelector('.hero-bg');
    var heroOverlay = document.querySelector('.hero');
    var heroNav = document.querySelector('.nav-transparent');
    if (!hero || !spacer) return;

    function updateSpacer() {
        if (heroBg) {
            var imgH = heroBg.offsetHeight + 'px';
            spacer.style.height = imgH;
            if (heroOverlay) heroOverlay.style.height = imgH;
        }
    }

    function updateBlur() {
        if (!heroBg) return;
        var heroH = heroBg ? heroBg.offsetHeight : hero.offsetHeight;
        if (heroH === 0) return;

        var scrollRatio = Math.min(window.scrollY / heroH, 1);
        var maxBlur = 12; /* pixels, ~80% blur feel */

        /* ease-in curve: slow ramp until 0.5, then steep */
        var blur;
        if (scrollRatio < 0.5) {
            /* gentle: cubic ease from 0 to ~10% of max */
            blur = maxBlur * 0.1 * Math.pow(scrollRatio / 0.5, 2);
        } else {
            /* steep: ramp from 10% to 100% of max */
            var t = (scrollRatio - 0.5) / 0.5;
            blur = maxBlur * (0.1 + 0.9 * Math.pow(t, 1.5));
        }

        /* zoom: 1.0 to 1.5, steep ramp */
        var zoom;
        if (scrollRatio < 0.3) {
            zoom = 1 + 0.5 * 0.05 * Math.pow(scrollRatio / 0.3, 2);
        } else {
            var tz = (scrollRatio - 0.3) / 0.7;
            zoom = 1 + 0.5 * (0.05 + 0.95 * Math.pow(tz, 1.2));
        }

        heroBg.style.filter = 'blur(' + blur.toFixed(1) + 'px)';
        heroBg.style.transform = 'scale(' + zoom.toFixed(3) + ')';

        /* fade out hero text and nav as content covers them */
        var fadeStart = 0.15;
        var fadeEnd = 0.5;
        var opacity = 1;
        if (scrollRatio > fadeStart) {
            opacity = 1 - Math.min((scrollRatio - fadeStart) / (fadeEnd - fadeStart), 1);
        }

        if (heroOverlay) {
            heroOverlay.style.opacity = opacity;
            heroOverlay.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
        }
        if (heroNav) {
            heroNav.style.opacity = opacity;
            heroNav.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
        }
    }

    updateSpacer();
    updateBlur();
    if (heroBg) heroBg.addEventListener('load', updateSpacer);
    window.addEventListener('resize', updateSpacer);
    window.addEventListener('scroll', updateBlur);
}

/* === Image Carousels (stacked cards, round-robin) === */
var allCarousels = [];
var currentCarousel = 0;

function initCarousels() {
    var elements = document.querySelectorAll('.carousel');

    elements.forEach(function (carousel) {
        var images = carousel.querySelectorAll('.carousel-img');
        if (images.length < 2) return;

        var order = [];
        for (var i = 0; i < images.length; i++) {
            order.push(i);
        }
        setPositions(images, order);

        var data = { el: carousel, images: images, order: order, paused: false, leaveTimer: null };
        allCarousels.push(data);

        carousel.addEventListener('mouseenter', function () {
            if (data.leaveTimer) {
                clearTimeout(data.leaveTimer);
                data.leaveTimer = null;
            }
            data.paused = true;
            carousel.classList.add('exploded');
        });

        carousel.addEventListener('mouseleave', function () {
            data.leaveTimer = setTimeout(function () {
                data.paused = false;
                carousel.classList.remove('exploded');
                setPositions(images, data.order);
                data.leaveTimer = null;
            }, 400);
        });
    });

    if (allCarousels.length > 0) {
        setInterval(shuffleNext, 2000);
    }
}

function shuffleNext() {
    // Find next unpaused carousel
    var tried = 0;
    while (tried < allCarousels.length) {
        var data = allCarousels[currentCarousel];
        currentCarousel = (currentCarousel + 1) % allCarousels.length;
        tried++;

        if (!data.paused) {
            shuffleCarousel(data);
            return;
        }
    }
}

function shuffleCarousel(data) {
    var topIndex = data.order[0];
    data.images[topIndex].className = 'carousel-img shuffle-out';

    setTimeout(function () {
        data.order.push(data.order.shift());
        if (!data.paused) {
            setPositions(data.images, data.order);
        }
    }, 500);
}

function setPositions(images, order) {
    for (var i = 0; i < images.length; i++) {
        var imgIndex = order[i];
        if (i === 0) {
            images[imgIndex].className = 'carousel-img pos-0';
        } else if (i === 1) {
            images[imgIndex].className = 'carousel-img pos-1';
        } else if (i === 2) {
            images[imgIndex].className = 'carousel-img pos-2';
        } else {
            images[imgIndex].className = 'carousel-img pos-hidden';
        }
    }
}

/* lightbox */
function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var closeBtn = document.getElementById('lightbox-close');
    if (!lightbox || !lightboxImg) return;

    /* click any timeline image to open fullscreen */
    document.querySelectorAll('.timeline-img img').forEach(function (img) {
        img.addEventListener('click', function () {
            lightboxImg.src = this.src;
            lightboxImg.alt = this.alt;
            lightbox.classList.add('open');
        });
    });

    /* close on button, background click, or Escape */
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            lightbox.classList.remove('open');
        });
    }

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('open');
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) {
            lightbox.classList.remove('open');
        }
    });
}

/* === Featured Carousel (auto-advancing, every 1.5s) === */
function initFeaturedCarousel() {
    var carousels = document.querySelectorAll('.featured-carousel');

    carousels.forEach(function (carousel) {
        var images = carousel.querySelectorAll('.fc-img');
        if (images.length < 2) return;

        var index = 0;
        setInterval(function () {
            images[index].classList.remove('active');
            index = (index + 1) % images.length;
            images[index].classList.add('active');
        }, 1500);
    });
}

/* init */
document.addEventListener('DOMContentLoaded', function () {
    initThemeToggle();
    initMenuToggle();
    initHeroSpacer();
    initCarousels();
    initFeaturedCarousel();
    initLightbox();
    setTimeout(typeRole, 500);
});
