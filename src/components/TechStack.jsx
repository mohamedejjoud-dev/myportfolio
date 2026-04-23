import React from "react";
import "../styles/techstack.css";

const categories = [
  {
    key: "frontend",
    className: "frontend",
    emoji: "🎨",
  },
  {
    key: "backend",
    className: "backend",
    emoji: "⚙️",
  },
  {
    key: "database",
    className: "database",
    emoji: "🗄️",
  },
];

export default function TechStack({ t }) {
  return (
    <section id="stack" className="techstack">
      <div className="container">
        <div className="techstack-header">
          <span className="section-label">{t.label}</span>
          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle">{t.subtitle}</p>
        </div>

        <div className="techstack-grid">
          {categories.map(({ key, className, emoji }) => {
            const cat = t[key];
            return (
              <div key={key} className={`tech-category ${className}`}>
                <div className="tech-cat-header">
                  <div className="tech-cat-icon">{emoji}</div>
                  <div>
                    <div className="tech-cat-title">{cat.title}</div>
                    <div className="tech-cat-subtitle">{cat.subtitle}</div>
                  </div>
                </div>

                <div className="tech-pills">
                  {cat.techs.map((tech) => (
                    <div key={tech} className="tech-pill">
                      <span className="tech-pill-dot" />
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
