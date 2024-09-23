import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './modal'; // Import the modal component
import './LandingPage.css'; // Add appropriate styles for the sidebar
import Feedback from 'react-bootstrap/esm/Feedback';

const Configuresidebar = ({ customerId, service, closeSidebar }) => {
  const [currentPlan, setCurrentPlan] = useState('');
  const [action, setAction] = useState('');
  const [planLevels, setPlanLevels] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // Track modal visibility
  const [modalType, setModalType] = useState(''); // Track if it's for plan change or termination
  const [newPlan, setNewPlan] = useState(''); 
  const [feedback,setFeedback] = useState('');
  const [features, setFeatures] = useState("");


  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const serviceRes = await axios.get(
          `http://localhost:8081/customer-service/${customerId}/service/${service.service_id}`
        );
        setCurrentPlan(serviceRes.data.plan_name);

        const planRes = await axios.get('http://localhost:8081/plans');
        const order = ['basic', 'pro', 'pro-plus', 'premium']; // Define plan order
        const sortedPlans = planRes.data.sort(
          (a, b) => order.indexOf(a.plan_name) - order.indexOf(b.plan_name)
        );
        setPlanLevels(order);
      } catch (err) {
        console.log('Error fetching service or plan details:', err);
      }
    };

    if (service) {
      fetchPlanDetails();
    }
  }, [service, customerId]);

  const handleActionClick = (selectedAction) => {
    setAction(selectedAction);

    const currentIndex = planLevels.indexOf(currentPlan);
    let planToChangeTo = '';

    if (selectedAction === 'upgrade' && currentIndex < planLevels.length - 1) {
      planToChangeTo = planLevels[currentIndex + 1];
    } else if (selectedAction === 'downgrade' && currentIndex > 0) {
      planToChangeTo = planLevels[currentIndex - 1];
    }

    setNewPlan(planToChangeTo); // Set new plan
    fetchFeatures(newPlan);
  };


  const fetchFeatures =  async (planId) => {
    try {
      const res = await axios.get(`http://localhost:8081/plans/${planId}/service/${ service.service_id}`);
      if (res.data && res.data.features) {
        setFeatures(res.data.features);
        return res.data.features;
      } else {
        return '';
      }
    } catch (err) {
      console.log('Error fetching plan features:', err);
      return '';
    }
  }

  const openModal = (type, newPlan = '') => {
    setModalType(type);
    setNewPlan(newPlan); // Save the selected new plan for plan change
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const currentIndex = planLevels.indexOf(currentPlan);
    let planToChangeTo;

    if (action === 'upgrade') {
      if (currentIndex < planLevels.length - 1) {
        planToChangeTo = planLevels[currentIndex + 1];
      } else {
        alert('Already on the highest plan.');
        return;
      }
    } else if (action === 'downgrade') {
      if (currentIndex > 0) {
        planToChangeTo = planLevels[currentIndex - 1];
      } else {
        alert('Already on the lowest plan.');
        return;
      }
    } else {
      alert('Please select an action.');
      return;
    }

    openModal('planChange', planToChangeTo); // Open the modal for plan change
  };

  const handleTerminate = () => {
    openModal('termination'); // Open the modal for termination
  };

  const confirmPlanChange = async () => {
    setModalVisible(false); // Close modal after confirmation
    window.location.reload();
    
    const fetchPlanFeatures = async (planId, serviceId) => {
      try {
        const res = await axios.get(`http://localhost:8081/plans/${planId}/service/${serviceId}`);
        if (res.data && res.data.features) {
          setFeatures(res.data.features);
          return res.data.features;
        } else {
          return '';
        }
      } catch (err) {
        console.log('Error fetching plan features:', err);
        return '';
      }
    };

    const fetchedFeatures = await fetchPlanFeatures(newPlan, service.service_id);

    const updatedService = {
      customer_id: customerId,
      service_id: service.service_id,
      plan: newPlan,
      request_type: 'update',
      features: fetchedFeatures,
    };

    try {
      const res = await axios.post('http://localhost:8081/requests', updatedService);
      if (res.data.Status === 'Success') {
        alert('Request sent to the admin successfully!');
        closeSidebar(); // Close the sidebar after submission
      } else {
        alert('Failed to send request');
      }
    } catch (err) {
      console.log('Error sending request:', err);
    }
  };

  const confirmTermination = async () => {
    setModalVisible(false); // Close modal after confirmation
    window.location.reload();
    
    const terminationRequest = {
      customer_id: customerId,
      service_id: service.service_id,
      plan: service.plan,
      features: service.features,
      request_type: 'termination',
      status: 'termination',
      feedback: feedback
    };

    try {
      const res = await axios.post('http://localhost:8081/requests', terminationRequest);
      if (res.data.Status === 'Success') {
        alert('Termination request sent successfully! Awaiting admin approval.');
        closeSidebar(); // Close the sidebar after termination
      } else {
        alert('Failed to send termination request.');
      }
    } catch (err) {
      console.log('Error sending termination request:', err);
      alert('An error occurred while sending the termination request.');
    }
  };

  return (
    <div className="sidebar">
      <button className="close-btn" onClick={closeSidebar}>
        X
      </button>
      <h2>Welcome!</h2>
      <h4>Configure your {service.service_name} service</h4>
      <h5>Current Plan: {currentPlan}</h5>
      <div className="action-buttons">
        <button
          className={`action-btn ${action === 'upgrade' ? 'active' : ''}`}
          onClick={() => handleActionClick('upgrade')}
        >
          Upgrade
        </button>
        <button
          className={`action-btn ${action === 'downgrade' ? 'active' : ''}`}
          onClick={() => handleActionClick('downgrade')}
        >
          Downgrade
        </button>
      </div>


      {features && (
        <div className="plan-features">
          <h5>Plan Features:</h5>
          <p>{features}</p>
        </div>
      )}


      <form style={{ width: '38%' }} onSubmit={handleSubmit}>
        <button type="submit" className="enroll-service-btn">
          Submit
        </button>
      </form>

      <button className="terminate-btn" onClick={handleTerminate}>
        Terminate Service
      </button>

      

      {/* {modalVisible && (
        <Modal
          title={modalType === 'planChange' ? 'Confirm Plan Change' : 'Confirm Termination'}
          message={
            modalType === 'planChange'
              ? `Are you sure you want to change your plan to ${newPlan}?`
              : `Are you sure you want to terminate the ${service.service_name} service?`
          }
          onConfirm={modalType === 'planChange' ? confirmPlanChange : confirmTermination}
          onCancel={closeModal}
        />
      )} */}

{modalVisible && (
  <div className="modal-overlay">
    <div className="pop-up">
      <h2>{modalType === 'planChange' ? 'Confirm Plan Change' : 'Confirm Termination'}</h2>
      
      <p>
      <p>
  {modalType === 'planChange' ? (
    <>
      {action === 'upgrade' && (
        <span style={{fontSize: '25px', display: 'block', marginTop: '10px', color: 'orange', fontWeight: 'bold' }}>
          Caution! Additional charges will be applied.
        </span>
      )}
      Are you sure you want to change your plan to
      <span style={{ fontSize: '25px', fontWeight: 'bold', color: 'red' }}> {newPlan}? </span>
      
    </>
  ) : (
    <>
      Are you sure you want to terminate the
      <span style={{ fontWeight: 'bold', color: 'red' }}> {service.service_name} </span>
      service?
    </>
  )}
</p>

</p>


      {/* Conditionally render feedback textbox for termination modal */}
      {modalType === 'termination' && (
        <textarea
          placeholder="Please provide feedback(optional)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          style={{ width: '100%', height: '100px', marginTop: '10px' }}
        />
      )}

      <div className="modal-actions">
        <button
          className="modal-btn confirm-btn"
          onClick={modalType === 'planChange' ? confirmPlanChange : confirmTermination}
        >
          Okay
        </button>
        <button className="modal-btn cancel-btn" onClick={closeModal}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Configuresidebar;
