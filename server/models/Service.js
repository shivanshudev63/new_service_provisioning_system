import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Service = sequelize.define('Service', {
    service_name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: true
});

export default Service;
