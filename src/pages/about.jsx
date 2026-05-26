import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/about.css";

// --- SWIPER IMPORTS ---
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
// Swiper specific CSS
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import universityLogo from "../assets/UniLogo.png";
import logo2 from "../assets/UniLogo3.png";
import pic1 from "../assets/2336.jpg";
import pic2 from "../assets/pic2.jpg";
import pic3 from "../assets/pic3.svg";

const AboutPage = () => {
  const navigate = useNavigate();
  const studentPortal = (e) => {
    navigate("/login");
  };

  return (
    <>
      {/* --- ORANGE TOP BANNER --- */}
      <div className="top-announcement-bar" style={{
        background: 'linear-gradient(135deg, #fa6d06 0%, #e18354 100%)',
        color: 'white',
        textAlign: 'center',
        padding: '8px 20px',
        fontSize: '0.9rem',
        fontWeight: '600',
        letterSpacing: '0.5px'
      }}>
        🎓 Education, Evolved. Welcome to Acez University!
      </div>

      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <img src={logo2} alt="Acez Logo" />
          </div>
          <ul className="nav-links">
            <li><a href="#hero">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#admissions">Admissions</a></li>
            <li><a href="#academics">Academics</a></li>
          </ul>
          <div className="nav-actions">
            <button className="portal-SignIn" onClick={studentPortal}>
              Student Portal
            </button>
          </div>
        </div>
      </nav>

      {/* --- SWIPER CAROUSEL (HERO) --- */}
      <section id="hero">
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          effect={"fade"}
          fadeEffect={{ crossFade: true }}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          className="welcome-carousel"
        >
          <SwiperSlide>
            <div className="slide-wrapper">
              <img src={pic1} alt="Welcome" className="slide-img" />
              <div className="slide-caption">
                <h5>Welcome to Acez University</h5>
                <p>Where bright minds come to life!</p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide-wrapper">
              <img src={pic2} alt="Enrollment" className="slide-img" />
              <div className="slide-caption">
                <h5>Next-Gen Enrollment</h5>
                <p>Experience seamless online registration.</p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide-wrapper">
              <img src={pic3} alt="Campus" className="slide-img" />
              <div className="slide-caption">
                <h5>Excellence in Education</h5>
                <p>Join our growing community today.</p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      <div className="about-container">
        <div className="about-wrapper">
          {/* About Section */}
          <section id="about" className="content-section">
            <div className="logo-container">
              <img src={universityLogo} alt="Acez University Logo" className="university-logo" />
            </div>
            <header className="hero-section">
              <span className="accent-badge">Discover Acez</span>
              <h1 className="hero-title">Education, Evolved.</h1>
              <p className="hero-subtitle">
                Acez University aims to produce globally competitive individuals,
                capable through continuous innovation and rigorous training, born
                to strive and set the bar high!
              </p>
            </header>
            
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

            <div className="stats-banner">
              <div className="stat-item"><span className="stat-number">98k+</span><span className="stat-label">Successful Enrollments</span></div>
              <div className="stat-item"><span className="stat-number">67%</span><span className="stat-label">Agile Response</span></div>
              <div className="stat-item"><span className="stat-number">TOP 8</span><span className="stat-label">University in the Philippines</span></div>
            </div>
          </section>

          {/* Admissions Section */}
          <section id="admissions" className="content-section">
            <div className="features-header">
              <h2>Admissions Process</h2>
              <p style={{ textAlign: "center", color: "#666", maxWidth: "600px", margin: "0 auto" }}>
                Joining Acez University is now easier than ever. Follow these simple steps to become a part of our academic community.
              </p>
            </div>
            <div className="section-grid">
              <div className="feature-item">
                <div className="step-number">1</div>
                <h4>Register Online</h4>
                <p>Create an account through our online portal. Select whether you are a New Enrollee, Transferee, or an Old Student returning.</p>
              </div>
              <div className="feature-item">
                <div className="step-number">2</div>
                <h4>Select Subjects</h4>
                <p>Browse available sections and pick your schedule directly from your student dashboard. No more long lines.</p>
              </div>
              <div className="feature-item">
                <div className="step-number">3</div>
                <h4>Admin Approval</h4>
                <p>Wait for the university administration to review your profile and officially accept your enrollment request.</p>
              </div>
            </div>
          </section>

          {/* Academics Section */}
          <section id="academics" className="content-section">
            <div className="features-header">
              <h2>Academic Excellence</h2>
              <p style={{ textAlign: "center", color: "#666", maxWidth: "600px", margin: "0 auto" }}>
                Explore our robust programs and vibrant school life.
              </p>
            </div>
            <div className="section-grid">
              <div className="info-card" style={{ background: "#f8f9fa", borderLeftColor: "#007bff" }}>
                <h3 className="card-title" style={{ color: "#007bff" }}>Programs Offered</h3>
                <ul style={{ paddingLeft: "20px", color: "#333", lineHeight: "1.8" }}>
                  <li>BS Information Technology</li>
                  <li>BS Computer Science</li>
                  <li>BS Business Administration</li>
                  <li>BS Accountancy</li>
                  <li>BS Mechanical Engineering</li>
                </ul>
              </div>
              <div className="info-card" style={{ background: "#f8f9fa", borderLeftColor: "#28a745" }}>
                <h3 className="card-title" style={{ color: "#28a745" }}>Student Life</h3>
                <p style={{ color: "#333" }}>
                  At Acez University, learning goes beyond the four walls of the classroom. Engage in 50+ student organizations, participate in national hackathons, and enjoy our state-of-the-art campus facilities.
                </p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section style={{ marginTop: "100px" }}>
            <div className="features-header">
              <h2>Why Institutions Trust Us</h2>
            </div>
            <div className="section-grid">
              <div className="feature-item">
                <h4>Lightning Fast React Core</h4>
                <p>Experience zero lag with our website architecture, optimized for high traffic usage and latency reduction.</p>
              </div>
              <div className="feature-item">
                <h4>Robust Security</h4>
                <p>Our MIS ensures high quality service and undisrupted service across all servers.</p>
              </div>
              <div className="feature-item">
                <h4>Automated Payments</h4>
                <p>Integrated billing systems allow for instant tuition processing and immediate enrollment confirmation.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      {/* --- SITE FOOTER --- */}
      <footer className="site-footer">
        <div className="footer-top">
          {/* Brand Section */}
          <div className="footer-brand">
            <img src={universityLogo} className="footer-Logo"></img>
            <p>
              Education, Evolved. Empowering the next generation of global
              leaders through continuous innovation and rigorous training.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#about">About Us</a>
              </li>
              <li>
                <a href="#admissions">Admissions</a>
              </li>
              <li>
                <a href="#academics">Academics</a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <p>
              <span>📍</span> 123 University Ave, Pampanga
            </p>
            <p>
              <span>📞</span> (609) 791-3583
            </p>
            <p>
              <span>✉️</span> admissions@acez.edu.ph
            </p>

            {/* Optional: Add a Student Portal quick-link button here too */}
            <button
              className="footer-portal-btn"
              onClick={() => navigate("/login")}
            >
              Access Student Portal
            </button>
          </div>
        </div>

        {/* Copyright Banner */}
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Acez University. All rights
            reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default AboutPage;
