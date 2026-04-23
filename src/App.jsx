import React, { useState, useEffect } from "react";
import "./styles/global.css";
import translations from "./i18n/translations.js";

import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import TechStack from "./components/TechStack.jsx";
import Projects from "./components/Projects.jsx";
import Contact from "./components/Contact.jsx";

export default function App() {
  // ─── Theme ───────────────────────────────────────────────
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("portfolio-theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  // ─── Language ─────────────────────────────────────────────
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("portfolio-lang") || "en";
  });

  useEffect(() => {
    localStorage.setItem("portfolio-lang", lang);
  }, [lang]);

  const toggleLang = () => setLang((l) => (l === "en" ? "fr" : "en"));

  const t = translations[lang];

  // ─── Scroll State (for navbar) ────────────────────────────
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {/* ── Navbar ── */}
      <nav className="navbar" style={scrolled ? { padding: "10px 0" } : {}}>
        <div className="container">
          <a href="#home" className="nav-logo">ME.</a>

          <ul className="nav-links">
            <li><a href="#about">{t.nav.about}</a></li>
            <li><a href="#stack">{t.nav.stack}</a></li>
            <li><a href="#projects">{t.nav.projects}</a></li>
            <li><a href="#contact">{t.nav.contact}</a></li>
          </ul>

          <div className="nav-controls">
            <button className="lang-btn" onClick={toggleLang} aria-label="Toggle language">
              {lang === "en" ? "🇫🇷 FR" : "🇬🇧 EN"}
            </button>
            <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? "☀️" : "🌙"}
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
