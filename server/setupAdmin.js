import bcrypt from 'bcrypt';
import sequelize from './sequelize.js'; // Path to your sequelize instance
import User from './models/User.js'; // Path to your User model

const saltRounds = 10;

const createAdmin = async () => {
    try {
        await sequelize.authenticate();

        const hashedPassword = await bcrypt.hash('adminpassword', saltRounds);

        await User.create({
            name: 'Admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin'
        });

        console.log("Admin user created successfully.");

    } catch (err) {
        console.error("Error creating admin user:", err);
    } finally {
        await sequelize.close();
    }
};

createAdmin();
