import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Login = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

const navigate=useNavigate()
axios.defaults.withCredentials=true;
  const handleSubmit = (event) => {
    event.preventDefault();
   axios.post('http://localhost:8081/login',formData)
   .then(res=>{
    if(res.data.Status==="Success"){
navigate('/')
    }else{
      alert(res.data.Error);
    }
   })
   .then(err=>console.log(err));
  };
  return (
    <form onSubmit={handleSubmit}>
  

  <div>
        <label>Email:</label>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={e=>setFormData({...formData,email:e.target.value})} 
          required 
        />
      </div>

      <div>
        <label>Password:</label>
        <input 
          type="password" 
          name="password" 
          value={formData.password} 
          onChange={e=>setFormData({...formData,password:e.target.value})} 
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
