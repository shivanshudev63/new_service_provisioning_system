import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js'; // Path to your sequelize instance

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('customer', 'admin', 'subadmin'),
        allowNull: false,
        defaultValue: 'customer'
    }
}, {
    timestamps: false // Disable createdAt and updatedAt
});

export default User;
