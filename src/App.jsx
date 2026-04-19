﻿import { useState, useEffect } from "react";
import data from "./data.json";

const fallbackData = {
  logo: "LOGO",
  hero: {
    name: "Your Name",
    title: "Your Title",
    description: "Your description",
    image: "https://via.placeholder.com/300",
  },
  stats: [{ value: "0", label: "Projects" }],
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
  const [appData, setAppData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showSkills, setShowSkills] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [replyMail, setReplyMail] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactChange = (event) => {
    const { name, value } = event.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("");
    setIsSubmitting(true);

    const reply = `Subject: Thank you for connecting\n\nHi ${contactForm.name || "there"},\n\nThank you for connecting with me. I appreciate you reaching out and I look forward to future collaboration.\n\nBest regards,\n${appData.hero.name}`;
    setReplyMail(reply);
    setCopyStatus("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: contactForm.email,
          subject: "Thank you for connecting",
          text: reply,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send email.");
      }

      setStatusMessage("Reply email sent successfully.");
    } catch (err) {
      console.error(err);
      setStatusMessage("Could not send email. Please check the server configuration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyReply = async () => {
    if (!replyMail) return;
    try {
      await navigator.clipboard.writeText(replyMail);
      setCopyStatus("Copied!");
    } catch (err) {
      setCopyStatus("Copy failed");
    }
  };

  useEffect(() => {
    try {
      setAppData({ ...fallbackData, ...data });
      setError(false);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);


  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {error && (
        <div className="status-banner">
          ⚠️ Data loading failed — using built-in fallback content.
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
            <div className="hero-heading">
              <h1>{appData.hero.name}</h1>
              <a href={appData.hero.linkedin} target="_blank" rel="noopener noreferrer" className="linkedin-link" aria-label="LinkedIn Profile">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
            <p className="hero-title">{appData.hero.title}</p>
            <p className="hero-description">{appData.hero.description}</p>
            <div className="hero-actions">
              <a className="btn-primary" href="#contact">
                Hire Me
              </a>
              <a className="btn-secondary" href="#portfolio">
                View Work
              </a>
            </div>

            <div className="stats-grid">
              {appData.stats.map((item) => (
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
                  src={appData.hero.image}
                  alt={appData.hero.name}
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
            {appData.education.map((item) => (
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
            {appData.portfolio.map((item) => (
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
            {appData.experience.map((item) => (
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
            {appData.leadership.map((item) => (
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
              <h2>{appData.contact.headline}</h2>
              <p>{appData.contact.subtext}</p>
            </div>

            <form className="contact-form" onSubmit={handleContactSubmit}>
              <label>
                Name
                <input
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                />
              </label>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  placeholder="Your email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                />
              </label>
              <label>
                Message
                <textarea
                  name="message"
                  placeholder="Your message"
                  rows={5}
                  value={contactForm.message}
                  onChange={handleContactChange}
                />
              </label>
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>

            {statusMessage && <p className="contact-status">{statusMessage}</p>}

            {replyMail && (
              <div className="reply-mail-card">
                <div className="reply-mail-header">Reply mail generated from my side</div>
                <pre>{replyMail}</pre>
                <div className="reply-mail-actions">
                  <button type="button" className="btn-secondary" onClick={handleCopyReply}>
                    Copy Reply
                  </button>
                  {copyStatus && <span className="copy-status">{copyStatus}</span>}
                </div>
              </div>
            )}
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
                  {appData.skills.technical && appData.skills.technical.map((skill) => (
                    <div key={skill} className="skill-tag">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              <div className="skills-section">
                <h3 className="skills-category-title">Soft Skills</h3>
                <div className="skills-grid">
                  {appData.skills.soft && appData.skills.soft.map((skill) => (
                    <div key={skill} className="skill-tag soft-skill">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              <div className="skills-section">
                <h3 className="skills-category-title">Certifications</h3>
                <div className="certifications-list">
                  {appData.skills.certifications && appData.skills.certifications.map((cert) => (
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