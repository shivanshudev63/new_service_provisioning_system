import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';  // Import the CSS file for styling
import companyLogo from './logo.png';  // Import the company logo
import '@fortawesome/fontawesome-free/css/all.min.css';  // For FontAwesome icons

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role:'customer'
  });
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here brother
    if (!passwordRegex.test(formData.password)) {
      alert("Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character, and be at least 6 characters long.");
      return;
    }
  
    axios.post('http://54.175.148.241:8081/register', formData)
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
          <div className="register-form-group">
            {/* <label>Name:</label> */}
            <i className="fas fa-user input-icon"></i> {/* FontAwesome user icon */}
             
            <input 
              type="text" 
              placeholder='Name'
              name="name" 
              value={formData.name} 
               className="form-input"
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
              required 
            />
          </div>

          <div className="register-form-group">
          <i class="fa-solid fa-envelope input-icon"></i>

            <input 
              type="email" 
              placeholder='Email'
              name="email" 
              value={formData.email}
              className="form-input" 
              onChange={e => setFormData({ ...formData, email: e.target.value })} 
              required 
            />
          </div>

          <div className="register-form-group">
          
            <i className="fas fa-lock input-icon"></i>  {/* FontAwesome lock icon */}

            <input 
              type="password" 
              placeholder='Password'
              name="password" 
              value={formData.password} 
               className="form-input"
              onChange={e => setFormData({ ...formData, password: e.target.value })} 
              required 
            />
          </div>

          <button type="submit" className="register-button">Register</button>
          <Link to="/login">
            <button className="login-button">Have an account? Login</button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
