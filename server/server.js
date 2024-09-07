import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import User from "./models/User.js";
import Request from "./models/Request.js";
import {
  sequelize,
  Service,
  Plan,
  CustomerService,
  Archive,
} from "./models/index.js";
const saltRounds = 10;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

// Middleware to verify if the user is authenticated
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({
      Error:
        "USER NOT VERIFIED - Basically a guest at your own party. Care to actually join?",
    });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Token is not okay" });
      } else {
        console.log("Decoded token:", decoded); // Add this line
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
    console.log("User ID from token:", req.userId); // Add this line
    const user = await User.findByPk(req.userId);
    console.log("Fetched User:", user); // Add this line
    if (user && user.role === "admin") {
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

// app.get("/", verifyUser, (req, res) => {
//   return res.json({ Status: "Success", name: req.name });
// });

app.get("/", verifyUser, (req, res) => {
  return res.json({
    Status: "Success",
    name: req.name,
  });
});

app.get("/customers", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const customers = await User.findAll({
      where: { role: "customer" },
      attributes: ["id", "name", "email"], // Specify the attributes you want to return
    });

    if (customers.length > 0) {
      return res.json(customers);
    } else {
      return res.status(404).json({ Error: "No customers found" });
    }
  } catch (err) {
    console.error("Error fetching customers:", err);
    return res.status(500).json({ Error: "Server error" });
  }
});
app.post("/register", async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
      role: "customer", // Automatically assign 'customer' role
    });
    return res.json({ Status: "Success" });
  } catch (err) {
    console.error("Error inserting data in server:", err);
    return res.json({ Error: "Error inserting data in server" });
  }
});
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (isPasswordValid) {
        const token = jwt.sign(
          { id: user.id, name: user.name, role: user.role },
          "jwt-secret-key",
          { expiresIn: "1d" }
        );
        res.cookie("token", token);
        console.log(user.id);
        return res.json({ Status: "Success", role: user.role, id: user.id });
      } else {
        return res.json({ Error: "Incorrect Password" });
      }
    } else {
      return res.json({ Error: "Unregistered user" });
    }
  } catch (err) {
    return res.json({ Error: "Login error in server" });
  }
});

// Route to fetch customer data by ID
// app.get("/customer/:id", async (req, res) => {
//   try {
//     const customer = await Customer.findOne({
//       where: { customer_id: req.params.id },
//       include: [
//         {
//           model: Service,
//           through: { attributes: [] },
//         },
//       ],
//     });

//     if (customer) {
//       const customerDetails = {
//         customer_id: customer.id,
//         name: customer.name,
//         services_enrolled: customer.Services.map((service) => ({
//           service_name: service.service_name,
//           plan: service.plan,
//           features: service.features,
//         })),
//       };
//       return res.json(customerDetails);
//     } else {
//       return res.status(404).json({ error: "Customer not found" });
//     }
//   } catch (err) {
//     console.error("Error fetching customer data:", err);
//     return res.status(500).json({ error: "Server error" });
//   }
// });

app.post("/createservice", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const { service_name, plans } = req.body;

    // Check if the plans array exists and has at least one element
    if (
      !service_name ||
      !plans ||
      !Array.isArray(plans) ||
      plans.length === 0
    ) {
      return res.status(400).json({ Error: "Invalid data provided" });
    }

    // Log the received plans to debug
    console.log("Received plans:", plans);

    // Create the service
    const service = await Service.create({
      service_name,
    });

    // Create the plans associated with the service
    const servicePlans = plans.map((plan) => ({
      service_id: service.id,
      plan_name: plan.plan_name, // Ensure this matches the frontend data structure
      features: plan.features,
    }));

    await Plan.bulkCreate(servicePlans);

    return res.json({ Status: "Service created successfully" });
  } catch (err) {
    console.error("Error creating service:", err);
    return res.status(500).json({ Error: "Error creating service" });
  }
});

// Middleware to verify if the user is an admin

