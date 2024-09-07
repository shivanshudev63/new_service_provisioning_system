import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';  // Added CSS import
import companyLogo from './logo.png';  // Assuming you have the logo in the correct directory
import '@fortawesome/fontawesome-free/css/all.min.css';  // For FontAwesome icons

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8081/login', formData)
      .then(res => {
        console.log(res.data)
        if (res.data.Status === "Success") {
          if (res.data.role === 'admin') {
            navigate('/adminhome');  // Redirect to admin home page
          } else {
            navigate(`/?customer_id=${res.data.id}`);  // Redirect to customer home page
          }
        } else {
          alert(res.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="login-container">
      <div className="logo-container">
        <img src={companyLogo} alt="Logo" className="logo" />
        <h1 className="title">The Future Telecom</h1>
      </div>
      
      <div className="login-box">
        <h2>User Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <i className="fas fa-user input-icon"></i>  {/* FontAwesome user icon */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <i className="fas fa-lock input-icon"></i>  {/* FontAwesome lock icon */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="submit-button">Login</button>
        </form>
        <Link to="/register" className="create-account-link">
          <button className="create-account-button">Create Account</button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
