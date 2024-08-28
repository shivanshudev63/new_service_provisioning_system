import sequelize from '../sequelize.js';
import Customer from './Customer.js';
import Service from './Service.js';
import Plan from './Plan.js';
// Define the many-to-many relationship
Customer.belongsToMany(Service, { through: 'CustomerService', foreignKey: 'customer_id' });
Service.belongsToMany(Customer, { through: 'CustomerService', foreignKey: 'service_id' });

// Export the models
export { sequelize, Customer, Service,Plan };
