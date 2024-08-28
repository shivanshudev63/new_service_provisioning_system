import sequelize from './sequelize.js'; 
import User from './models/User.js'; 
sequelize.sync({ force: false }) 
  .then(() => {
    console.log("Database synced successfully.");
  })
  .catch(err => {
    console.error("Error syncing database:", err);
  });
