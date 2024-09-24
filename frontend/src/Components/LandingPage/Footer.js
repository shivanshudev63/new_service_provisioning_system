import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css"; // Custom CSS for styling
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section company-info">
          <h5>The Future telecom</h5>
          <p>
            1234 Street Name, Bengaluru, Karnataka, 12345
          </p>
          <p>Email: futuretelecom@company.com</p>
          <p>Phone: +1 (800) 123-4567</p>
        </div>

        <div className="footer-section quick-links">
          <h5>Quick Links</h5>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/">Services</Link></li>
            <li><Link to="/aboutus">About Us</Link></li>
            <li><Link to="/contactus">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-section social-media">
          <h5>Follow Us</h5>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Company Name. All Rights Reserved.</p>
        <p><Link to="/privacy-policy">Privacy Policy</Link> | <Link to="/terms-of-service">Terms of Service</Link></p>
      </div>
    </footer>
  );
};

export default Footer;
