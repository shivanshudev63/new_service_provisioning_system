

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
import Footer from "./Footer";
import Configuresidebar from "./ConfigureSidebar";
import pic1 from "../../Assets/1.png"
import pic2 from "../../Assets/2.jpg"
import pic3 from "../../Assets/3.png"
import pic4 from "../../Assets/4.png"
import pic5 from "../../Assets/5.png"
import pic6 from "../../Assets/6.jpg"
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
  const [filteredServices, setFilteredServices] = useState([]);  


  // Extract customer_id from query parameters
  const queryParams = new URLSearchParams(location.search);
  const customer_id = queryParams.get("customer_id");

  axios.defaults.withCredentials = true;

  useEffect ( () => {
    axios
              .get(`http://44.202.105.5:8081/services`)
              .then((services) => {
                if (services.data) {
                  setAvailableServices(services.data);
                  
                }
              })
              .catch((err) =>
                console.log("Error fetching customer details:", err)
              );
  },[])

  useEffect(() => {
    // Fetch the authentication status and user details
     

    axios
      .get("http://44.202.105.5:8081")
      .then((res) => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);


          axios
              .get(`http://44.202.105.5:8081/services`)
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
              .get(`http://44.202.105.5:8081/customer/${customer_id}`)
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

      axios.get(`http://44.202.105.5:8081/requests/${customer_id}`)
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
    // When available services and customer details are fetched, filter out the services already enrolled by the customer
    if (availableServices.length > 0 && customerDetails?.services_enrolled?.length > 0) {
      const enrolledServiceNames = customerDetails.services_enrolled.map(service => service.service_name);
      const filtered = availableServices.filter(service => !enrolledServiceNames.includes(service.service_name));

      setFilteredServices(filtered);
      console.log(filtered);
    } else {
      // If no customer services, show all available services
     setFilteredServices(availableServices);
    }
  }, [availableServices, customerDetails]);

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
        if (card) { // Check if card is not null
          const cardRect = card.getBoundingClientRect();
          const cardCenter = cardRect.left + cardRect.width / 2;
    
          const distance = Math.abs(cardCenter - containerCenter);
    
          if (distance < closestDistance) {
            closestDistance = distance;
            closestCard = card;
          }
        }
      });

      // Remove the highlight from all cards and add it to the closest one
      serviceCardsRef.current.forEach((card) => {
        if (card) { // Check if card is not null
          card.classList.remove("highlighted");
        }
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
      .get("http://44.202.105.5:8081/logout")
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
    if(customerDetails){
    setSelectedService(service); // Set the selected service
    setShowSidebar(true);}
    else{
      navigate("/login");
    }
     // Show the sidebar
  };

  const handleLogin = () => {
    navigate("/login");
  }


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
      .get(`http://44.202.105.5:8081/plans?service_id=${serviceId}`)
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
//   .post("http://44.202.105.5:8081/requests", newService)
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
          <div className="avatar-container">
            { customerDetails ? 
            (
              <>
          <span className="avatar-customer-name">{customerDetails  ? customerDetails.name : "Login"}</span>
          <Dropdown>
            <Dropdown.Toggle as="img" src={avatar} alt="Avatar" roundedCircle style={{ width: "40px", cursor: "pointer" }} />
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              <Dropdown.Item onClick={handleConfigureService}>My Services</Dropdown.Item>
              <Dropdown.Item href="/contactus">Help</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          </>
            ): (
              <button className="login-btn" onClick={handleLogin}>Login</button>
            )}
          </div>
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
          {customerDetails ? (
            filteredServices.length > 0 ? (
             filteredServices.map((service, index) => (
               <div
                 key={service.service_name}
                 ref={(el) => (serviceCardsRef.current[index] = el)}
                 className="customer-service-card"
               >
                 <img src={enroll_logo} alt={service.service_name} />
                 <h5>{service.service_name}</h5>
                 <button className="enroll-btn" onClick={() => handleEnrollService(service)}>Enroll</button>
               </div>
             ))
             ) : (
                       <div className="customer-plan-card" style={{width: '50%'}}>
                        <h5 className="service-name">All Services Availed!</h5>
                       </div>
                )
             ) : (
                    
                      availableServices.map((service, index) => (
                        <div
                        key={service.service_name}
                        ref={(el) => (serviceCardsRef.current[index] = el)}
                        className="customer-service-card"
                      >
                        <img src={enroll_logo} alt={service.service_name} />
                        <h5>{service.service_name}</h5>
                        <button className="enroll-btn" onClick={() => handleEnrollService(service)}>Enroll</button>
                      </div>
                      ))
                    
)}


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
      {customerDetails && (<div ref = {ConfigSectionRef}>
      <div className="customer-services">
        <h4>Your Services</h4>
        <div className="service-cards" style={{maxHeight:'450px'}}>
          {customerDetails && customerDetails.services_enrolled.length > 0
            ? customerDetails.services_enrolled.map((service) => (
                <div key={service.service_name} className="customer-plan-card">
                  <h5 className="service-name">{service.service_name}</h5>
                  <span className={`plan-name ${service.plan.toLowerCase()}`}>
            {service.plan}
          </span>
          <div className="features">
  <ul>
    {service.features
      .split(";")
      .map((feature) => feature.trim())  // Trim each feature
      .filter((feature) => feature)      // Filter out empty features
      .map((feature, index) => (
        <li key={index}>{feature}</li>
      ))}
  </ul>
</div>
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
      </div>)}

      {ConfigsidebarOpen && (
        <Configuresidebar
          customerId={customer_id}
          service={selectedService}
          closeSidebar={closeSidebar}
        />
      )}

{customerDetails && (<div  className="customer-services">
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
</div>)}
<Footer />

    </>
  );
};


export default LandingPage;
