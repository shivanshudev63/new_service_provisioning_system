import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AvaliableServices.css'; // Import the CSS file for styling

const AvailableServices = () => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [updatedServiceName, setUpdatedServiceName] = useState('');
    const [updatedPlans, setUpdatedPlans] = useState([]);
    const [newPlan, setNewPlan] = useState({ plan_name: '', features: '' });
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get('http://localhost:8081/getservices');
                setServices(response.data);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        fetchServices();
    }, []);

    const handleUpdateService = async (id) => {
        try {
            const requestData = {
                plans: updatedPlans.map(plan => ({
                    plan_name: plan.plan_name,
                    features: plan.features
                }))
            };

            console.log('Sending update request with plans:', requestData);

            const response = await axios.put(`http://localhost:8081/updateservice/${id}`, requestData);

            console.log('Update response:', response.data);
            alert('Service plans updated successfully');

            const refreshResponse = await axios.get('http://localhost:8081/getservices');
            setServices(refreshResponse.data);
        } catch (error) {
            console.error('Error updating service plans:', error);
        }
    };

    const handleDeleteService = async (id) => {
        console.log('Deleting service with id:', id); // Log the service ID for debugging
        try {
            await axios.delete(`http://localhost:8081/deleteservice/${id}`);
            const response = await axios.get('http://localhost:8081/getservices');
            setServices(response.data);
        } catch (error) {
            console.error('Error deleting service:', error); // Log any errors
        }
    };

    const handleSelectService = (service) => {
        if (service.plans && typeof service.plans === 'object') {
            const plansArray = Object.entries(service.plans).map(([planName, features]) => ({
                plan_name: planName,
                features
            }));
            setUpdatedPlans(plansArray);
        } else {
            console.error('Unexpected format for service.plans:', service.plans);
            setUpdatedPlans([]);
        }

        setSelectedService(service);
        setUpdatedServiceName(service.service_name);
    };

    const handlePlanChange = (index, field, value) => {
        if (index < 0 || index >= updatedPlans.length) {
            console.error('Invalid index:', index);
            return;
        }

        const updatedPlansCopy = [...updatedPlans];

        if (!updatedPlansCopy[index]) {
            console.error('No plan found at index:', index);
            return;
        }

        updatedPlansCopy[index] = { ...updatedPlansCopy[index], [field]: value };

        setUpdatedPlans(updatedPlansCopy);
    };

    const handleAddPlan = () => {
        if (newPlan.plan_name && newPlan.features) {
            setUpdatedPlans(prevPlans => {
                const updatedPlans = [...prevPlans, newPlan];
                return updatedPlans;
            });
            setNewPlan({ plan_name: '', features: '' });
        } else {
            alert('Please fill in both fields for the new plan.');
        }
    };

    return (
        <div className="available-services-container">
            <h1>Available Services</h1>
            {services.length > 0 ? (
                <ul className="service-list">
                    {services.map((service) => (
                        <li key={service.id} className="service-item">
                            <h2>{service.service_name}</h2>
                            {Object.entries(service.plans).map(([planName, features]) => (
                                <p key={planName}>
                                    <strong>{planName.charAt(0).toUpperCase() + planName.slice(1)}:</strong> {features}
                                </p>
                            ))}
                            <button className="button update-btn" onClick={() => handleSelectService(service)}>Update</button>
                            <button className="button delete-btn" onClick={() => handleDeleteService(service.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No services available.</p>
            )}

            {selectedService && (
                <div className="update-service-form">
                    <h2>Update Service</h2>
                    <h1>{selectedService.service_name}</h1>
                    {updatedPlans.length > 0 ? (
                        updatedPlans.map((plan, index) => (
                            <div key={index} className="plan-form">
                                <h3>{plan.plan_name}</h3>
                                <textarea
                                    className="textarea"
                                    value={plan.features}
                                    onChange={(e) => handlePlanChange(index, 'features', e.target.value)}
                                    placeholder="Features (comma separated)"
                                />
                            </div>
                        ))
                    ) : (
                        <p>No plans available</p>
                    )}
                    {/* <div className="add-plan-form">
                        <h3>Add New Plan</h3>
                        <input
                            type="text"
                            value={newPlan.plan_name}
                            onChange={(e) => setNewPlan({ ...newPlan, plan_name: e.target.value })}
                            placeholder="Plan Name"
                            className="input"
                        />
                        <textarea
                            value={newPlan.features}
                            onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
                            placeholder="Features (comma separated)"
                            className="textarea"
                        />
                        <button className="button add-btn" onClick={handleAddPlan}>Add Plan</button>
                    </div> */}
                    <button className="button save-btn" onClick={() => handleUpdateService(selectedService.id)}>Save Changes</button>
                </div>
            )}
        </div>
    );
};

export default AvailableServices;
