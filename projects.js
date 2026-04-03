var projects = [
    {
        title: "Computer-Vision Turret (Drone C-RAM)",
        description: "Object tracking turret using a Raspberry Pi 5, custom YOLO model, and PID-controlled servos. Runs a multi-process Linux pipeline with +/-1 degree tracking accuracy.",
        tags: ["Embedded", "Computer Vision", "Automation", "CAD", "Python", "YOLO", "OpenCV", "PID", "Raspberry Pi"],
        video: "https://www.youtube.com/embed/CiCFE5r0B4Y",
        image: null,
        repo: "https://github.com/Skelet0n-Key/Drone_C-RAM"
    },
    {
        title: "RFID Cloner/Emulator Security Research Tool",
        description: "RFID research tool using a PN532 module and Raspberry Pi Pico. Reads, clones, and emulates 13.56 MHz RFID tags with custom SPI/I2C drivers.",
        tags: ["Embedded", "RF", "CAD", "C", "Raspberry Pi Pico", "RFID", "SPI/I2C"],
        video: null,
        image: "images/emulator.webp",
        repo: "https://github.com/Skelet0n-Key/RFID-Cloner"
    },
    {
        title: "SDR RF Detector",
        description: "RF detector built with an RTL-SDR v4 dongle and Python. Monitors the 315 MHz band for key fob signals. Includes GNU Radio flowgraphs for demodulation and spectrum analysis.",
        tags: ["RF", "Automation", "Python", "RTL-SDR", "GNU Radio"],
        video: null,
        image: null,
        repo: "https://github.com/corbinpro/SDR_detector"
    },
    {
        title: "Drone RF Signal Detector",
        description: "Drone signal detector using an STM32L4 and AD8317 analog detectors. Scans 433 MHz, 915 MHz, 2.4 GHz, and 5.8 GHz with tuned antennas and a copper-lined enclosure for EMI shielding.",
        tags: ["Embedded", "RF", "STM32", "C", "SDR", "Signal Processing"],
        video: "https://www.youtube.com/embed/zc-Dw4LfCuc?si=laozBsnDYqBleJ8R",
        image: null,
        repo: "https://github.com/corbinpro/dradar_proj"
    },
    {
        title: "Automatic G-Code Editor",
        description: "Python tool that generates and edits CNC G-code. Validates tool paths and cuts setup time. The shop owner adopted it for daily use.",
        tags: ["Automation", "Python", "CNC"],
        video: null,
        image: null,
        repo: "https://github.com/corbinpro/lathe_translator_app"
    },
    {
        title: "Terminal CPU Monitor",
        description: "Simple terminal CPU monitor written in C. Reads /proc/stat to show per-core usage in real time. Made for Debian.",
        tags: ["Tools", "C", "Linux", "Terminal"],
        video: null,
        image: null,
        repo: "https://github.com/corbinpro/cpu_monitor"
    },
    {
        title: "Embedded Toolkit Script",
        description: "Bash script that sets up a fresh Linux machine for embedded development. Installs 60+ packages, configures Neovim/LazyVim, tmux, ranger, btop with Gruvbox theming, and XFCE keybindings.",
        tags: ["Tools", "Automation", "Bash", "Linux", "Neovim", "DevOps"],
        video: null,
        image: null,
        repo: "https://github.com/corbinpro/Embedded-Toolkit-Script"
    }
];

var TOP_TAGS = ["Embedded", "PID", "Linux", "RF", "Automation"];

function getTagsByFrequency() {
    var tagCount = {};
    projects.forEach(function (p) {
        p.tags.forEach(function (t) {
            tagCount[t] = (tagCount[t] || 0) + 1;
        });
    });

    var tagList = [];
    for (var tag in tagCount) {
        tagList.push({ name: tag, count: tagCount[tag] });
    }
    tagList.sort(function (a, b) { return b.count - a.count; });

    var names = [];
    tagList.forEach(function (item) { names.push(item.name); });
    return names;
}

function renderFilterButtons() {
    var container = document.getElementById("filter-buttons");
    if (!container) return;

    var allTags = getTagsByFrequency();
    var rest = allTags.filter(function (t) { return TOP_TAGS.indexOf(t) === -1; });

    var html = '<button class="filter-btn active" data-tag="all">All</button>';

    TOP_TAGS.forEach(function (tag) {
        html += '<button class="filter-btn" data-tag="' + tag + '">' + tag + '</button>';
    });

    if (rest.length > 0) {
        html += '<select class="filter-select" id="filter-more">';
        html += '<option value="" selected disabled>More...</option>';
        rest.forEach(function (tag) {
            html += '<option value="' + tag + '">' + tag + '</option>';
        });
        html += '</select>';
    }

    container.innerHTML = html;
    initFilters();
}

function renderProjects(tag) {
    var grid = document.getElementById("project-grid");
    if (!grid) return;

    var filtered;
    if (tag === "all") {
        filtered = projects;
    } else {
        filtered = projects.filter(function (p) { return p.tags.indexOf(tag) !== -1; });
    }

    var html = "";
    filtered.forEach(function (p) {
        var mediaHtml = "";
        if (p.video) {
            mediaHtml = '<iframe src="' + p.video + '" title="' + p.title + '" allowfullscreen loading="lazy"></iframe>';
        } else if (p.image) {
            mediaHtml = '<img src="' + p.image + '" alt="' + p.title + '" class="project-img">';
        }

        var repoHtml = "";
        if (p.repo) {
            var repoPath = p.repo.replace('https://github.com/', '');
            var ogImage = 'https://opengraph.githubassets.com/1/' + repoPath;
            repoHtml = '<a href="' + p.repo + '" class="repo-card" target="_blank" rel="noopener">';
            repoHtml += '<img src="' + ogImage + '" alt="' + repoPath + '" class="repo-og">';
            repoHtml += '</a>';
        }

        var tagsHtml = "";
        p.tags.forEach(function (t) {
            tagsHtml += '<span class="tag">' + t + '</span>';
        });

        html += '<div class="project-card">';
        html += mediaHtml;
        html += '<h3>' + p.title + '</h3>';
        html += '<p>' + p.description + '</p>';
        html += repoHtml;
        html += '<div class="tags">' + tagsHtml + '</div>';
        html += '</div>';
    });

    grid.innerHTML = html;
}

function initFilters() {
    var buttons = document.querySelectorAll(".filter-btn");
    var dropdown = document.getElementById("filter-more");

    buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            buttons.forEach(function (b) { b.classList.remove("active"); });
            btn.classList.add("active");
            if (dropdown) dropdown.selectedIndex = 0;
            renderProjects(btn.dataset.tag);
        });
    });

    if (dropdown) {
        dropdown.addEventListener("change", function () {
            buttons.forEach(function (b) { b.classList.remove("active"); });
            renderProjects(dropdown.value);
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    renderFilterButtons();

    var urlParams = new URLSearchParams(window.location.search);
    var tagParam = urlParams.get("tag");

    if (tagParam) {
        renderProjects(tagParam);
        var buttons = document.querySelectorAll(".filter-btn");
        buttons.forEach(function (b) {
            b.classList.remove("active");
            if (b.dataset.tag === tagParam) b.classList.add("active");
        });
        var dropdown = document.getElementById("filter-more");
        if (dropdown) {
            for (var i = 0; i < dropdown.options.length; i++) {
                if (dropdown.options[i].value === tagParam) {
                    dropdown.value = tagParam;
                    break;
                }
            }
        }
    } else {
        renderProjects("all");
    }
});
