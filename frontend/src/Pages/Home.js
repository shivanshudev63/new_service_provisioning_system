import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Home = () => {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [customerDetails, setCustomerDetails] = useState(null);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:8081')
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);

          // Fetch customer-specific data if the user is a customer
          axios.get(`http://localhost:8081/customer/${res.data.customer_id}`)
            .then(customerRes => {
              if (customerRes.data) {
                setCustomerDetails(customerRes.data);
              }
            })
            .catch(err => console.log("Error fetching customer details:", err));
        } else {
          setAuth(false);
          setMessage(res.data.Error);
        }
      })
      .catch(err => console.log(err));
  }, []);

  const handleLogout = () => {
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
          <h3>Welcome, {name}</h3>
          {customerDetails && (
            <div>
              <h4>Your Services</h4>
              {customerDetails.services_enrolled.map(service => (
                <div key={service.service_name}>
                  <h5>{service.service_name}</h5>
                  <p>Plan: {service.plan}</p>
                  <p>Features: {service.features}</p>
                </div>
              ))}
            </div>
          )}
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h3>{message}</h3>
          <h3>Login Now</h3>
          <Link to="/login">Login</Link>
        </div>
      )}
    </div>
  );
};

export default Home;
