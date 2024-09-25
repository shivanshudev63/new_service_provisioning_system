import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LandingPage"; // Make sure this file contains the new styles

const Sidebar = ({ service, customerId, closeSidebar }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [features, setFeatures] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch available plans for the selected service
    if (service) {
      const service_id = service.id;
      axios
        .get(`http://44.202.105.5:8081/plans/${service_id}`)
        .then((planRes) => {
          console.log(planRes);
          setPlans(planRes.data);
        })
        .catch((err) => console.log("Error fetching plans:", err));

        axios.get(`http://44.202.105.5:8081/plans/${selectedPlan}/service/${service_id}`)
    .then(res => setFeatures(res.data.features))
    .catch(err => console.log("Error fetching plan features:", err));
    }

    
  }, [service,selectedPlan]);

  const handlePlanSelect = (plan_name) => {
    setSelectedPlan(plan_name);

    // Fetch features for the selected plan
    axios
      .get(`http://44.202.105.5:8081/plans/${plan_name}`)
      .then((res) => setFeatures(res.data.features))
      .catch((err) => console.log("Error fetching plan features:", err));
  };



  const handleSubmit = (event) => {
    event.preventDefault();

    const newService = {
      customer_id: customerId,
      service_id: service.id,
      plan: selectedPlan,
      request_type: "creation",
    };

    axios
      .post("http://44.202.105.5:8081/requests", newService)
      .then((res) => {
        if (res.data.Status === "Success") {
          setShowModal(true);
          // alert("Request sent successfully! Awaiting admin approval.");
          // closeSidebar(); // Close the sidebar after enrollment
        } else {
          alert("Failed to send request.");
        }
      })
      .catch((err) => console.log("Error sending request:", err));

      
  };

  const closeModal = () => {
    setShowModal(false);
    window.location.reload();
    closeSidebar(); // Close the sidebar after the modal is dismissed
  };

  

  return (
    <>
 
    <div className="sidebar">
      <button className="close-btn" onClick={closeSidebar}>
        X
      </button>
      <h2>Great choice!</h2>
      <h3>{service.service_name}</h3>
      <h4>Choose your plan:</h4>
      <div className="plan-buttons">
        {plans.map((plan) => (
          <button
            key={plan.id}
            className={`plan-btn ${selectedPlan === plan.plan_name ? "selected" : ""}`}
            onClick={() => handlePlanSelect(plan.plan_name)}
          >
            {plan.plan_name}
          </button>
        ))}
      </div>

      {features && (
        <div className="plan-features">
         <ul>
    {features
      .split(";")
      .map((feature) => feature.trim())  // Trim each feature
      .filter((feature) => feature)      // Filter out empty features
      .map((feature, index) => (
        <li key={index}>{feature}</li>
      ))}
  </ul>
        </div>
      )}


      <button
        type="submit"
        className="enroll-service-btn"
        onClick={handleSubmit}
        disabled={!selectedPlan}
      >
        Enroll
      </button>
    </div>


    {showModal && (
        <div className="modal-overlay">
          <div className="pop-up">
            <h3>Request Sent Successfully!</h3>
            <p>Awaiting admin approval.</p>
            <button onClick={closeModal} className="modal-close-btn">
              OK
            </button>
          </div>
        </div>
      )}
    </>

  );
};

export default Sidebar;
