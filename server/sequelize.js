import { Sequelize } from 'sequelize';
import config from './config.js'; // Import the configuration

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: process.env.DB_HOST || config.host,  // Use environment variable if available
  dialect: config.dialect
});

export default sequelize;
