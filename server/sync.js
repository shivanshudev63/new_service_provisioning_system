import sequelize from './sequelize.js'; // This is where your Sequelize instance is created
import User from './models/User.js'; // Import your Sequelize models

// Sync all models with the database
sequelize.sync({ force: false }) // Use { force: true } to drop and recreate tables
  .then(() => {
    console.log("Database synced successfully.");
  })
  .catch(err => {
    console.error("Error syncing database:", err);
  });
