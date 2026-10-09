import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <img 
              src="/assets/logo-image.jpeg" 
              alt="Riddhi Siddhi" 
              className="h-12 w-12 rounded-full object-cover border-2 shadow-md"
              style={{ borderColor: '#E9B94C' }}
            />
            <div>
              <h3>Riddhi Siddhi Modak Farsan</h3>
              <p className="footer-tagline">Shuddh Swad, Hamari Pehchaan</p>
            </div>
          </div>
          <p className="footer-desc">
            Authentic Maharashtrian namkeen, farsan and sweets made with traditional recipes 
            and the finest ingredients. Delivering taste and quality since our establishment.
          </p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <a href="/">Home</a>
          <a href="/category/dry">Dry Items</a>
          <a href="/category/sweet">Sweet Items</a>
          <a href="/category/wet">Fresh Sweets</a>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <p>165/2A, Saket Nagar, Bhopal<br/>Near AIIMS, In Front of Bhopal Public School</p>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <p>
              <a href="tel:7974613110">7974613110</a> / <a href="tel:9893378872">9893378872</a>
            </p>
          </div>
          <div className="contact-item">
            <span className="contact-icon">🕐</span>
            <p>Mon - Sat: 9:00 AM - 9:00 PM<br/>Sunday: 10:00 AM - 6:00 PM</p>
          </div>
        </div>

        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#" className="social-icon" title="Facebook">📘</a>
            <a href="#" className="social-icon" title="Instagram">📸</a>
            <a href="#" className="social-icon" title="WhatsApp">💬</a>
            <a href="#" className="social-icon" title="YouTube">▶️</a>
          </div>
          <div className="footer-fssai">
            <small>FSSAI: Pending Registration</small>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} Riddhi Siddhi Modak Farsan. All rights reserved.</p>
        <p className="footer-credit">Made with ❤️ in Bhopal</p>
      </div>
    </footer>
  );
}

export default Footer;

