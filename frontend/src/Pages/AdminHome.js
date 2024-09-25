// import React, { useState, useEffect } from 'react';
// import CreateService from '../Components/CreateService';
// import AvailableServices from '../Components/AvailableServices';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import {
//   Dropdown,
//   Container,
//   Carousel,
// } from "react-bootstrap";
// import logo from "../Authentication/logo.png";

// import './AdminHome.css';
// import '../Components/LandingPage/LandingPage.css';
//  // Ensure this CSS file is imported

// const AdminHome = () => {
//   const [auth, setAuth] = useState(false);
//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [requests, setRequests] = useState([]);
//   const navigate = useNavigate();
//   axios.defaults.withCredentials = true;

//   useEffect(() => {
//     // Fetch customers
//     axios.get('http://44.202.105.5:8081/customers')
//       .then(res => {
//         if (Array.isArray(res.data)) {
//           setCustomers(res.data);
//         } else {
//           console.error("Expected an array, but got:", res.data);
//           setCustomers([]);
//         }
//       })
//       .catch(err => console.error("Error fetching customers:", err));

//     // Fetch service requests
//     axios.get('http://44.202.105.5:8081/requests')
//       .then(res => {
//         if (Array.isArray(res.data)) {
//           setRequests(res.data);
//         } else {
//           console.error("Expected an array, but got:", res.data);
//           setRequests([]);
//         }
//       })
//       .catch(err => console.error("Error fetching service requests:", err));
//   }, []);

//   const handleLogout = () => {
//     axios.get('http://44.202.105.5:8081/logout')
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

//   const viewCustomerDetails = (id) => {
//     axios.get(`http://44.202.105.5:8081/customer/${id}`)
//       .then(res => {
//         if (res.data) {
//           setSelectedCustomer(res.data);
//         }
//       })
//       .catch(err => console.error("Error fetching customer details:", err));
//   };

//   const removeCustomer = (id) => {
//     axios.delete(`http://44.202.105.5:8081/customer/${id}`)
//       .then(res => {
//         if (res.data.Status === "Customer removed successfully") {
//           setCustomers(customers.filter(customer => customer.id !== id));
//           setSelectedCustomer(null);
//         }
//       })
//       .catch(err => console.error("Error removing customer:", err));
//   };

//   const approveRequest = (id) => {
//     axios.post(`http://44.202.105.5:8081/approve-request/${id}`)
//       .then(res => {
//         if (res.data.Status === "Success") {
//           alert('Request approved successfully!');
//           setRequests(requests.filter(request => request.id !== id));
//         } else {
//           alert('Failed to approve request.');
//         }
//       })
//       .catch(err => console.error("Error approving request:", err));
//   };

//   const rejectRequest = (id) => {
//     axios.delete(`http://44.202.105.5:8081/requests/${id}`)
//       .then(res => {
//         if (res.data.Status === "Request deleted successfully") {
//           alert('Request rejected successfully!');
//           setRequests(requests.filter(request => request.id !== id));
//         } else {
//           alert('Failed to reject request.');
//         }
//       })
//       .catch(err => console.error("Error rejecting request:", err));
//   };

//   return (

//     <>
//     <nav className="custom-navbar">
//         <div className="navbar-container">
//           <div className="navbar-left">
//           <img src={logo} alt="Company Logo" className="landing-logo" />
//           <ul className="nav-links">
//             <li><Link to="/">Home</Link></li>
//             <li className="nav-item dropdown">
//         <Dropdown>
//           <Dropdown.Toggle as="button" className="nav-link">
//             Actions <i className="bi bi-caret-down"></i> {/* Dropdown icon */}
//           </Dropdown.Toggle>

//           <Dropdown.Menu>
//             <Dropdown.Item as="button" >
//               Available Service
//             </Dropdown.Item>
//             <Dropdown.Item as="button" >
//               Create a Service
//             </Dropdown.Item>
//             <Dropdown.Item as="button" >
//               View Requests
//             </Dropdown.Item>
//             <Dropdown.Item as="button" >
//               View Customers
//             </Dropdown.Item>
//           </Dropdown.Menu>
//         </Dropdown>
//       </li>
//             <li><Link to="/archive">Archived Services</Link></li>
//             {/* <li><Link to="/contact">Contact</Link></li> */}
//           </ul>
//           </div>
//           <div className='navbar-right'>
//         <Link to="/registeradmin">
//             <button className="archive-button" >Register Admin</button>
//           </Link>
//           <button className="navbar-logout-button" onClick={handleLogout}>Logout</button>
//           </div>
//         </div>
//       </nav>

      
//     <div className="admin-container">
//       {/* <button className="navbar-logout-button" onClick={handleLogout}>Logout</button> */}
      
