const roles = [
    "Embedded Systems Engineer",
    "Software Engineer",
    "CAD Designer",
    "Machinist and Fabricator",
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeRole() {
    const el = document.getElementById("typed-role");
    if (!el) return;

    const current = roles[roleIndex];

    if (!deleting) {
        el.textContent = "~$ " + current.slice(0, charIndex + 1) + "_";
        charIndex++;
        if (charIndex >= current.length) {
            deleting = true;
            setTimeout(typeRole, 1500);
            return;
        }
        setTimeout(typeRole, 80);
    } else {
        el.textContent = "~$ " + current.slice(0, charIndex) + "_";
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

function initThemeToggle() {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;

    const saved = localStorage.getItem("theme");
    if (saved) {
        document.documentElement.setAttribute("data-theme", saved);
    }
    updateLabel();

    btn.addEventListener("click", function() {
        const current = document.documentElement.getAttribute("data-theme");
        const isDark = current === "dark" ||
            (!current && window.matchMedia("(prefers-color-scheme: dark)").matches);
        const next = isDark ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        updateLabel();
    });

    function updateLabel() {
        const theme = document.documentElement.getAttribute("data-theme");
        const isDark = theme === "dark" ||
            (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
        btn.textContent = isDark ? "light mode" : "dark mode";
    }
}

function initMenuToggle() {
    const btn = document.getElementById("menu-toggle");
    const links = document.getElementById("nav-links");
    if (!btn || !links) return;

    btn.addEventListener("click", function() {
        links.classList.toggle("open");
    });
}

document.addEventListener("DOMContentLoaded", function() {
    setTimeout(typeRole, 500);
    initThemeToggle();
    initMenuToggle();
});
