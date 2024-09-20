// // Home.js
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useLocation } from "react-router-dom";
// import {
//   Container,
//   WelcomeMessage,
//   ServiceList,
//   ServiceItem,
//   Button,
//   ErrorMessage,
//   LoginPrompt,
//   AuthContainer
// } from "./StyledComponent";
// import logo from "../../Assets/logo.jpg"; // Adjust the path as per your directory structure

// const LandingPage = () => {
//   const [auth, setAuth] = useState(false);
//   const [message, setMessage] = useState("");
//   const [name, setName] = useState("");
//   const [customerDetails, setCustomerDetails] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Extract customer_id from query parameters
//   const queryParams = new URLSearchParams(location.search);
//   const customer_id = queryParams.get("customer_id");

//   axios.defaults.withCredentials = true;

//   useEffect(() => {
//     // Fetch the authentication status and user details
//     axios
//       .get("http://localhost:8081")
//       .then((res) => {console.log(res.data)
//         if (res.data.Status === "Success") {
//           setAuth(true);
//           setName(res.data.name);

//           // Fetch customer-specific data using the customer_id
//           if (customer_id) {
//             axios
//               .get(`http://localhost:8081/customer/${customer_id}`)
//               .then((customerRes) => {
//                 if (customerRes.data) {
//                   setCustomerDetails(customerRes.data);
//                 }
//               })
//               .catch((err) =>
//                 console.log("Error fetching customer details:", err)
//               );
//           }
//         } else {
//           setAuth(false);
//           setMessage(res.data.Error);
//         }
//       })
//       .catch((err) => console.log(err));
//   }, [customer_id]);

//   const handleLogout = () => {
//     axios
//       .get("http://localhost:8081/logout")
//       .then((res) => {
//         if (res.data.Status === "Success") {
//           setAuth(false);
//           navigate("/logout");
//         } else {
//           console.log("Logout failed:", res.data.Error);
//         }
//       })
//       .catch((err) => console.log(err));
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
//     <>
   
//       {auth ? (
//          <AuthContainer>
        
//           <WelcomeMessage>Welcome, {name}</WelcomeMessage>
//           <Button onClick={handleLogout}>Logout</Button>
//           {customerDetails ? (
//             <ServiceList>
//               <h4>Your Services</h4>
//               {customerDetails.services_enrolled &&
//               customerDetails.services_enrolled.length > 0 ? (
//                 customerDetails.services_enrolled.map((service) => (
//                   <ServiceItem key={service.service_name}>
//                     <h5>{service.service_name}</h5>
//                     <p>Plan: {service.plan}</p>{" "}
//                     {/* Use plan_name instead of plan */}
//                     <p>Features: {service.features}</p>
//                   </ServiceItem>
//                 ))
//               ) : (
//                 <p>No services enrolled.</p>
//               )}
//             </ServiceList>
//           ) : (
//             <p>Loading customer details...</p>
//           )}
//           <Button onClick={handleEnrollService}>Enroll in a Service</Button>
//           <Button onClick={handleConfigureService}>Configure Services</Button>
//           <Button onClick={handleTerminateService}>Terminate a Service</Button>
        
//         </AuthContainer>
        
//       ) : (
//       <Container>
//         <div>
//           <ErrorMessage>{message}</ErrorMessage>
//           <Link to="/login"> <LoginPrompt>
           
//             <img src={logo} alt="SPS Logo" style={{ width: '100px', height: '100px' }} /> {/* Image instead of text */}
//           </LoginPrompt></Link>
//         </div>
//         </Container>
//       )}
    
//    </>
//   );
// };

// export default LandingPage;


import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import logo from "../../Authentication/logo.png";
import {
  Dropdown,
  Container,
  Carousel,
} from "react-bootstrap";
import avatar from "../../Assets/avatar.png"; 
import banner from "../../Assets/banner.png"
import enroll_logo from "../../Assets/enroll_logo.png"
import "./LandingPage.css"; 
import Sidebar from "./Sidebar";
import Configuresidebar from "./ConfigureSidebar";

