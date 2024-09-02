import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js'; // Path to your sequelize instance

const Archive = sequelize.define('Archive', {
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    customer_name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    service_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    plan_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    features: {
        type: DataTypes.TEXT,
        allowNull: true // Assuming features are optional
    }
}, {
    timestamps: true // Enable createdAt and updatedAt
});

export default Archive;
