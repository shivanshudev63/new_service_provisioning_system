import React, { useState } from 'react';
import axios from 'axios';
import './CreateService.css'; // Ensure this import is at the top of your file to use the styles

const planTypes = [
    "basic",
    "pro",
    "pro-plus",
    "premium"
];

const CreateService = () => {
    axios.defaults.withCredentials = true;
    const [serviceName, setServiceName] = useState('');
    const [plans, setPlans] = useState([
        { plan_name: planTypes[0], features: '' }
    ]);
    const [error, setError] = useState('');

    const handlePlanChange = (index, event) => {
        const newPlans = [...plans];
        newPlans[index][event.target.name] = event.target.value;
        setPlans(newPlans);
    };

    const handleAddPlan = () => {
        setPlans([...plans, { plan_name: planTypes[0], features: '' }]);
    };

    const handleRemovePlan = (index) => {
        const newPlans = plans.filter((_, i) => i !== index);
        setPlans(newPlans);
    };

    const checkServiceExists = async (serviceName) => {
        try {
            const response = await axios.get('http://localhost:8081/checkservice', {
                params: { service_name: serviceName }
            });
            return response.data.exists;
        } catch (err) {
            console.error("Error checking service existence:", err);
            return false;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Reset error state
        setError('');

        // Check if the service already exists
        const serviceExists = await checkServiceExists(serviceName);
        if (serviceExists) {
            setError('Service already exists. Please choose a different name.');
            return;
        }

        try {
            await axios.post('http://localhost:8081/createservice', {
                service_name: serviceName,
                plans
            }, {
                withCredentials: true
            });
            alert('Service created successfully');
            setServiceName('');
            setPlans([{ plan_name: planTypes[0], features: '' }]);
            window.location.reload();
        } catch (err) {
            console.error("Error creating service:", err);
            alert('An error occurred while creating the service.');
        }
    };

    return (
        <div className="create-service-box1">
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Service Name:</label>
                    <input
                        type="text"
                        name="service_name"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        required
                    />
                </div>

                {plans.map((plan, index) => (
                    <div key={index} className="plan-box">
                        <label>Plan Type:</label>
                        <select
                            name="plan_name"
                            value={plan.plan_name}
                            onChange={(e) => handlePlanChange(index, e)}
                            required
                        >
                            {planTypes.map(type => (
                                <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                            ))}
                        </select>

                        <label>Features:</label>
                        <input
                            type="text"
                            name="features"
                            value={plan.features}
                            onChange={(e) => handlePlanChange(index, e)}
                            required
                        />

                        <button type="button" onClick={() => handleRemovePlan(index)}>Remove Plan</button>
                    </div>
                ))}

                <button type="button" onClick={handleAddPlan}>Add Plan</button>
                <button type="submit">Create Service</button>

                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};

export default CreateService;
