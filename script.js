
const tl = gsap.timeline();
// Navbar - FROM
tl.from(".navbar", {
    y: -40,
    opacity: 0,
    duration: 0.8
})
// Hero heading - FROM
.from(".hero-text-side h1", {
    y: 30,
    opacity: 0,
    duration: 0.7
})

// Hero subtitle - FROM
.from(".hero-text-side h2", {
    y: 25,
    opacity: 0,
    duration: 0.6
})

// Paragraph + buttons - FROM
.from(".hero-text-side p, .hero-btns, .social-icons", {
    y: 20,
    opacity: 0,
    duration: 0.6
})

// Hero image - FROM TO
.fromTo(
    ".hero-image-side",
    {
        scale: 0.7,
        opacity: 0,
        y: 30
    },
    {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
    },
    "-=0.4"
);

// Safety net: if the animation clock stalls (hidden tab), force the hero to its
// final visible state so no text is ever left invisible.
setTimeout(() => {
    gsap.set(".navbar, .hero-text-side h1, .hero-text-side h2, .hero-text-side p, .hero-btns, .social-icons, .hero-image-side", {
        clearProps: "opacity,transform,visibility"
    });
}, 3000);

// Light / dark mode toggle (choice is remembered)
const modeToggle = document.querySelector(".mode-toggle");

if (modeToggle) {
    modeToggle.addEventListener("click", () => {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        if (isDark) {
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("portfolio-mode", "light");
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("portfolio-mode", "dark");
        }
    });
}

// Scroll reveals - CSS classes driven by IntersectionObserver, so text never
// depends on the animation clock to become visible
(() => {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const singles = document.querySelectorAll(
        ".section-title, .section-subtitle, .about-text-box, .contact-form, .footer p"
    );
    const cards = document.querySelectorAll(
        ".journey-card, .skills-column, .project-card, .contact-link"
    );

    // Stagger cards that sit next to each other
    const perParent = new Map();
    cards.forEach((el) => {
        const count = perParent.get(el.parentElement) || 0;
        el.style.setProperty("--reveal-delay", (count * 0.12) + "s");
        perParent.set(el.parentElement, count + 1);
    });

    const targets = [...singles, ...cards];
    targets.forEach((el) => el.classList.add("reveal-init"));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });

    targets.forEach((el) => observer.observe(el));

    // Safety net: on every scroll, reveal anything already at or above the fold,
    // so text can never be left invisible if observer frames are skipped.
    const revealReached = () => {
        targets.forEach((el) => {
            if (el.classList.contains("is-visible")) return;
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add("is-visible");
                observer.unobserve(el);
            }
        });
    };
    window.addEventListener("scroll", revealReached, { passive: true });
    window.addEventListener("load", revealReached);
})();

// Contact form - local dev posts to server.py, which sends mail over Gmail SMTP.
// On the deployed static site there is no server, so the same fields go to the
// host's form handling (Netlify Forms).
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
    const statusEl = contactForm.querySelector(".form-status");
    const submitBtn = contactForm.querySelector(".submit-btn");

    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(contactForm).entries());

        // Only localhost has server.py running; everywhere else use the static
        // host's endpoint, which needs a URL-encoded body carrying form-name
        // and does not accept JSON.
        const isLocalDev = ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);

        const originalLabel = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
        statusEl.textContent = "";
        statusEl.className = "form-status";

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 15000);

        try {
            const res = isLocalDev
                ? await fetch("/api/contact", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(data),
                    signal: controller.signal
                })
                : await fetch("/", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams(data).toString(),
                    signal: controller.signal
                });

            const json = await res.json().catch(() => ({}));
            if (!res.ok || json.success === false) {
                throw new Error(json.message || "Request failed with status " + res.status);
            }

            statusEl.textContent = "Message sent! I'll get back to you soon.";
            statusEl.classList.add("is-success");
            contactForm.reset();
        } catch (err) {
            statusEl.textContent = err.name === "AbortError"
                ? "The request timed out. Please try again or email me directly."
                : "Something went wrong sending your message. Please email me directly instead.";
            statusEl.classList.add("is-error");
            console.error("Contact form error:", err);
        } finally {
            clearTimeout(timer);
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
        }
    });
}

