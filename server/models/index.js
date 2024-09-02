import sequelize from '../sequelize.js';
import User from './User.js';
import Service from './Service.js';
import Plan from './Plan.js';
import CustomerService from './CustomerService.js';
import Archive from './Archive.js';

// Define the many-to-many relationship using the User model
User.belongsToMany(Service, { through: CustomerService, foreignKey: 'customer_id' });
Service.belongsToMany(User, { through: CustomerService, foreignKey: 'service_id' });

// Export the models
export { sequelize, User, Service, Plan, CustomerService,Archive };
