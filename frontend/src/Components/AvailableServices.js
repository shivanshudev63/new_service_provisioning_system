import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AvailableServices = () => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [updatedServiceName, setUpdatedServiceName] = useState('');
    const [updatedPlans, setUpdatedPlans] = useState([]);
    const [newPlan, setNewPlan] = useState({ plan_name: '', features: '' });

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
        try {
            await axios.delete(`http://localhost:8081/deleteservice/${id}`);
            alert('Service deleted successfully');
            const response = await axios.get('http://localhost:8081/getservices');
            setServices(response.data);
        } catch (error) {
            console.error('Error deleting service:', error);
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
        console.log('Before update:', updatedPlans);
        console.log('Index:', index);
        console.log('Field:', field);
        console.log('Value:', value);
    
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
    
        console.log('After update:', updatedPlansCopy);
    
        setUpdatedPlans(updatedPlansCopy);
    };
    
    const handleAddPlan = () => {
        if (newPlan.plan_name && newPlan.features) {
            setUpdatedPlans(prevPlans => {
                const updatedPlans = [...prevPlans, newPlan];
                console.log('Updated plans after adding new plan:', updatedPlans);
                return updatedPlans;
            });
            setNewPlan({ plan_name: '', features: '' });
        } else {
            alert('Please fill in both fields for the new plan.');
        }
    };

    return (
        <div>
            <h1>Available Services</h1>
            {services.length > 0 ? (
                <ul>
                    {services.map((service) => (
                        <li key={service.id}>
                            <h2>{service.service_name}</h2>
                            {Object.entries(service.plans).map(([planName, features]) => (
                                <p key={planName}>
                                    <strong>{planName.charAt(0).toUpperCase() + planName.slice(1)}:</strong> {features}
                                </p>
                            ))}
                            <button onClick={() => handleSelectService(service)}>Update</button>
                            <button onClick={() => handleDeleteService(service.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No services available.</p>
            )}

            {selectedService && (
                <div>
                    <h2>Update Service</h2>
                    {/* <input
                        type="text"
                        value={updatedServiceName}
                        onChange={(e) => setUpdatedServiceName(e.target.value)}
                        placeholder="Service Name"
                    /> */}
                    <h1>{selectedService.service_name}</h1>
                    {updatedPlans.length > 0 ? (
                        updatedPlans.map((plan, index) => (
                            <div key={index}>
                                <h3>{plan.plan_name}</h3>
                                <textarea
                                    value={plan.features}
                                    onChange={(e) => handlePlanChange(index, 'features', e.target.value)}
                                    placeholder="Features (comma separated)"
                                />
                            </div>
                        ))
                    ) : (
                        <p>No plans available</p>
                    )}
                    {/* <div>
                        <h3>Add New Plan</h3>
                        <input
                            type="text"
                            value={newPlan.plan_name}
                            onChange={(e) => setNewPlan({ ...newPlan, plan_name: e.target.value })}
                            placeholder="Plan Name"
                        />
                        <textarea
                            value={newPlan.features}
                            onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
                            placeholder="Features (comma separated)"
                        />
                        <button onClick={handleAddPlan}>Add Plan</button>
                    </div> */}
                    <button onClick={() => handleUpdateService(selectedService.id)}>Save Changes</button>
                </div>
            )}
        </div>
    );
};

export default AvailableServices;
