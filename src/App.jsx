import React, { useState, useEffect, useRef } from "react";
import "./styles/global.css";
import translations from "./i18n/translations.js";

import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import TechStack from "./components/TechStack.jsx";
import Projects from "./components/Projects.jsx";
import Contact from "./components/Contact.jsx";

export default function App() {
  // ─── Theme (validated & hardened against tampering) ───────
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem("portfolio-theme");
      return stored === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch {
      // Ignore storage write errors (e.g. private browsing quota exceeded)
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  // ─── Language (strictly validated to prevent undefined translations) ──
  const [lang, setLang] = useState(() => {
    try {
      const stored = localStorage.getItem("portfolio-lang");
      return stored === "fr" ? "fr" : "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("portfolio-lang", lang);
    } catch {
      // Ignore storage write errors
    }
  }, [lang]);

  const toggleLang = () => setLang((l) => (l === "en" ? "fr" : "en"));

  const t = translations[lang] || translations.en;

  // ─── Scroll (navbar) ──────────────────────────────────────
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ─── Scroll Reveal (Subtle 3D Depth) ──────────────────────
  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-reveal");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [lang]);

  // ─── Mobile menu ──────────────────────────────────────────
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-wrapper">
      {/* ── Navbar ── */}
      <nav ref={navRef} className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="container">
          <a href="#home" className="nav-logo">ME<span>.</span></a>

          <ul className={`nav-links${menuOpen ? " open" : ""}`}>
            <li><a href="#about"    onClick={closeMenu}>{t.nav.about}</a></li>
            <li><a href="#stack"    onClick={closeMenu}>{t.nav.stack}</a></li>
            <li><a href="#projects" onClick={closeMenu}>{t.nav.projects}</a></li>
            <li><a href="#contact"  onClick={closeMenu}>{t.nav.contact}</a></li>
          </ul>

          <div className="nav-controls">
            <button className="lang-btn" onClick={toggleLang} aria-label="Toggle language">
              {lang === "en" ? "FR" : "EN"}
            </button>
            <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? "☀" : "☾"}
            </button>
            <button
              className={`nav-toggle${menuOpen ? " open" : ""}`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Sections ── */}
      <Hero t={t.hero} />
      <About t={t.about} />
      <TechStack t={t.stack} />
      <Projects t={t.projects} />
      <Contact t={{ ...t.contact, copy: t.footer.copy, name: t.footer.name }} />
    </div>
  );
}
