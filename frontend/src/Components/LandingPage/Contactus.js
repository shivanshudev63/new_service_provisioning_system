import React from 'react';
import './LandingPage.css';

const ContactPage = () => {
  return (
    <div style={{background: 'rgba(223, 235, 247, 0.715)' }}>
    <div className="contactus-container">
      <h1 className="contactus-heading">Contact Us</h1>
      <p className="contactus-description">
        Have a question or need assistance? Reach out to us through the following methods, and our team will be happy to help.
      </p>

      <div className="contactus-details">
        <div className="contactus-item">
          <h3 className="contactus-item-heading">Customer Service</h3>
          <p>Email: <a href="mailto:support@telecomservices.com" className="contactus-link">support@telecomservices.com</a></p>
          <p>Phone: <a href="tel:+1234567890" className="contactus-link">+1 (234) 567-890</a></p>
          <p>Hours: Monday - Friday, 9:00 AM - 6:00 PM (EST)</p>
        </div>

        <div className="contactus-item">
          <h3 className="contactus-item-heading">Technical Support</h3>
          <p>Email: <a href="mailto:techsupport@telecomservices.com" className="contactus-link">techsupport@telecomservices.com</a></p>
          <p>Phone: <a href="tel:+1987654321" className="contactus-link">+1 (987) 654-321</a></p>
          <p>Available 24/7 for technical issues</p>
        </div>

        <div className="contactus-item">
          <h3 className="contactus-item-heading">Corporate Office</h3>
          <p>Telecom Services, Inc.</p>
          <p>123 Telecom Lane</p>
          <p>Cityville, ST 12345</p>
          <p>Phone: <a href="tel:+1123456789" className="contactus-link">+1 (123) 456-789</a></p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ContactPage;
