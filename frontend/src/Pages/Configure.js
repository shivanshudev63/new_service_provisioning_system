import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './Customer.css'
const Configure = () => {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [services, setServices] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [currentPlan, setCurrentPlan] = useState('');
  const [planLevels, setPlanLevels] = useState([]);
  const [action, setAction] = useState('');
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const customer_id = queryParams.get('customer_id');
  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Check if the user is authenticated
    axios.get('http://54.175.148.241:8081')
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);

          // Fetch available services and plans
          axios.get(`http://54.175.148.241:8081/services/${customer_id}`)
            .then(serviceRes => setServices(serviceRes.data))
            .catch(err => console.log("Error fetching services:", err));

          axios.get('http://54.175.148.241:8081/plans')
            .then(planRes => {
              const order = ['basic', 'pro', 'pro-plus', 'premium']; // Define the order of plans
              const sortedPlans = planRes.data.sort((a, b) => {
                return order.indexOf(a.plan_name) - order.indexOf(b.plan_name);
              });
              setPlans(sortedPlans);
              setPlanLevels(order);
            })
            .catch(err => console.log("Error fetching plans:", err));

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

  // Handle service selection
  const handleServiceChange = (event) => {
    const serviceId = event.target.value;
    setSelectedService(serviceId);

    // Fetch the current plan for the selected service
    axios.get(`http://54.175.148.241:8081/customer-service/${customer_id}/service/${serviceId}`)
      .then(res => setCurrentPlan(res.data.plan_name))
      .catch(err => console.log("Error fetching current plan:", err));
  };

  // Handle action selection
  const handleActionChange = (event) => {
    setAction(event.target.value);
  };

  // Fetch features for a plan
 // Fetch features for a plan
const fetchPlanFeatures = async (planId, serviceId) => {
  try {
    const res = await axios.get(`http://54.175.148.241:8081/plans/${planId}/service/${serviceId}`);
    
    console.log('API Response:', res); // Log the full API response
    
    if (res.data && res.data.features) {
      return res.data.features; // Return the features directly
    } else {
      console.error("Features not found in the response");
      return ''; // Handle the case where features might not exist
    }
  } catch (err) {
    console.log("Error fetching plan features:", err);
    return ''; // Return an empty string or a default value in case of an error
  }
};

// Handle form submission to update the plan
const handleSubmit = async (event) => {
  event.preventDefault();

  const currentIndex = planLevels.indexOf(currentPlan);
  let newPlan;

  if (action === 'upgrade') {
    if (currentIndex < planLevels.length - 1) {
      newPlan = planLevels[currentIndex + 1];
    } else {
      alert('Already on the highest plan.');
      return;
    }
  } else if (action === 'downgrade') {
    if (currentIndex > 0) {
      newPlan = planLevels[currentIndex - 1];
    } else {
      alert('Already on the lowest plan.');
      return;
    }
  } else {
    alert('Please select an action.');
    return;
  }

  // Fetch the features for the new plan
  const fetchedFeatures = await fetchPlanFeatures(newPlan, selectedService);

  console.log('Fetched Features:', fetchedFeatures); // Log the fetched features

  // Prepare the payload for the PUT request
  const updatedService = {
    customer_id,
    service_id: selectedService,
    plan: newPlan,
    request_type:'update',
    features: fetchedFeatures // Use the fetched features directly
  };

  console.log('Updated Service Payload:', updatedService); // Log the payload being sent
console.log(updatedService.features)
axios.post('http://54.175.148.241:8081/requests', updatedService)
.then(res => {
  if (res.data.Status === "Success") {
    alert('Request sent to the admin successfully!');
    navigate(`/?customer_id=${customer_id}`);
  } else {
    alert('Failed to send request.');
  }
})
.catch(err => {
  console.error("Error sending request:", err);
  alert('An error occurred while sending the request.');
});

  // axios.put('http://54.175.148.241:8081/customer-service/update', updatedService)
  //   .then(res => {
  //     if (res.data.Status === "Success") {
  //       alert('Service updated successfully!');
  //       navigate(`/?customer_id=${customer_id}`);
  //     } else {
  //       alert('Failed to update service.');
  //     }
  //   })
  //   .catch(err => {
  //     console.error("Error updating service plan:", err);
  //     alert('An error occurred while updating the service plan.');
  //   });
};


  return (
    <div className="configure-container">
      {auth ? (
        <div className="configure-box">
          <h3>Welcome, {name}</h3>
          <h4>Update Your Service Plan</h4>
          <form className="configure-form" onSubmit={handleSubmit}>
            <div>
              <label>Select Service: </label>
              <select value={selectedService} onChange={handleServiceChange} required>
                <option value="">Select a service</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.service_name}
                  </option>
                ))}
              </select>
            </div>
            {selectedService && (
              <div>
                <h5>Current Plan: {currentPlan}</h5>
                <div>
                  <label>Choose Action: </label>
                  <select value={action} onChange={handleActionChange} required>
                    <option value="">Select action</option>
                    <option value="upgrade">Upgrade</option>
                    <option value="downgrade">Downgrade</option>
                  </select>
                </div>
                <button type="submit">Update Plan</button>
              </div>
            )}
          </form>
        </div>
      ) : (
        <div  className="configure-message">
          <h3>{message}</h3>
          <h3>Login Now</h3>
          <Link to="/login">Login</Link>
        </div>
      )}
    </div>
  );
};

export default Configure;