app.get("/checkservice", async (req, res) => {
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

// Route to fetch all services and their plans
app.get("/getservices", async (req, res) => {
  try {
    const services = await Service.findAll({
      include: {
        model: Plan,
        attributes: ["plan_name", "features"],
      },
    });

    // Format services and their plans
    const formattedServices = services.map((service) => ({
      service_name: service.service_name,
      id: service.id,
      plans: service.Plans.reduce(
        (acc, plan) => ({
          ...acc,
          [plan.plan_name]: plan.features,
        }),
        {}
      ),
    }));

    res.json(formattedServices);
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ Error: "Server error" });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});

// done hai
// Route to update an existing service

app.put("/updateservice/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { plans } = req.body;
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ Error: "Service not found" });
    }

    if (plans && Array.isArray(plans)) {
      await Plan.destroy({ where: { service_id: id } });
      console.log("Existing plans removed");

      // Create new plans
      const servicePlans = plans.map((plan) => ({
        service_id: id,
        plan_name: plan.plan_name,
        features: plan.features,
      }));

      console.log("New Plans:", servicePlans);
      await Plan.bulkCreate(servicePlans);
      console.log("New plans created");
    }

    return res.json({ Status: "Service plans updated successfully" });
  } catch (err) {
    console.error("Error updating service plans:", err);
    return res.status(500).json({ Error: "Error updating service plans" });
  }
});

app.delete("/deleteservice/:id", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ Error: "Service not found" });
    }

    await Plan.destroy({ where: { service_id: id } });
    await service.destroy();

    return res.json({ Status: "Service deleted successfully" });
  } catch (err) {
    return res.status(500).json({ Error: "Error deleting service" });
  }
});

//For customer enrollment
app.get("/services", async (req, res) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ Error: "Failed to fetch services" });
  }
});

app.get("/services/:customer_id", async (req, res) => {
  try {
    const { customer_id } = req.params;

    const customerServices = await CustomerService.findAll({
      where: { customer_id },
      include: {
        model: Service,
        attributes: ["id", "service_name"],
      },
    });

    // Map and return the services
    const services = customerServices.map((cs) => ({
      id: cs.Service.id,
      service_name: cs.Service.service_name,
    }));

    res.json(services);
  } catch (error) {
    console.error("Error fetching user-specific services:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/plans", async (req, res) => {
  try {
    const plans = await Plan.findAll();
    res.json(plans);
  } catch (err) {
    console.error("Error fetching plans:", err);
    res.status(500).json({ Error: "Failed to fetch plans" });
  }
});

// In your existing Express server
app.post("/customer-service/enroll", verifyUser, async (req, res) => {
  try {
    const { customer_id, service_id, plan } = req.body;

    // Find the selected service and plan
    const service = await Service.findByPk(service_id);
    const selectedPlan = await Plan.findOne({
      where: {
        service_id: service_id,
        plan_name: plan, // Use plan_name instead of plan
      },
    });
    console.log(selectedPlan);
    if (!service || !selectedPlan) {
      return res.status(404).json({ Error: "Service or Plan not found" });
    }

    await CustomerService.create({
      customer_id: customer_id,
      service_id: service_id,
      plan_name: plan, // Include the plan_name in the creation
      features: selectedPlan.features, // Assuming you want to store the features from the plan
    });

    return res.json({
      Status: "Success",
      Message: "Service enrolled successfully",
    });
  } catch (err) {
    console.error("Error enrolling service:", err);
    return res.status(500).json({ Error: "Error enrolling service" });
  }
});

app.post("/requests", async (req, res) => {
  try {
    const { customer_id, service_id, plan, request_type } = req.body;

    const service = await Service.findByPk(service_id);
    const selectedPlan = await Plan.findOne({
      where: {
        service_id: service_id,
        plan_name: plan,
        // Use plan_name instead of plan
      },
    });
    if (!service || !selectedPlan) {
      return res.status(404).json({ Error: "Service or Plan not found" });
    }

    const newRequest = await Request.create({
      customer_id,
      service_id,
      plan,
      features: selectedPlan.features,
      request_type, // Optional: Add features if needed
    });

    return res.json({
      Status: "Success",
      Message: "Request created successfully",
      Request: newRequest,
    });
  } catch (err) {
    console.error("Error creating request:", err);
    return res.status(500).json({ Error: "Error creating request" });
  }
});

// Endpoint to approve a request
app.post("/approve-request/:id", async (req, res) => {
  try {
    const requestId = req.params.id;

    // Fetch the request based on ID
    const request = await Request.findByPk(requestId);

    if (!request) {
      return res.status(404).json({ Error: "Request not found" });
    }

    // Fetch service and user information based on the request

    let updateResult;

    switch (request.request_type) {
      case "update":
        updateResult = await CustomerService.update(
          { features: request.features, plan_name: request.plan },
          {
            where: {
              customer_id: request.customer_id,
              service_id: request.service_id,
            },
          }
        );

        if (updateResult[0] !== 0) {
          await Request.destroy({ where: { id: requestId } });
          return res.json({
            Status: "Success",
            Message: "Request approved and service updated",
          });
        } else {
          return res
            .status(400)
            .json({ Status: "Failed", Error: "Update failed" });
        }

      case "termination":
        const service = await CustomerService.findOne({
          where: {
            customer_id: request.customer_id,
            service_id: request.service_id,
          },
        });
        const name = await User.findOne({ where: { id: request.customer_id } });

        if (!service) {
          return res
            .status(404)
            .json({ Error: "Service not found for this customer" });
        }

        if (!name) {
          return res.status(404).json({ Error: "Customer ID not found" });
        }
        await CustomerService.destroy({
          where: {
            customer_id: request.customer_id,
            service_id: request.service_id,
          },
        });
        await Archive.create({
          customer_id: request.customer_id,
          customer_name: name.name,
          service_id: request.service_id,
          plan_name: service.plan_name,
          features: service.features,
          terminated_at: new Date(),
        });

        await Request.destroy({ where: { id: requestId } });
        return res.json({
          Status: "Success",
          Message: "Request approved and service terminated",
        });

      case "creation":
        await CustomerService.create({
          customer_id: request.customer_id,
          service_id: request.service_id,
          plan_name: request.plan,
          features: request.features,
        });

        await Request.destroy({ where: { id: requestId } });
        return res.json({
          Status: "Success",
          Message: "Request approved and service enrolled",
        });

      default:
        return res.status(400).json({ Error: "Invalid request type" });
    }
  } catch (err) {
    console.error("Error approving request:", err);
    return res.status(500).json({ Error: "Error approving request" });
  }
});

app.delete("/requests/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Request.destroy({ where: { id } });
    if (result) {
      res.json({ Status: "Request deleted successfully" });
    } else {
      res.status(404).json({ Status: "Request not found" });
    }
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ Status: "Failed to delete request" });
  }
});
// Endpoint to get all requests for admin
app.get("/requests", async (req, res) => {
  try {
    const requests = await Request.findAll();
    return res.json(requests);
  } catch (err) {
    console.error("Error fetching requests:", err);
    return res.status(500).json({ Error: "Error fetching requests" });
  }
});