//       <div className="admin-navbox">
//         <Link to="/archive">
//           <button className="archive-button">View Archived Services</button>
//         </Link>
//         <Link to="/registeradmin">
//             <button className="archive-button">Register a new Admin</button>
//           </Link>
//       </div>
      
//       <div className="available-services-box">
//         <AvailableServices />
//       </div>

//       <div className="create-service-box">
//         <h2>Create a New Service</h2>
//         <CreateService />
//       </div>

//       <div className="service-requests-box">
//         <h2>Service Requests</h2>
//         <ul>
//           {Array.isArray(requests) && requests.length > 0 ? (
//             requests.map(request => (
//               <li key={request.id}>
//                 <span >Customer ID: {request.customer_id} | Service ID: {request.service_id} | Plan: {request.plan} | Feature: {request.features} | Type: {request.request_type}</span>
//                <br/> <button className="approve-btn" onClick={() => approveRequest(request.id)}>Approve</button>
//                 <button className="reject-btn" onClick={() => rejectRequest(request.id)}>Reject</button>
//               </li>
//             ))
//           ) : (
//             <li>No service requests available</li>
//           )}
//         </ul>
//       </div>
      
//       <div className="customer-table-box">
//         <h2>Customer List</h2>
//         <table className="customer-table">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Array.isArray(customers) ? (
//               customers.map(customer => (
//                 <tr key={customer.id}>
//                   <td>{customer.name}</td>
//                   <td>{customer.email}</td>
//                   <td>
//                     <button className="view-btn" onClick={() => viewCustomerDetails(customer.id)}>View Details</button>
//                     <button className="remove-btn" onClick={() => removeCustomer(customer.id)}>Remove</button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="3">No customers available</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
        
//         {selectedCustomer && (
//           <div className="customer-details">
//             <h3>Customer Details</h3>
//             <p>Name: {selectedCustomer.name}</p>
//             <p>Email: {selectedCustomer.email}</p>
//             <h4>Enrolled Services</h4>
//             <ul>
//               {selectedCustomer.services_enrolled && selectedCustomer.services_enrolled.length > 0 ? (
//                 selectedCustomer.services_enrolled.map((service, index) => (
//                   <li key={index}>
//                     {service.service_name} - {service.plan} (Features: {service.features})
//                   </li>
//                 ))
//               ) : (
//                 <li>No services enrolled</li>
//               )}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//     </>
//   );
// };

// export default AdminHome;




import React, { useState, useEffect } from 'react';
import CreateService from '../Components/CreateService';
import AvailableServices from '../Components/AvailableServices';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
     Dropdown,
     Container,
     Carousel,
   } from "react-bootstrap";
