import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/about.css";

// --- SWIPER IMPORTS ---
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
// Swiper specific CSS
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

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
      <header className="about-welcome-section">
        <div className="header-left">
          <img src={logo2} className="about-Logo"></img>
        </div>
        <div className="header-right">
          <button className="portal-SignIn" onClick={studentPortal}>
            Student Portal
          </button>
        </div>
      </header>
      {/* --- SWIPER CAROUSEL --- */}
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
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
              capable through continuous innovation and rigorous training, born
              to strive and set the bar high! We exhibit our commitment by
              providing an exemplary online enrollment for our prospect
              students.
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
                  Experience zero lag with our website architecture, optimized
                  for high traffic usage and latency reduction.
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
                  Integrated billing systems allow for instant tuition
                  processing and immediate enrollment confirmation.
                </p>
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
