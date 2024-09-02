import React, { useEffect, useState } from 'react';
import { useNavigate,useLocation   } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Terminate = () => {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const customer_id = queryParams.get('customer_id');
  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Check if the user is authenticated
    axios.get('http://localhost:8081')
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);

          // Fetch enrolled services for the customer
          axios.get(`http://localhost:8081/customer/${customer_id}`)
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
  }, [navigate]);

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };

  const handleTerminate = () => {
    if (!selectedService) {
      alert('Please select a service to terminate.');
      return;
    }
  
    const serviceToTerminate = services.find(service => service.service_id === parseInt(selectedService));
 
    // Send required data to the API
    axios.post('http://localhost:8081/archive', {
      customer_id: customer_id,
      service_id: serviceToTerminate.service_id // Use correct field for service ID
    })
    .then(() => {
      axios.delete(`http://localhost:8081/customer-services/${selectedService}`)
        .then(res => {
          if (res.data.Status === "Service deleted successfully") {
            alert('Service terminated successfully.');
            setServices(services.filter(service => service.service_id !== parseInt(selectedService)));
            navigate(`/?customer_id=${customer_id}`);
          } else {
            alert('Failed to terminate service.');
          }
        })
        .catch(err => {
          console.error("Error deleting service:", err);
          alert('An error occurred while terminating the service.');
        });
    })
    .catch(err => {
      console.error("Error archiving service:", err);
      alert('An error occurred while archiving the service.');
    });
  };

  return (
    <div>
      {auth ? (
        <div>
          <h3>Welcome, {name}</h3>
          <h4>Terminate a Service</h4>
          <div>
            <label>Select Service: </label>
            <select value={selectedService} onChange={handleServiceChange} required>
              <option value="">Select a service</option>
              {services.map(service => (
                <option key={service.service_id} value={service.service_id}>
                  {service.service_name}  
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleTerminate}>Terminate Service</button>
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

export default Terminate;
