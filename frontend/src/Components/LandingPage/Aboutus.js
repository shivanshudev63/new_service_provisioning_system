import React from 'react';
import './LandingPage.css';
import companyLogo from '../../Authentication/logo.png'; // Replace with your actual logo path
import teamImage from '../../Assets/avatar.png'; // Replace with your actual team image path

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <header className="about-header">
        <img src={companyLogo} alt="Company Logo" className="about-logo" />
        <h1>About Our Company</h1>
        <p>
          Leading the future of telecom services by providing seamless and reliable solutions for all your telecom needs.
        </p>
      </header>

      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          At Telecom Servicing System, our mission is to revolutionize the telecom industry by delivering cutting-edge services 
          that enhance connectivity, simplify operations, and drive innovation. We are committed to providing top-notch customer
          experiences by tailoring our services to meet the unique needs of each client.
        </p>
      </section>

      <section className="about-values">
        <h2>Our Core Values</h2>
        <div className="values-container">
          <div className="value-item">
            <h3>Innovation</h3>
            <p>
              We constantly push the boundaries of what's possible to deliver the most advanced and efficient telecom services available.
            </p>
          </div>
          <div className="value-item">
            <h3>Reliability</h3>
            <p>
              We ensure our customers experience uninterrupted service, backed by our dedicated support team available 24/7.
            </p>
          </div>
          <div className="value-item">
            <h3>Customer First</h3>
            <p>
              Every decision we make is centered around delivering the best possible experience to our customers.
            </p>
          </div>
        </div>
      </section>

      <section className="about-team">
        <h2>Meet Our Team</h2>
        <p>
          Our expert team consists of industry veterans and young innovators who are passionate about making telecom services smarter and simpler.
        </p>
      </section>

      <section className="about-contact">
        <h2>Contact Us</h2>
        <p>
          Have any questions or need assistance? Our team is here to help. Reach out to us anytime!
        </p>
        <div className="contact-info">
          <p><strong>Email:</strong> support@telecomservices.com</p>
          <p><strong>Phone:</strong> +1 800 123 4567</p>
          <p><strong>Address:</strong> 1234 Telecom Way, Bangalore City,  575001</p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