import avatar from "../Assets/avatar.png"; // Path to your avatar image
import './AdminHome.css';
import '../Components/LandingPage/LandingPage.css'; // Ensure this CSS file is imported
import logo from "../Authentication/logo.png";
import ArchiveTable from './ArchiveData';
const AdminHome = () => {
  const [auth, setAuth] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [requests, setRequests] = useState([]);
  const [activeComponent, setActiveComponent] = useState('availableServices');
  const [newRequestsCount, setNewRequestsCount] = useState(0);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Fetch customers
    axios.get('http://44.202.105.5:8081/customers')
      .then(res => {
        if (Array.isArray(res.data)) {
          setCustomers(res.data);
        } else {
          console.error("Expected an array, but got:", res.data);
          setCustomers([]);
        }
      })
      .catch(err => console.error("Error fetching customers:", err));

    // Fetch service requests
    axios.get('http://44.202.105.5:8081/requests')
      .then(res => {
        if (Array.isArray(res.data)) {
          setRequests(res.data);
          setNewRequestsCount(res.data.length);
        } else {
          console.error("Expected an array, but got:", res.data);
          setRequests([]);
          setNewRequestsCount(0);
        }
      })
      .catch(err => console.error("Error fetching service requests:", err));

      // const interval = setInterval(() => {
      //   axios.get('http://44.202.105.5:8081/requests')
      //     .then(res => {
      //       if (Array.isArray(res.data)) {
      //         const newRequests = res.data.length - requests.length;
      //         setRequests(res.data);
      //         if (newRequests > 0) {
      //           setNewRequestsCount(newRequests); // Update count if there are new requests
      //         }
      //       }
      //     })
      //     .catch(err => console.error("Error fetching service requests:", err));
      // }, 100000000);

      // return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    axios.get('http://44.202.105.5:8081/logout')
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

  const handleAdminRegister = () => {
        navigate('/registeradmin');
  }

  const viewCustomerDetails = (id) => {
    axios.get(`http://44.202.105.5:8081/customer/${id}`)
      .then(res => {
        if (res.data) {
          setSelectedCustomer(res.data);
        }
      })
      .catch(err => console.error("Error fetching customer details:", err));
  };

  const removeCustomer = (id) => {
    axios.delete(`http://44.202.105.5:8081/customer/${id}`)
      .then(res => {
        if (res.data.Status === "Customer removed successfully") {
          setCustomers(customers.filter(customer => customer.id !== id));
          setSelectedCustomer(null);
        }
      })
      .catch(err => console.error("Error removing customer:", err));
  };

  const approveRequest = (id) => {
    axios.post(`http://44.202.105.5:8081/approve-request/${id}`)
      .then(res => {
        if (res.data.Status === "Success") {
          alert('Request approved successfully!');
          setRequests(requests.filter(request => request.id !== id));
        } else {
          alert('Failed to approve request.');
        }
      })
      .catch(err => console.error("Error approving request:", err));
  };

  const rejectRequest = (id) => {
    axios.delete(`http://44.202.105.5:8081/requests/${id}`)
      .then(res => {
        if (res.data.Status === "Request deleted successfully") {
          alert('Request rejected successfully!');
          setRequests(requests.filter(request => request.id !== id));
        } else {
          alert('Failed to reject request.');
        }
      })
      .catch(err => console.error("Error rejecting request:", err));
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'availableServices':
        return <AvailableServices />;
      case 'createService':
        return <CreateService />;
      case 'archive':
         return <ArchiveTable/>
      case 'viewRequests':
        return (
          <div className="service-requests-box">
            <h2>Service Requests</h2>
            <ul>
              {Array.isArray(requests) && requests.length > 0 ? (
                requests.map(request => (
                  <li key={request.id}>
                    <span>Customer ID: {request.customer_id} | Service ID: {request.service_id} | Plan: {request.plan} | Feature: {request.features} | Type: {request.request_type}</span>
                    <br /><button className="approve-btn" onClick={() => approveRequest(request.id)}>Approve</button>
                    <button className="reject-btn" onClick={() => rejectRequest(request.id)}>Reject</button>
                  </li>
                ))
              ) : (
                <li>No service requests available</li>
              )}
            </ul>
          </div>
        );
      case 'viewCustomers':
        return (
          <div className="customer-table-box">
            <h2>Customer List</h2>
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(customers) ? (
                  customers.map(customer => (
                    <tr key={customer.id}>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>
                        <button className="view-btn" onClick={() => viewCustomerDetails(customer.id)}>View Details</button>
                        <button className="remove-btn" onClick={() => removeCustomer(customer.id)}>Remove</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No customers available</td>
                  </tr>
                )}
              </tbody>
            </table>

            {selectedCustomer && (
              <div className="customer-details">
                <h3>Customer Details</h3>
                <p>Name: {selectedCustomer.name}</p>
                <p>Email: {selectedCustomer.email}</p>
                <h4>Enrolled Services</h4>
                <ul>
                  {selectedCustomer.services_enrolled && selectedCustomer.services_enrolled.length > 0 ? (
                    selectedCustomer.services_enrolled.map((service, index) => (
                      <li key={index}>
                        {service.service_name} - {service.plan} (Features: {service.features})
                      </li>
                    ))
                  ) : (
                    <li>No services enrolled</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
     
    <div className="admin-home-container">
       
       <div className="dashboard">
        
        <div className="dashboard-buttons">
          <div className='admin-welcome'>
        <img src={logo} alt="Admin Avatar" className="admin-avatar" />
        <h2>Welcome Admin</h2>
        </div>
            <div className='dashboard-services'>
            <button className="dashboard-btn" onClick={() => setActiveComponent('availableServices')}>Available Services</button>
              <button className="dashboard-btn" onClick={() => setActiveComponent('createService')}>Create a Service</button>
              {/* <button className="dashboard-btn" onClick={() => setActiveComponent('viewRequests')}>View Requests</button>
               */}
               <button className="dashboard-btn" onClick={() => {
  setActiveComponent('viewRequests');
  setNewRequestsCount(0);  // Reset the new requests count when the button is clicked
}}>
  View Requests 
  {newRequestsCount > 0 && (
    <span className="notification-badge">{newRequestsCount}</span>
  )}
</button>
              <button className="dashboard-btn" onClick={() => setActiveComponent('viewCustomers')}>View Customers</button>
              <button className="dashboard-btn" onClick={() => setActiveComponent('archive')}>Archived Services</button>
          </div>
        </div>
        <div className='dashboard-logout'>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="main-content">
      <nav className="admin-navbar">
        <div className="navbar-content">
          {/* <img src={logo} alt="Company Logo" className="admin-logo" /> */}
          <button className="navbar-register-btn" onClick={handleAdminRegister}>
            Register Admin
          </button>
        </div>
      </nav>
        <div className='actions-box'>
        
        {renderActiveComponent()}
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminHome;
