import React, { useState } from 'react';
import axios from 'axios';
import './CreateService.css'; // Ensure this import is at the top of your file to use the styles
import { useNavigate } from 'react-router-dom';
const planTypes = [
    "basic",
    "pro",
    "pro-plus",
    "premium"
];

const CreateService = () => {
    const navigate=useNavigate();
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
            const response = await axios.get('http://54.175.148.241:8081/checkservice', {
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

        const processedPlans = plans.map(plan => ({
            ...plan,
            features: plan.features.split('\n').join(';')
        }));

        try {
            await axios.post('http://54.175.148.241:8081/createservice', {
                service_name: serviceName,
                plans: processedPlans
            }, {
                withCredentials: true
            });
            alert('Service created successfully');
            setServiceName('');
            setPlans([{ plan_name: planTypes[0], features: '' }]);
            navigate("/adminhome")
        } catch (err) {
            console.error("Error creating service:", err);
            alert('An error occurred while creating the service.');
        }
    };

    return (
        <div className="create-service-box">
            <form className='create-service-form' onSubmit={handleSubmit}>
                <div>
                    <label className='create-service-label'>Service Name:</label>
                    <input 
                        type="text"
                        name="service_name"
                        value={serviceName}
                        className='create-form-input'
                        onChange={(e) => setServiceName(e.target.value)}
                        required
                    />
                </div>

                {plans.map((plan, index) => (
                    <div key={index} className="plan-box">
                        <label className='create-service-label'>Plan Type:</label>
                        <select
                            name="plan_name"
                            value={plan.plan_name}
                            className='plan-type-select'
                            onChange={(e) => handlePlanChange(index, e)}
                            required
                        >
                            {planTypes.map(type => (
                                <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                            ))}
                        </select>

                        <label className='create-service-label'>Features:</label>
                        <textarea
                           
                            name="features"
                            value={plan.features}
                           className='create-form-input'
                            onChange={(e) => handlePlanChange(index, e)}
                            rows={5}
                            required
                        />

                        <button type="button" className='remove-plan' onClick={() => handleRemovePlan(index)}>Remove Plan</button>
                    </div>
                ))}

                <button type="button" className='add-plan' onClick={handleAddPlan}>Add Plan</button>
                <button type="submit" className='submit-service'>Create Service</button>

                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
};

export default CreateService;
