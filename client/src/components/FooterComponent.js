import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "../style/FooterComponent.css"; // Import external CSS

const FooterComponent = () => {
  return (
    <footer className="footer" style={{ backgroundColor: "#2D2525" }}>
      <div className="footer-container">
        {/* Logo and Description */}
        <div className="footer-section">
          <h4 className="footer-title">BookaCourt</h4>
          <p className="footer-text">
            Your one-stop platform for booking the best sports turfs near you!
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links">
            <li>
              <a href="/home">🏠 Home</a>
            </li>
            <li>
              <a href="/about">ℹ️ About Us</a>
            </li>
            <li>
              <a href="/turfs">⚽ Turfs</a>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="footer-section">
          <h4 className="footer-title">Contact Us</h4>
          <p>
            <FaMapMarkerAlt /> 123 Turf Street, Pune, India
          </p>
          <p>
            <FaPhone /> +91 98765 43210
          </p>
          <p>
            <FaEnvelope /> support@bookaCourt.com
          </p>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h4 className="footer-title">Follow Us</h4>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="footer-bottom">
        <p>© 2025 BookaCourt. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default FooterComponent;
