// Home.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  Container,
  WelcomeMessage,
  ServiceList,
  ServiceItem,
  Button,
  ErrorMessage,
  LoginPrompt,
} from "./StyledComponent";
import logo from "../../Assets/logo.jpg"; // Adjust the path as per your directory structure

const LandingPage = () => {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [customerDetails, setCustomerDetails] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract customer_id from query parameters
  const queryParams = new URLSearchParams(location.search);
  const customer_id = queryParams.get("customer_id");

  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Fetch the authentication status and user details
    axios
      .get("http://localhost:8081")
      .then((res) => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);

          // Fetch customer-specific data using the customer_id
          if (customer_id) {
            axios
              .get(`http://localhost:8081/customer/${customer_id}`)
              .then((customerRes) => {
                if (customerRes.data) {
                  setCustomerDetails(customerRes.data);
                }
              })
              .catch((err) =>
                console.log("Error fetching customer details:", err)
              );
          }
        } else {
          setAuth(false);
          setMessage(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, [customer_id]);

  const handleLogout = () => {
    axios
      .get("http://localhost:8081/logout")
      .then((res) => {
        if (res.data.Status === "Success") {
          setAuth(false);
          navigate("/logout");
        } else {
          console.log("Logout failed:", res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleEnrollService = () => {
    navigate(`/enroll-service?customer_id=${customer_id}`);
  };

  const handleConfigureService = () => {
    navigate(`/configure-service?customer_id=${customer_id}`);
  };

  const handleTerminateService = () => {
    navigate(`/terminate-service?customer_id=${customer_id}`);
  };

  return (
    <Container>
      {auth ? (
        <div>
          <WelcomeMessage>Welcome, {name}</WelcomeMessage>
          {customerDetails ? (
            <ServiceList>
              <h4>Your Services</h4>
              {customerDetails.services_enrolled &&
              customerDetails.services_enrolled.length > 0 ? (
                customerDetails.services_enrolled.map((service) => (
                  <ServiceItem key={service.service_name}>
                    <h5>{service.service_name}</h5>
                    <p>Plan: {service.plan}</p>{" "}
                    {/* Use plan_name instead of plan */}
                    <p>Features: {service.features}</p>
                  </ServiceItem>
                ))
              ) : (
                <p>No services enrolled.</p>
              )}
            </ServiceList>
          ) : (
            <p>Loading customer details...</p>
          )}
          <Button onClick={handleEnrollService}>Enroll in a Service</Button>
          <Button onClick={handleConfigureService}>Configure Services</Button>
          <Button onClick={handleTerminateService}>Terminate a Service</Button>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      ) : (
        <div>
          <ErrorMessage>{message}</ErrorMessage>
          <Link to="/login"> <LoginPrompt>
           
            <img src={logo} alt="SPS Logo" style={{ width: '100px', height: '100px' }} /> {/* Image instead of text */}
          </LoginPrompt></Link>
        </div>
      )}
    </Container>
  );
};

export default LandingPage;
