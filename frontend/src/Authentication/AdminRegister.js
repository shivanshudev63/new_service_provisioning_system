import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'

const Register = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: ''
//   });


// const navigate=useNavigate()
//   const handleSubmit = (event) => {
//     event.preventDefault();
//     // Handle form submission logic here, e.g., send data to an API
//    axios.post('http://localhost:8081/register',formData)
//    .then(res=>{
//     if(res.data.Status==="Success"){
// navigate('/adminlogin')
//     }else{
//       alert("Error");
//     }
//    })
//    .then(err=>console.log(err));
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label>Name:</label>
//         <input 
//           type="text" 
//           name="name" 
//           value={formData.name} 
//           onChange={e=>setFormData({...formData,name:e.target.value})} 
//           required 
//         />
//       </div>

//       <div>
//         <label>Email:</label>
//         <input 
//           type="email" 
//           name="email" 
//           value={formData.email} 
//           onChange={e=>setFormData({...formData,email:e.target.value})} 
//           required 
//         />
//       </div>

//       <div>
//         <label>Password:</label>
//         <input 
//           type="password" 
//           name="password" 
//           value={formData.password} 
//           onChange={e=>setFormData({...formData,password:e.target.value})} 
//           required 
//         />
//       </div>

//       <button type="submit">Register</button>
//       <Link to="/login">
//         <button>Already have an account? Login</button>
//       </Link>
//     </form>
//   );
};

export default Register;
