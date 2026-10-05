import React from "react";
import "../styles/about.css";

/**
 * Safe rich-text renderer — allows ONLY <strong> tags from static translations.
 * Replaces dangerouslySetInnerHTML; zero XSS attack surface.
 */
function RichText({ text }) {
  const parts = text.split(/(<strong>[^<]*<\/strong>)/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^<strong>([^<]*)<\/strong>$/);
        if (match) return <strong key={i}>{match[1]}</strong>;
        return part;
      })}
    </>
  );
}

export default function About({ t }) {
  return (
    <section id="about" className="about scroll-reveal">
      <div className="container">
        <div className="about-inner">

          {/* ── Left: Text ── */}
          <div className="about-left">
            <span className="section-label">{t.label}</span>
            <h2 className="section-title">{t.title}</h2>

            <p className="about-text"><RichText text={t.p1} /></p>
            <p className="about-text"><RichText text={t.p2} /></p>
            <p className="about-text"><RichText text={t.p3} /></p>

            <div className="about-highlight">
              {t.highlight}
            </div>
          </div>

          {/* ── Right: Structured Specs/Facts ── */}
          <div className="about-right">
            <div className="about-facts">
              {t.facts.map((fact, i) => (
                <div className="about-fact" key={i}>
                  <span className="about-fact-label">{fact.label}</span>
                  <span className="about-fact-value">{fact.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
