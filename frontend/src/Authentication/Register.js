import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';  // Import the CSS file for styling
import companyLogo from './logo.png';  // Import the company logo

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if the password is exactly 6 digits
    const passwordRegex = /^\d{6}$/;
    if (!passwordRegex.test(formData.password)) {
      alert("Password must be exactly 6 digits.");
      return;
    }

    // Handle form submission logic here, e.g., send data to an API
    axios.post('http://localhost:8081/register', formData)
      .then(res => {
        if (res.data.Status === "Success") {
          navigate('/login');
        } else {
          alert("Error");
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="register-container">
      <div className="logo-container">
        <img src={companyLogo} alt="Logo" className="logo" />
        <h1 className="title">The Future Telecom</h1>
      </div>
      <div className="register-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label>Name:</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={e => setFormData({ ...formData, email: e.target.value })} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={e => setFormData({ ...formData, password: e.target.value })} 
              required 
            />
          </div>

          <button type="submit" className="register-button">Register</button>
          <Link to="/login">
            <button className="login-button">Already have an account? Login</button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
