// models/Request.js
import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';
import User from './User.js'; // Import the User model
import Service from './Service.js'; // Import the Service model

const Request = sequelize.define('Request', {
    customer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User, // Reference the User model
            key: 'id',
        },
        allowNull: false,
    },
    service_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Service, // Reference the Service model
            key: 'id',
        },
        allowNull: false,
    },
    plan: {
        type: DataTypes.STRING,
        allowNull: true, // Make this field optional for cases like termination
    },
    features: {
        type: DataTypes.STRING,
        allowNull: true, // Optional field
    },
    request_type: {
        type: DataTypes.STRING, // e.g., 'creation', 'update', 'termination'
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
    },
}, {
    timestamps: false // Disable createdAt and updatedAt
});

// Define relationships
User.hasMany(Request, { foreignKey: 'customer_id' });
Request.belongsTo(User, { foreignKey: 'customer_id' });

Service.hasMany(Request, { foreignKey: 'service_id' });
Request.belongsTo(Service, { foreignKey: 'service_id' });

export default Request;
