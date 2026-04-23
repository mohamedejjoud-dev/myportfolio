import React from "react";
import "../styles/projects.css";

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

export default function Projects({ t }) {
  const { list, label, title, subtitle, featuredBadge, viewLive } = t;

  // Sort: featured first, then others
  const sorted = [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  return (
    <section id="projects" className="projects">
      <div className="container">
        <div className="projects-header">
          <span className="section-label">{label}</span>
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>

        <div className="projects-grid">
          {sorted.map((project) => (
            <article
              key={project.id}
              className={`project-card ${project.featured ? "featured" : ""}`}
            >
              {project.featured && (
                <div className="project-featured-badge">{featuredBadge}</div>
              )}

              <div className="project-card-header">
                <div className="project-icon-wrap">{project.icon}</div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link-btn"
                  aria-label={`View ${project.name} live`}
                >
                  <ExternalIcon />
                </a>
              </div>

              <h3 className="project-name">{project.name}</h3>
              <p className="project-desc">{project.desc}</p>

              {project.featured && project.features.length > 0 && (
                <div className="project-features">
                  {project.features.map((f, i) => (
                    <div className="project-feature" key={i}>
                      <span className="project-feature-dot" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="project-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