app.delete("/customer/:id", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Move customer's services to archive
    const customerServices = await CustomerService.findAll({
      where: { customer_id: id },
    });
    const customer = await User.findByPk(id);
    if (!customer) {
      return res.status(404).json({ Error: "Customer not found" });
    }
    const customerName = customer.name;

    await Promise.all(
      customerServices.map((service) =>
        Archive.create({
          customer_id: service.customer_id,
          service_id: service.service_id,
          plan_name: service.plan_name,
          features: service.features,
customer_name:customerName
        })
      )
    );

    // Remove customer from User table
    await User.destroy({ where: { id } });

    // Remove customer services
    await CustomerService.destroy({ where: { customer_id: id } });

    res.json({ Status: "Customer removed successfully" });
  } catch (err) {
    console.error("Error removing customer:", err);
    res.status(500).json({ Error: "Server error" });
  }
});

app.get("/customers", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const customers = await User.findAll({
      where: { role: "customer" },
      attributes: ["id", "name", "email"], // Specify the attributes you want to return
    });

    if (customers.length > 0) {
      return res.json(customers);
    } else {
      return res.status(404).json({ Error: "No customers found" });
    }
  } catch (err) {
    console.error("Error fetching customers:", err);
    return res.status(500).json({ Error: "Server error" });
  }
});

