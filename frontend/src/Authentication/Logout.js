import React from 'react';
import { Link } from 'react-router-dom';
import './Logout.css';  // Importing the CSS file for styling
import companyLogo from './logo.png';  // Importing the company logo

const Logout = () => {
  return (
    <div className="logout-container">
      <div className="logo-container">
        <img src={companyLogo} alt="Logo" className="logo" />
        <h1 className="title">The Future Telecom</h1>
      </div>
      <div className="logout-box">
        <h2>You were logged out</h2>
        <p>Kindly login again.</p>
        <Link to="/login">
          <button className="logout-button">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Logout;
