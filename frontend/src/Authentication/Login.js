import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
            navigate('/adminhome'); // Redirect to admin home page
          } else {
            
            navigate(`/?customer_id=${res.data.id}`); // Redirect to customer home page
          }
        } else {
          alert(res.data.Error);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        />
      </div>
      <div>
        <label>Password:</label>
        <input 
          type="password" 
          name="password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
        />
      </div>
      <button type="submit">Login</button>
      <Link to="/register">
        <button>Create Account</button>
      </Link>
    </form>
  );
};

export default Login;