//Customer services fetch:
app.get("/customer/:customer_id", async (req, res) => {
  try {
    const { customer_id } = req.params;

    const customer = await User.findOne({
      where: { id: customer_id, role: "customer" },
      attributes: ["id", "name", "email"], // Include fields as needed
    });

    if (!customer) {
      return res.status(404).json({ Error: "Customer not found" });
    }

    const services = await CustomerService.findAll({
      where: { customer_id: customer_id },
      include: [
        {
          model: Service,
          attributes: ["service_name"], // Include service name from the Service table
        },
      ],
      attributes: ["plan_name", "features", "service_id"], // Include plan and features from CustomerService table
    });

    const responseData = {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      services_enrolled: services.map((service) => ({
        service_id: service.service_id,
        service_name: service.Service.service_name,
        plan: service.plan_name,
        features: service.features,
      })),
    };

    return res.json(responseData);
  } catch (err) {
    console.error("Error fetching customer details:", err);
    return res.status(500).json({ Error: "Error fetching customer details" });
  }
});

app.get(
  "/customer-service/:customer_id/service/:service_id",
  async (req, res) => {
    const { customer_id, service_id } = req.params;
    try {
      const customerService = await CustomerService.findOne({
        where: { customer_id, service_id },
      });
      if (customerService) {
        res.json({ plan_name: customerService.plan_name });
      } else {
        res.status(404).json({ Error: "Service not found for this customer" });
      }
    } catch (error) {
      console.error("Error fetching current plan:", error);
      res.status(500).json({ Error: "Failed to fetch current plan" });
    }
  }
);

app.put("/customer-service/update", async (req, res) => {
  const { customer_id, service_id, new_plan, features } = req.body;
  try {
    const [updated] = await CustomerService.update(
      { features: features, plan_name: new_plan },
      { where: { customer_id, service_id } }
    );

    if (updated === 1) {
      res.json({ Status: "Success" });
    } else {
      res.status(400).json({ Status: "Failed", Error: "Update failed" });
    }
  } catch (error) {
    console.error("Error updating service plan:", error);
    res.status(500).json({ Error: "Failed to update service plan" });
  }
});

app.get("/plans/:planId/service/:serviceId", async (req, res) => {
  try {
    const { planId, serviceId } = req.params;

    // Find the plan with the given planId
    const plan = await Plan.findOne({
      where: { plan_name: planId, service_id: serviceId },
    });

    console.log("Fetched Plan:", plan); // Log the fetched plan

    if (!plan) {
      return res
        .status(404)
        .json({ message: "Plan not found for the specified service" });
    }

    // Return the features of the plan
    res.json({ features: plan.features });
  } catch (err) {
    console.error("Error fetching plan features:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Termiate
// Route to archive a service
app.post("/archive", verifyUser, async (req, res) => {
  try {
    const { customer_id, service_id } = req.body;

    // Find the service to archive
    const service = await CustomerService.findOne({
      where: { customer_id, service_id },
    });
    const name = await User.findOne({ where: { id: customer_id } });
    if (!service) {
      return res
        .status(404)
        .json({ Error: "Service not found for this customer" });
    }
    if (!name) {
      return res.status(404).json({ Error: "Id not found for this customer" });
    }
    //2181
    //8083
    // Archive the service
    await Archive.create({
      customer_id: customer_id,
      customer_name: name.name,
      service_id: service_id,
      plan_name: service.plan_name,
      features: service.features,
    });

    return res.json({ Status: "Service archived successfully" });
  } catch (err) {
    console.error("Error archiving service:", err);
    return res.status(500).json({ Error: "Error archiving service" });
  }
});

// Route to delete a service from CustomerService table
app.delete("/customer-services/:service_id", verifyUser, async (req, res) => {
  try {
    const { service_id } = req.params;

    // Delete the service from CustomerService table
    const deleted = await CustomerService.destroy({
      where: { service_id: service_id },
    });

    if (deleted) {
      return res.json({ Status: "Service deleted successfully" });
    } else {
      return res.status(404).json({ Error: "Service not found" });
    }
  } catch (err) {
    console.error("Error deleting service:", err);
    return res.status(500).json({ Error: "Error deleting service" });
  }
});

app.get("/archives", async (req, res) => {
  try {
    const archives = await Archive.findAll();
    res.json(archives);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch archive data" });
  }
});

app.listen(8081, () => {
  console.log("Running... at port 8081");

  // Sync the database
  sequelize
    .sync({ force: false })
    .then(() => {
      console.log("Database & tables created!");
    })
    .catch((err) => console.error("Error creating tables:", err));
});
