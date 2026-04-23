import React from "react";
import "../styles/about.css";

export default function About({ t }) {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-inner">
          {/* ── Left: Decorative Card ── */}
          <div className="about-left">
            <div className="about-decorative-box">
              <div className="about-card-stat">
                <div className="about-stat-number">3+</div>
                <div className="about-stat-label">{t.statProjects} Built</div>
              </div>

              <div className="about-decorative-inner">
                <span className="about-decorative-emoji">🚀</span>
                <div className="about-decorative-text">
                  Building the future,<br />one line at a time.
                </div>
              </div>

              <div className="about-card-stat" style={{ bottom: "-20px", left: "-20px" }}>
                <div className="about-stat-number">10+</div>
                <div className="about-stat-label">{t.statTech}</div>
              </div>
            </div>
          </div>

          {/* ── Right: Text ── */}
          <div className="about-right">
            <span className="section-label">{t.label}</span>
            <h2 className="section-title">{t.title}</h2>

            <p
              className="about-text"
              dangerouslySetInnerHTML={{ __html: t.p1 }}
            />
            <p
              className="about-text"
              dangerouslySetInnerHTML={{ __html: t.p2 }}
            />
            <p
              className="about-text"
              dangerouslySetInnerHTML={{ __html: t.p3 }}
            />

            <div className="about-highlight-box">
              <span className="about-highlight-icon">💡</span>
              <p className="about-highlight-text">{t.highlight}</p>
            </div>

            <div className="about-facts">
              {t.facts.map((fact, i) => (
                <div className="about-fact" key={i}>
                  <div className="about-fact-icon">{fact.split(" ")[0]}</div>
                  <span>{fact.split(" ").slice(1).join(" ")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
