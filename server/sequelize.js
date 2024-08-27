// sequelize.js
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('sps', 'root', 'Itone@123', {
    host: 'localhost',
    dialect: 'mysql'
});

export default sequelize;
