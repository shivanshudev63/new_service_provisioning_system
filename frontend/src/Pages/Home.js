// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from 'axios';
// import { useLocation } from "react-router-dom";

// const Home = () => {
//   const [auth, setAuth] = useState(false);
//   const [message, setMessage] = useState('');
//   const [name, setName] = useState('');
//   const [customerDetails, setCustomerDetails] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Extract customer_id from query parameters
//   const queryParams = new URLSearchParams(location.search);
//   const customer_id = queryParams.get('customer_id');

//   axios.defaults.withCredentials = true;

//   useEffect(() => {
//     // Fetch the authentication status and user details
//     axios.get('http://54.175.148.241:8081')
//       .then(res => {
//         if (res.data.Status === "Success") {
//           setAuth(true);
//           setName(res.data.name);

//           // Fetch customer-specific data using the customer_id
//           if (customer_id) {
//             axios.get(`http://54.175.148.241:8081/customer/${customer_id}`)
//               .then(customerRes => {
//                 if (customerRes.data) {
//                   setCustomerDetails(customerRes.data);
//                 }
//               })
//               .catch(err => console.log("Error fetching customer details:", err));
//           }
//         } else {
//           setAuth(false);
//           setMessage(res.data.Error);
//         }
//       })
//       .catch(err => console.log(err));
//   }, [customer_id]);
  
//   const handleLogout = () => {
//     axios.get('http://54.175.148.241:8081/logout')
//       .then(res => {
//         if (res.data.Status === "Success") {
//           setAuth(false);
//           navigate('/logout');
//         } else {
//           console.log("Logout failed:", res.data.Error);
//         }
//       })
//       .catch(err => console.log(err));
//   };

//   const handleEnrollService = () => {
//     navigate(`/enroll-service?customer_id=${customer_id}`);
//   };
  
//   const handleConfigureService = () => {
//     navigate(`/configure-service?customer_id=${customer_id}`);
//   };
  
//   const handleTerminateService = () => {
//     navigate(`/terminate-service?customer_id=${customer_id}`);
//   };

//   return (
//     <div>
//       {auth ? (
//         <div>
//           <h3>Welcome, {name}</h3>
//           {customerDetails ? (
//             <div>
//               <h4>Your Services</h4>
//               {customerDetails.services_enrolled && customerDetails.services_enrolled.length > 0 ? (
//                 customerDetails.services_enrolled.map(service => (
//                   <div key={service.service_name}>
//                     <h5>{service.service_name}</h5>
//                     <p>Plan: {service.plan}</p> {/* Use plan_name instead of plan */}
//                     <p>Features: {service.features}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p>No services enrolled.</p>
//               )}
//             </div>
//           ) : (
//             <p>Loading customer details...</p>
//           )}
//           <button onClick={handleEnrollService}>Enroll in a Service</button>
//           <button onClick={handleConfigureService}>Configure Services</button>
//           <button onClick={handleTerminateService}>Terminate a Service</button>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       ) : (
//         <div>
//           <h3>{message}</h3>
//           <h3>Login Now</h3>
//           <Link to="/login">Login</Link>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;
import React from "react";
import LandingPage from '../Components/LandingPage/LandingPage'

function Home() {
  return (
    <LandingPage />
  )
}

export default Home