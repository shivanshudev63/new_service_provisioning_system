import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const CustomerService = sequelize.define('CustomerService', {
    customer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Customers',
            key: 'id',
        },
        primaryKey: true,
    },
    service_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Services',
            key: 'id',
        },
        primaryKey: true,
    },
    plan_name: {
        type: DataTypes.STRING,
        allowNull: false, // Make this field mandatory
    },
    features: {
        type: DataTypes.STRING,
        allowNull: true, // This can be optional
    }
}, {
    timestamps: false // Disable createdAt and updatedAt
});

export default CustomerService;
