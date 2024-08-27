import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
const Home = () => {
  // function handleLogout{

  // }
  const location=useLocation();
  const navigate=useNavigate();
  const [auth,setAuth]=useState(false);
  const[message,setMessage]=useState('')
  const[name,setName]=useState('')
  axios.defaults.withCredentials=true;
  useEffect(()=>{
    axios.get('http://localhost:8081')
   .then(res=>{
    if(res.data.Status==="Success"){
      setAuth(true)
      setName(res.data.name)
    }else{
      setAuth(false)
      setMessage(res.data.Error)
    }
   })
   .then(err=>console.log(err));
  },[])
  const handleDelete = () => {
    axios.get('http://localhost:8081/logout')
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(false); 
          navigate('/logout');  
        } else {
          console.log("Logout failed:", res.data.Error);
        }
      })
      .catch(err => console.log(err));
  };
  return (
    <div>
      {auth ? (
        <div>
          <h3>You are authorized {name}</h3>
          <button onClick={handleDelete}>Logout</button>
        </div>
      ) : (
        <div>
          <h3>
            {message}
          </h3>
          <h3>Login Now</h3>
          <Link to="/login" >Login</Link></div>
      )}
    </div>
  );
};

export default Home;
