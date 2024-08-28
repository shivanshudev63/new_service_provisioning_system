import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import User from './models/User.js';
import { sequelize, Customer, Service, Plan } from './models/index.js';

const saltRounds = 10;
const app = express();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(cookieParser());

// Middleware to verify if the user is authenticated
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "You are not authenticated" });
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json({ Error: "Token is not okay" });
            } else {
                console.log("Decoded token:", decoded);
                req.userId = decoded.id;
                req.name = decoded.name;
                next();
            }
        });
    }
};

// Middleware to verify if the user is an admin
const verifyAdmin = async (req, res, next) => {
    try {
        console.log("User ID from token:", req.userId);
        const user = await User.findByPk(req.userId);
        console.log("Fetched User:", user);
        if (user && user.role === 'admin') {
            next();
        } else {
            console.log("Access denied: User role is not admin");
            return res.status(403).json({ Error: "Access denied, admin only." });
        }
    } catch (err) {
        console.error("Error verifying admin:", err);
        return res.status(500).json({ Error: "Server error" });
    }
};

// Route to fetch customer data by ID
app.get('/customer/:id', async (req, res) => {
    try {
        const customer = await Customer.findOne({
            where: { customer_id: req.params.id },
            include: [{
                model: Service,
                through: { attributes: [] },
            }],
        });

        if (customer) {
            const customerDetails = {
                customer_id: customer.id,
                name: customer.name,
                services_enrolled: customer.Services.map(service => ({
                    service_name: service.service_name,
                    plan: service.plan,
                    features: service.features,
                })),
            };
            return res.json(customerDetails);
        } else {
            return res.status(404).json({ error: "Customer not found" });
        }
    } catch (err) {
        console.error("Error fetching customer data:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

// Route to create a new service
app.post('/createservice', verifyUser, verifyAdmin, async (req, res) => {
    try {
        const { service_name, plans } = req.body;

        // Check if the plans array exists and has at least one element
        if (!service_name || !plans || !Array.isArray(plans) || plans.length === 0) {
            return res.status(400).json({ Error: "Invalid data provided" });
        }

        // Log the received plans to debug
        console.log("Received plans:", plans);

        // Create the service
        const service = await Service.create({
            service_name
        });

        // Create the plans associated with the service
        const servicePlans = plans.map(plan => ({
            service_id: service.id,
            plan_name: plan.plan_name, // Ensure this matches the frontend data structure
            features: plan.features
        }));

        await Plan.bulkCreate(servicePlans);

        return res.json({ Status: "Service created successfully" });
    } catch (err) {
        console.error("Error creating service:", err);
        return res.status(500).json({ Error: "Error creating service" });
    }
});

// Route to check if a service name already exists
app.get('/checkservice', async (req, res) => {
    try {
        const { service_name } = req.query;
        const existingService = await Service.findOne({ where: { service_name } });
        if (existingService) {
            return res.json({ exists: true });
        }
        return res.json({ exists: false });
    } catch (err) {
        console.error("Error checking service name:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

// Route to log out
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: "Success" });
});

// Start the server
app.listen(8081, () => {
    console.log("Running... at port 8081");

    // Sync the database
    sequelize.sync({ force: false })
        .then(() => {
            console.log("Database & tables created!");
        })
        .catch(err => console.error("Error creating tables:", err));
});