const LandingPage = () => {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [customerDetails, setCustomerDetails] = useState(null);
  const [availableServices, setAvailableServices] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedService, setSelectedService] = useState(null); // State for selected service
  const [plans, setPlans] = useState([]); // Available plans for the selected service
  const [showSidebar, setShowSidebar] = useState(false); 
  const [highlightedCard, setHighlightedCard] = useState(null);
  const serviceCardsRef = useRef([]);
  const serviceCardsContainerRef = useRef(null);
  const servicesSectionRef = useRef(null);
  const ConfigSectionRef = useRef(null);
  const [ConfigsidebarOpen, setConfigSidebarOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  


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


          axios
              .get(`http://localhost:8081/services`)
              .then((services) => {
                if (services.data) {
                  setAvailableServices(services.data);
                }
              })
              .catch((err) =>
                console.log("Error fetching customer details:", err)
              );

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

      axios.get(`http://localhost:8081/requests/${customer_id}`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setRequests(res.data);
        } else {
          console.error("Expected an array, but got:", res.data);
          setRequests(["No pending requets found"]);
        }
      })
      .catch(err => console.error("Error fetching service requests:", err));


  }, [customer_id]);

  useEffect(() => {
  
    // Function to determine which card is in the center
    const handleScroll = () => {
      // const container = document.querySelector(".service-cards");

      const container = document.querySelector(".service-cards");
      const containerWidth = container.offsetWidth;
      const containerCenter = containerWidth / 2;


      let closestCard = null;
      let closestDistance = Infinity;

      serviceCardsRef.current.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;

        const distance = Math.abs(cardCenter - containerCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestCard = card;
        }
      });

      // Remove the highlight from all cards and add it to the closest one
      serviceCardsRef.current.forEach((card) => {
        card.classList.remove("highlighted");
      });

      if (closestCard) {
        closestCard.classList.add("highlighted");
      }

    
    };

    // Listen for scroll events on the service cards container
    // const serviceCardsContainer = document.querySelector(".service-cards");
    const serviceCardsContainer = document.querySelector(".service-cards");
    if (serviceCardsContainer) {
      serviceCardsContainer.addEventListener("scroll", handleScroll);
    }


    // Cleanup the event listener on component unmount
    return () => {
      if(serviceCardsContainer)
      serviceCardsContainer.removeEventListener("scroll", handleScroll);
    };
  }, [availableServices]);

  

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

  const handleEnrollService = (service) => {
    setSelectedService(service); // Set the selected service
    setShowSidebar(true);
     // Show the sidebar
  };


  const handleEnrollPage = () => {
    // Scroll to the "Find the best Services" section
    servicesSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleConfigureService = () => {
    ConfigSectionRef.current.scrollIntoView({ behavior: "smooth" });

    // navigate(`/configure-service?customer_id=${customer_id}`);
  };

  const handleTerminateService = () => {
    ConfigSectionRef.current.scrollIntoView({ behavior: "smooth" });

    // navigate(`/terminate-service?customer_id=${customer_id}`);
  };

  // Fetch plans for the selected service
  const fetchPlans = (serviceId) => {
    axios
      .get(`http://localhost:8081/plans?service_id=${serviceId}`)
      .then((res) => setPlans(res.data))
      .catch((err) => console.log(err));
  };

  const handleSettingsClick = (service) => {
    setSelectedService(service);
    setConfigSidebarOpen(true);
  };

  const closeSidebar = () => {
    setConfigSidebarOpen(false);
    setSelectedService(null);
  };

  // const handleEnrollService = (event) => {
  //   // navigate(`/enroll-service?customer_id=${customer_id}`);
  //   event.preventDefault();
  //   const customer_id = new URLSearchParams(window.location.search).get("customer_id");

  //   const newService = {
  //     customer_id: customer_id,
  //     service_id: selectedService.id,
  //     plan: event.target.plan.value,
  //     request_type: "creation",
  // };

//   axios
//   .post("http://localhost:8081/requests", newService)
//   .then((res) => {
//     if (res.data.Status === "Success") {
//       alert("Request sent successfully! Awaiting admin approval.");
//       setSidebarOpen(false); // Close sidebar after submission
//     } else {
//       alert("Failed to send request.");
//     }
//   })
//   .catch((err) => console.log("Error sending request:", err));
// };

  return (
    <>
      {/* Navbar */}
      <nav className="custom-navbar">
        <div className="navbar-container">
          <div className="navbar-left">
          <img src={logo} alt="Company Logo" className="landing-logo" />
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li className="nav-item dropdown">
        <Dropdown>
          <Dropdown.Toggle as="button" className="nav-link">
            Services <i className="bi bi-caret-down"></i> {/* Dropdown icon */}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item as="button" onClick={handleEnrollPage}>
              Enroll in a Service
            </Dropdown.Item>
            <Dropdown.Item as="button" onClick={handleConfigureService}>
              Configure a Service
            </Dropdown.Item>
            <Dropdown.Item as="button" onClick={handleTerminateService}>
              Terminate a Service
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </li>
            <li><Link to="/aboutus">About</Link></li>
            <li><Link to="/contactus">Contact</Link></li>
          </ul>
          </div>
          <Dropdown>
            <Dropdown.Toggle as="img" src={avatar} alt="Avatar" roundedCircle style={{ width: "40px", cursor: "pointer" }} />
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              <Dropdown.Item onClick={handleConfigureService}>My Services</Dropdown.Item>
              <Dropdown.Item href="/contactus">Help</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </nav>

      {/* Image Slider */}
      <Container fluid className="mt-3">
        <Carousel interval={2000} className="custom-carousel">
          <Carousel.Item>
            <img className="d-block w-100" src={banner} alt="First slide" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src="https://www.myvi.in/content/dam/vodafoneideadigital/StaticPages/consumerimages/Enterprise/5G_Enterprise/5g_desktop_webherobanner.png" alt="Second slide" />
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src="https://www.myvi.in/content/dam/vodafoneideadigital/consumerblog/Giganet_Banner_Desktop_1024x336px.png" alt="Third slide" />
          </Carousel.Item>
        </Carousel>
      </Container>


      {/* <Container> */}
      <div ref={servicesSectionRef}  className="available-services">
        <h4>Find the best Services</h4>
        <div className="service-cards">
          {/* Dummy card at the beginning */}
          <div className="dummy-card" />

          {/* Actual service cards */}
          {availableServices.length > 0
            ? availableServices.map((service, index) => (
                <div
                  key={service.service_name}
                  ref={(el) => (serviceCardsRef.current[index] = el)}
                  className="customer-service-card"
                >
                  <img
                    src={enroll_logo}
                    alt={service.service_name}
                  />
                  <h5>{service.service_name}</h5>
                  <button className="enroll-btn" onClick={() => handleEnrollService(service)}>Enroll</button>
                </div>
              ))
            : "Loading services..."}

          {/* Dummy card at the end */}
          <div className="dummy-card" />
        </div>
      </div>
    {/* </Container> */}


    {showSidebar && (
        <Sidebar
          service={selectedService}
          customerId={customer_id}
          closeSidebar={() => setShowSidebar(false)} // Close the sidebar when needed
        />
      )}


      {/* Customer's Services */}
      <div ref = {ConfigSectionRef}>
      <div className="customer-services">
        <h4>Your Services</h4>
        <div className="service-cards">
          {customerDetails && customerDetails.services_enrolled.length > 0
            ? customerDetails.services_enrolled.map((service) => (
                <div key={service.service_name} className="customer-plan-card">
                  <h5 className="service-name">{service.service_name}</h5>
                  <span className={`plan-name ${service.plan.toLowerCase()}`}>
            {service.plan}
          </span>
          <p className="features">
            Features: {service.features}
          </p>
          <button className="enroll-btn" onClick={() => handleSettingsClick(service)}>
                  Settings
                </button>

                </div>
              ))
            :  (
              <div className="customer-plan-card" style={{width: '50%'}}>
                  <h5 className="service-name">No Services Availed</h5>
                   
                </div>
            )}
        </div>
      </div>
      </div>

      {ConfigsidebarOpen && (
        <Configuresidebar
          customerId={customer_id}
          service={selectedService}
          closeSidebar={closeSidebar}
        />
      )}

<div  className="customer-services">
  <h4>Your Requests</h4>
  <div className="service-cards">
    {requests ? (
      Array.isArray(requests) && requests.length > 0 ? (
        requests.map((request) => (
          <div key={request.id} className="customer-plan-card">
            <h5 className="service-name">{request.service_name}</h5>
            <span className={`plan-name ${request.plan.toLowerCase()}`}>
              {request.plan}
            </span>
            <p className="status">
              Request: {request.request_type}
            </p>
            <p className="status">
              Status: {request.status}
            </p>
          </div>
        ))
      ) : (
        <div className="customer-plan-card" style={{width: '50%'}}>
                  <h5 className="service-name">No Requests Pending</h5>
                   
                </div>
      )
    ) : (
      <p>Loading customer details...</p>
    )}
  </div>
</div>

    </>
  );
};


export default LandingPage;
