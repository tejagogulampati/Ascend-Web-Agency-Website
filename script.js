const loader = document.getElementById("loader");

function hideLoader() {
    if (loader) {
        loader.classList.add("out");
        setTimeout(() => {
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, 700);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(hideLoader, 650);
});

window.addEventListener("load", () => {
    setTimeout(hideLoader, 650);
});

setTimeout(hideLoader, 1800);

const nav = document.getElementById("nav");
const burger = document.getElementById("burger");
const mob = document.getElementById("mob");
const mobX = document.getElementById("mobX");

function syncNav() {
    if (!nav) return;
    nav.classList.toggle("stuck", window.scrollY > 60);
}

syncNav();
window.addEventListener("scroll", syncNav, { passive: true });

function closeMenu() {
    if (!mob || !burger) return;
    mob.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    mob.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
}

function openMenu() {
    if (!mob || !burger) return;
    mob.classList.add("open");
    burger.classList.add("open");
    burger.setAttribute("aria-expanded", "true");
    mob.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
}

if (burger) {
    burger.addEventListener("click", () => {
        if (mob && mob.classList.contains("open")) {
            closeMenu();
        } else {
            openMenu();
        }
    });
}

if (mobX) {
    mobX.addEventListener("click", closeMenu);
}

document.querySelectorAll("#mob a").forEach((link) => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
        const href = anchor.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
    });
});

const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("on");
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" })
    : null;

document.querySelectorAll(".rv").forEach((element) => {
    if (revealObserver) {
        revealObserver.observe(element);
    } else {
        element.classList.add("on");
    }
});

const metricObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.querySelectorAll(".metric-bar").forEach((bar) => {
                bar.classList.add("go");
            });
            metricObserver.unobserve(entry.target);
        });
    }, { threshold: 0.3 })
    : null;

document.querySelectorAll(".process-panel, .about-panel").forEach((panel) => {
    if (metricObserver) {
        metricObserver.observe(panel);
    } else {
        panel.querySelectorAll(".metric-bar").forEach((bar) => bar.classList.add("go"));
    }
});

(function initHeroCanvas() {
    const canvas = document.getElementById("three-canvas");
    if (!canvas || !window.THREE) return;

    const hero = canvas.parentElement;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    const group = new THREE.Group();
    scene.add(group);

    const knotGeo = new THREE.TorusKnotGeometry(2.2, 0.52, 220, 22, 2, 3);
    const knotMat = new THREE.MeshBasicMaterial({
        color: 0x4f6ef7,
        wireframe: true,
        transparent: true,
        opacity: 0.11
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    knot.position.set(3.0, -0.5, 0);
    group.add(knot);

    const ring1 = new THREE.Mesh(
        new THREE.TorusGeometry(3.9, 0.007, 2, 180),
        new THREE.MeshBasicMaterial({ color: 0x5577ff, transparent: true, opacity: 0.08 })
    );
    ring1.rotation.x = Math.PI * 0.3;
    ring1.position.set(3.0, -0.5, -0.8);
    group.add(ring1);

    const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(2.6, 0.005, 2, 140),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.06 })
    );
    ring2.rotation.y = Math.PI * 0.5;
    ring2.rotation.z = Math.PI * 0.18;
    ring2.position.set(3.0, -0.5, 0);
    group.add(ring2);

    let mouseX = 0;
    let mouseY = 0;
    let clock = 0;

    document.addEventListener("mousemove", (event) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function resize() {
        const width = hero.offsetWidth;
        const height = hero.offsetHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    window.addEventListener("resize", resize);
    resize();

    function animate() {
        requestAnimationFrame(animate);
        clock += 0.0035;

        knot.rotation.x += 0.0025;
        knot.rotation.y += 0.0038;
        knot.rotation.z += 0.0012;
        ring1.rotation.z += 0.0015;
        ring2.rotation.x += 0.0020;

        const breath = 1 + Math.sin(clock * 0.65) * 0.016;
        knot.scale.setScalar(breath);

        group.rotation.y += (mouseX * 0.06 - group.rotation.y) * 0.04;
        group.rotation.x += (-mouseY * 0.04 - group.rotation.x) * 0.04;

        renderer.render(scene, camera);
    }

    animate();
})();
