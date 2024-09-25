import React, { useEffect, useState } from 'react';
import { useNavigate,useLocation   } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Customer.css'
const Terminate = () => {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [rating, setRating] = useState(0); // State for star rating
  const [feedback, setFeedback] = useState(''); // State for feedback
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const customer_id = queryParams.get('customer_id');
  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Check if the user is authenticated
    axios.get('http://44.202.105.5:8081')
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);

          // Fetch enrolled services for the customer
          axios.get(`http://44.202.105.5:8081/customer/${customer_id}`)
            .then(serviceRes => setServices(serviceRes.data.services_enrolled))
            .catch(err => console.log("Error fetching services:", err));
        } else {
          setAuth(false);
          setMessage(res.data.Error);
          navigate('/login'); // Redirect to login page if not authenticated
        }
      })
      .catch(err => {
        console.log("Error during authentication check:", err);
        setAuth(false);
        setMessage('An error occurred during authentication.');
        navigate('/login'); // Redirect to login page on error
      });
  }, [navigate, customer_id]);

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };
  const handleRatingChange = (ratingValue) => {
    setRating(ratingValue);
  };
  const handleTerminate = () => {
    if (!selectedService) {
      alert('Please select a service to terminate.');
      return;
    }
  
    const serviceToTerminate = services.find(service => service.service_id === parseInt(selectedService));
    const terminationRequest = {
      customer_id: customer_id,
      service_id: serviceToTerminate.service_id, // Use correct field for service ID
       // Specify the request type for termination
      plan: serviceToTerminate.plan,
      features:serviceToTerminate.features,
      request_type: 'termination',
      status:'termination' ,// Pass the plan of the service
      rating: rating, // Include rating in the request
      feedback: feedback // Include feedback in the request
    };
    
    axios.post('http://44.202.105.5:8081/requests', terminationRequest)
    .then(res => {
      
      if (res.data.Status === "Success") {
        alert('Request sent successfully! Awaiting admin approval.');
        navigate(`/?customer_id=${customer_id}`);
      } else {
        alert('Failed to send request.');
      }
    })
    .catch(err => {
      console.log("Error sending request:", err);
      alert('An error occurred while sending the termination request.');
    });
    // Send required data to the API
    // axios.post('http://44.202.105.5:8081/archive', {
    //   customer_id: customer_id,
    //   service_id: serviceToTerminate.service_id // Use correct field for service ID
    // })
    // .then(() => {
    //   axios.delete(`http://44.202.105.5:8081/customer-services/${selectedService}`)
    //     .then(res => {
    //       if (res.data.Status === "Service deleted successfully") {
    //         alert('Service terminated successfully.');
    //         setServices(services.filter(service => service.service_id !== parseInt(selectedService)));
    //         navigate(`/?customer_id=${customer_id}`);
    //       } else {
    //         alert('Failed to terminate service.');
    //       }
    //     })
    //     .catch(err => {
    //       console.error("Error deleting service:", err);
    //       alert('An error occurred while terminating the service.');
    //     });
    // })
    // .catch(err => {
    //   console.error("Error archiving service:", err);
    //   alert('An error occurred while archiving the service.');
    // });
  };

  return (
    <div className="configure-container">
      {auth ? (
        <div className="configure-box">
          <h3>Welcome, {name}</h3>
          <h4>Terminate a Service</h4>
          <div className="configure-form">
            <label>Select Service: </label>
            <select value={selectedService} onChange={handleServiceChange} required>
              <option value="">Select a service</option>
              {services.map(service => (
                <option key={service.service_id} value={service.service_id}>
                  {service.service_name}  
                </option>
              ))}
            </select>
            <div className="star-rating">
              {[...Array(5)].map((star, index) => (
                <span
                  key={index}
                  onClick={() => handleRatingChange(index + 1)} // Set rating value on click
                  style={{ color: index < rating ? "#ffc107" : "#e4e5e9", fontSize: "30px", cursor: 'pointer' }}
                >
                  ★
                </span>
              ))}
            </div>
            <p>{rating > 0 ? `You rated ${rating} star(s)` : 'Rate the service'}</p>

            {/* Feedback Text Input */}
            <textarea
              placeholder="Write your feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="4"
              cols="50"
              style={{ marginTop: '10px', width: '100%', padding: '10px' }}
            ></textarea>
            <button onClick={handleTerminate}>Terminate Service</button>

          </div>
        </div>
      ) : (
        <div className="configure-message">
          <h3>{message}</h3>
          <h3>Login Now</h3>
          <Link to="/login">Login</Link>
        </div>
      )}
    </div>
  );
};

export default Terminate;
