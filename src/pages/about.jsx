import React from "react";
import "../css/about.css";
// Replace './AcezLogo.png' with the actual path to your saved image
import universityLogo from "../assets/UniLogo.png";

const AboutPage = () => {
  return (
    <div className="about-container">
      <div className="about-wrapper">
        <div className="logo-container">
          <img
            src={universityLogo}
            alt="Acez University Logo"
            className="university-logo"
          />
        </div>

        {/* Hero Section */}
        <header className="hero-section">
          <span className="accent-badge">Next-Gen Enrollment</span>
          <h1 className="hero-title">Education, Evolved.</h1>
          <p className="hero-subtitle">
            Acez University aimed to produce globally competitive individuals,
            capable through continuous innovation and rigorous training, born to
            strive and set the bar high! We exhibit our commitment by providing
            an exemplary online enrollment for our prospect students.
          </p>
        </header>

        {/* Mission & Vision Grid */}
        <div className="section-grid">
          <div className="info-card">
            <h3 className="card-title">Our Mission</h3>
            <p>
              Our student's success is what we aimed best! Expert from
              industries, knowledgeable individuals, multi-talented people all
              reside within the walls of Acez University.
            </p>
          </div>

          <div className="info-card">
            <h3 className="card-title">The Vision</h3>
            <p>
              Envisioning a world where educational barriers are dismantled by
              technology, allowing qualified and financially-restrained
              individuals to engage and be the best of themselves!
            </p>
          </div>
        </div>

        {/* Impact Stats Banner */}
        <div className="stats-banner">
          <div className="stat-item">
            <span className="stat-number">98k+</span>
            <span className="stat-label">Successful Enrollments</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">67%</span>
            <span className="stat-label">Agile Response</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">TOP 8</span>
            <span className="stat-label">University in the Philippines</span>
          </div>
        </div>

        {/* Features Section */}
        <section style={{ marginTop: "100px" }}>
          <div className="features-header">
            <h2>Why Institutions Trust Us</h2>
          </div>

          <div className="section-grid">
            <div className="feature-item">
              <h4>Lightning Fast React Core</h4>
              <p>
                Experience zero lag with our website architecture, optimized for
                high traffic usage and latency reduction.
              </p>
            </div>
            <div className="feature-item">
              <h4>Robust Security</h4>
              <p>
                Our MIS ensures high quality service and undisrupted service
                across all servers.
              </p>
            </div>
            <div className="feature-item">
              <h4>Automated Payments</h4>
              <p>
                Integrated billing systems allow for instant tuition processing
                and immediate enrollment confirmation.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
