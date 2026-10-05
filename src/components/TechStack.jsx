import React from "react";
import "../styles/techstack.css";

const categories = [
  {
    key: "frontend",
    className: "frontend",
    index: "01",
  },
  {
    key: "backend",
    className: "backend",
    index: "02",
  },
  {
    key: "database",
    className: "database",
    index: "03",
  },
];

export default function TechStack({ t }) {
  return (
    <section id="stack" className="techstack scroll-reveal">
      <div className="container">
        <div className="techstack-header">
          <span className="section-label">{t.label}</span>
          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle">{t.subtitle}</p>
        </div>

        <div className="techstack-grid">
          {categories.map(({ key, className, index }) => {
            const cat = t[key];
            return (
              <div key={key} className={`tech-category ${className}`}>
                <div className="tech-cat-header">
                  <span className="tech-cat-index">{index}</span>
                  <div>
                    <h3 className="tech-cat-title">{cat.title}</h3>
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
