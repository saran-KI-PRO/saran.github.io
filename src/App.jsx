import { useState, useEffect } from "react";

const fallbackData = {
  logo: "LOGO",
  hero: {
    name: "Your Name",
    title: "Your Title",
    description: "Your description",
    image: "https://via.placeholder.com/300",
  },
  // stats: [{ value: "0", label: "Projects" }] //,
  portfolio: [],
  education: [],
  experience: [],
  leadership: [],
  skills: {
    technical: [],
    soft: [],
    certifications: []
  },
  contact: {
    headline: "Reach out to start a project.",
    subtext: "Send a message and let’s build something together.",
  },
};

export default function App() {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showSkills, setShowSkills] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/data.json", { cache: "no-cache" });
        if (!res.ok) throw new Error("data.json not found");
        const json = await res.json();
        setData({ ...fallbackData, ...json });
        setError(false);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {error && (
        <div className="status-banner">
          ⚠️ data.json not found or invalid — using built-in fallback content.
        </div>
      )}

      <header className="top-nav">
        <button
          className="nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
        <div 
          className={`nav-overlay ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(false)}
        />
        <nav className={`nav-links ${mobileMenuOpen ? 'mobile-visible' : 'mobile-hidden'}`}>
          <a href="#education" onClick={() => setMobileMenuOpen(false)}>Education</a>
          <a href="#portfolio" onClick={() => setMobileMenuOpen(false)}>Portfolio</a>
          <a href="#experience" onClick={() => setMobileMenuOpen(false)}>Experience</a>
          <a href="#leadership" onClick={() => setMobileMenuOpen(false)}>Leadership</a>
          <button className="nav-button" onClick={() => { setShowSkills(true); setMobileMenuOpen(false); }}>Skills</button>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
        </nav>
      </header>

      <main className="page-container" id="main-content">
        <section className="hero-section">
          <article className="hero-copy">
            <span className="eyebrow">Welcome to my portfolio</span>
            <h1>{data.hero.name}</h1>
            <p className="hero-title">{data.hero.title}</p>
            <p className="hero-description">{data.hero.description}</p>
            <div className="hero-actions">
              <a className="btn-primary" href="#contact">
                Hire Me
              </a>
              <a className="btn-secondary" href="#portfolio">
                View Work
              </a>
            </div>

            <div className="stats-grid">
              {data.stats.map((item) => (
                <article key={item.label} className="stat-card">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </article>
              ))}
            </div>
          </article>

          <aside className="hero-panel">
            <div className="hero-card">
              <div className="hero-label">ELECTRICAL AND ELECTRONICS </div>
              <div className="hero-frame">
                <img
                  className="hero-avatar"
                  src={data.hero.image}
                  alt={data.hero.name}
                />
              </div>
              <p className="hero-note">
               Renewable Energy | Power Systems | Embedded Applications
              </p>
            </div>
          </aside>
        </section>

        <section id="education" className="section-block">
          <div className="section-heading">
            <span className="section-label">Education</span>
            <h2>My Education</h2>
          </div>

          <div className="experience-list">
            {data.education.map((item) => (
              <article key={item.degree} className="experience-item">
                <div className="experience-head">
                  <div>
                    <h3>{item.degree}</h3>
                    <p>{item.institution}</p>
                  </div>
                  <span>{item.year}</span>
                </div>
                <p>CGPA: {item.CGPA}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="portfolio" className="section-block">
          <div className="section-heading">
            <span className="section-label">Portfolio</span>
            <h2>Selected Projects</h2>
          </div>

          <div className="portfolio-grid">
            {data.portfolio.map((item) => (
              <article 
                key={item.title} 
                className="project-card"
                onClick={() => setSelectedProject(item)}
                role="button"
                tabIndex={0}
              >
                <img src={item.image} alt={item.title} />
                <div className="project-copy">
                  <span>{item.category}</span>
                  <h3>{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className="section-block">
          <div className="section-heading">
            <span className="section-label">My Experience</span>
            <h2>Recent Roles</h2>
          </div>

          <div className="experience-list">
            {data.experience.map((item) => (
              <article key={item.role} className="experience-item">
                <div className="experience-head">
                  <div>
                    <h3>{item.role}</h3>
                    <p>{item.company}</p>
                  </div>
                  <span>{item.duration}</span>
                </div>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="leadership" className="section-block">
          <div className="section-heading">
            <span className="section-label">Leadership & Co-Curricular</span>
            <h2>Activities & Roles</h2>
          </div>

          <div className="experience-list">
            {data.leadership.map((item) => (
              <article key={item.title} className="experience-item">
                <div className="experience-head">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.organization}</p>
                  </div>
                  <span>{item.duration}</span>
                </div>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="section-block contact-section">
          <div className="contact-panel">
            <div>
              <span className="section-label">Contact</span>
              <h2>{data.contact.headline}</h2>
              <p>{data.contact.subtext}</p>
            </div>

            <form className="contact-form">
              <label>
                Name
                <input type="text" placeholder="Your name" />
              </label>
              <label>
                Email
                <input type="email" placeholder="Your email" />
              </label>
              <label>
                Message
                <textarea placeholder="Your message" rows={5} />
              </label>
              <button type="submit" className="btn-primary">
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>

      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close" 
              onClick={() => setSelectedProject(null)}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="modal-body">
              <div className="modal-image-section">
                <img src={selectedProject.image} alt={selectedProject.title} className="modal-image" />
              </div>
              <div className="modal-text-section">
                <span className="modal-category">{selectedProject.category}</span>
                <h2>{selectedProject.title}</h2>
                <p className="modal-description">{selectedProject.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSkills && (
        <div className="modal-overlay" onClick={() => setShowSkills(false)}>
          <div className="modal-content skills-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close" 
              onClick={() => setShowSkills(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <div className="skills-modal-body">
              <h2>Skills & Certifications</h2>
              
              <div className="skills-section">
                <h3 className="skills-category-title">Technical Skills</h3>
                <div className="skills-grid">
                  {data.skills.technical && data.skills.technical.map((skill) => (
                    <div key={skill} className="skill-tag">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              <div className="skills-section">
                <h3 className="skills-category-title">Soft Skills</h3>
                <div className="skills-grid">
                  {data.skills.soft && data.skills.soft.map((skill) => (
                    <div key={skill} className="skill-tag soft-skill">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              <div className="skills-section">
                <h3 className="skills-category-title">Certifications</h3>
                <div className="certifications-list">
                  {data.skills.certifications && data.skills.certifications.map((cert) => (
                    <a 
                      key={cert.name}
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="certification-item"
                    >
                      <span className="certification-icon">🏆</span>
                      <span className="certification-name">{cert.name}</span>
                      <span className="certification-link-icon">→</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
