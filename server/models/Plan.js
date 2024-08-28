import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';
import Service from './Service.js';

const Plan = sequelize.define('Plan', {
    plan_name: {
        type: DataTypes.ENUM('basic', 'pro', 'pro-plus', 'premium'),
        allowNull: false
    },
    features: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

// Define the relationship
Service.hasMany(Plan, { foreignKey: 'service_id' });
Plan.belongsTo(Service, { foreignKey: 'service_id' });

export default Plan;
