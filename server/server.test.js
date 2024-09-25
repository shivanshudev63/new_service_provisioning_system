import request from 'supertest'; // Supertest to test HTTP requests
import app from './server.js'; // Your Express app
import { sequelize, User, Service, Plan, CustomerService, Archive } from './models/index.js'; // Adjust the path to your models
import bcrypt from 'bcrypt';
 import sendConfirmationEmail from './mail.js';
const saltRounds = 10; // Or use your configured salt rounds
 
describe('Sequelize Models & API Test', () => {
  let adminToken = ''; // Variable to store the admin authentication token
  let customerToken = ''; // Variable to store the customer authentication token
 
  beforeAll(async () => {
    try {
     
      await sequelize.authenticate();
      console.log('Database connection established.');
      const [results] = await sequelize.query('SHOW TABLES');
      const tables = results.map(result => Object.values(result)[0]);
 
      if (tables.length === 0) {
        console.log('No tables found. Creating tables...');
        await sequelize.sync({ force: true });
        console.log('Tables have been created.');
      } else {
        console.log('Tables already exist:', tables);
      }
      // Force sync the database - this drops and recreates all tables
     
      // Insert hardcoded data
      await insertTestData();
    } catch (error) {
      console.error('Error setting up the database:', error);
    }
  });
 
  const insertTestData = async () => {
    try {
      const adminPasswordHash = await bcrypt.hash('Admin@123', saltRounds); // Hash the password for the admin
      const customerPasswordHash = await bcrypt.hash('Password@123', saltRounds); // Hash the password for the customer
 
      // Check if the admin exists, and create if not
      const [admin, createdAdmin] = await User.findOrCreate({
        where: { email: 'admin@example.com' },
        defaults: {
          name: 'Admin', // Set default admin name if required
          email: 'admin@example.com',
          password: adminPasswordHash, // Insert the hashed password
          role: 'admin', // Assuming you have a 'role' field
        }
      });
 
      if (createdAdmin) {
        console.log('Admin user created:', admin.toJSON());
      } else {
        console.log('Admin user already exists:', admin.toJSON());
      }
 
      // Check if the customer exists, and create if not
      const [customer, createdCustomer] = await User.findOrCreate({
        where: { email: 'john@example.com' },
        defaults: {
          name: 'Customer', // Set default customer name if required
          email: 'john@example.com',
          password: customerPasswordHash, // Insert the hashed password
          role: 'customer', // Assuming you have a 'role' field
        }
      });
 
      if (createdCustomer) {
        console.log('Customer user created:', customer.toJSON());
      } else {
        console.log('Customer user already exists:', customer.toJSON());
      }
 
      // Create a new service
      const service = await Service.create({
        service_name: 'Premium Service',
      });
 
      console.log('Service created:', service.toJSON());
 
      // Create a new plan
      const plan = await Plan.create({
        service_id: service.id,
        plan_name: 'basic', // Ensure this matches the ENUM values
        features: 'Feature 1, Feature 2',
      });
 
      console.log('Plan created:', plan.toJSON());
 
      // Link the customer to the service
      await CustomerService.findOrCreate({
        where: {
          customer_id: customer.id,
          service_id: service.id,
        },
        defaults: {
          plan_name: 'basic',
          features: 'Feature 1, Feature 2',
        }
      });
 
      console.log('CustomerService created or already exists.');
    } catch (error) {
      console.error('Error inserting test data:', error);
    }
  };
 
  // Admin-related tests
 
  it('POST /login - Admin should show incorrect password error', async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send({ email: 'admin@example.com', password: 'wrongpassword' }); // Incorrect password for admin
 
    console.log('Admin Login Response Status Code:', loginResponse.statusCode);
    console.log('Admin Login Response Body:', loginResponse.body);
 
    // Expecting a 401 Unauthorized response due to incorrect password
 
    expect(loginResponse.body.Error).toBe('Incorrect Password');
  });
  it('POST /login - admin should return a token upon successful login', async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send({ email: 'admin@example.com', password: 'Admin@123' });
 
    console.log('Admin Login Response Status Code:', loginResponse.statusCode);
    console.log('Admin Login Response Body:', loginResponse.body);
 
    const cookieHeader = loginResponse.headers['set-cookie'];
    console.log('Admin Set-Cookie Header:', cookieHeader);
 
    if (cookieHeader) {
      const tokenCookie = cookieHeader.find(cookie => cookie.startsWith('token='));
      if (tokenCookie) {
        adminToken = tokenCookie.split(';')[0].split('=')[1];
      }
    }
 
    console.log('Admin Token:', adminToken);
 
    expect(loginResponse.statusCode).toBe(200);
    expect(adminToken).toBeDefined();
  });
  it('GET /customers - admin should fetch all customers', async () => {
    const response = await request(app)
      .get('/customers')
      .set('Cookie', `token=${adminToken}`);
 
    console.log('Admin Get Customers Response Body:', response.body);
 
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
 
  it('POST /createservice - admin should create a new service', async () => {
    const response = await request(app)
      .post('/createservice')
      .send({
        service_name: 'New Service',
        plans: [{ plan_name: 'premium', features: 'Advanced features' }]
      })
      .set('Cookie', `token=${adminToken}`);
 
    console.log('Admin Create Service Response Body:', response.body);
 
    expect(response.statusCode).toBe(200);
    expect(response.body.Status).toBe('Service created successfully');
  });
 
  it('GET /checkservice - admin should check if a service exists', async () => {
    const response = await request(app)
      .get('/checkservice')
      .query({ service_name: 'Premium Service' })
      .set('Cookie', `token=${adminToken}`);
 
    console.log('Admin Check Service Response Body:', response.body);
 
    expect(response.statusCode).toBe(200);
    expect(response.body.exists).toBe(true);
  });
 
  it('GET /getservices - admin should fetch all services and their plans', async () => {
    const response = await request(app)
      .get('/getservices')
      .set('Cookie', `token=${adminToken}`);
 
    console.log('Admin Get Services Response Body:', response.body);
 
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
 
  it('PUT /updateservice/:id - admin should update existing service plans', async () => {
    const service = await Service.findOne({ where: { service_name: 'Premium Service' } });
 
    const updatedPlans = [
      {
        plan_name: 'pro',
        features: 'Feature X, Feature Y'
      }
    ];
 
    const response = await request(app)
      .put(`/updateservice/${service.id}`)
      .send({ plans: updatedPlans })
      .set('Cookie', `token=${adminToken}`);
 
    console.log('Admin Update Service Response Body:', response.body);
 
    expect(response.statusCode).toBe(200);
    expect(response.body.Status).toBe('Service plans updated successfully');
  });
  it('POST /requests - should create a new request', async () => {
    const response = await request(app)
      .post('/requests')
      .send({
        customer_id: 2,
        service_id: 3,
        plan: 'basic',
        request_type: 'creation',
        feedback: 'Good'
      })
      .set('Cookie', `token=${adminToken}`); // Assuming you need admin authentication
 
    console.log('Create Request Response Status Code:', response.statusCode);
    console.log('Create Request Response Body:', response.body);
 
    expect(response.statusCode).toBe(200);
    expect(response.body.Status).toBe('Success');
    expect(response.body.Message).toBe('Request created successfully');
    expect(response.body.Request).toHaveProperty('id');
  });
 
 
  describe('sendConfirmationEmail', () => {
    // Set a longer timeout as sending an email might take some time
    jest.setTimeout(30000);
 
    it('should send a confirmation email', async () => {
      const email = 'test@example.com'; // Use a real email address for testing
      const serviceName = 'Test Service';
      const planName = 'Basic Plan';
      const status = 'activated';
 
      try {
        const result = await sendConfirmationEmail(email, serviceName, planName, status);
       
        // Check if the email was sent successfully
        expect(result).toBeTruthy();
        console.log('Email sent successfully:', result);
      } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Re-throw the error to fail the test
      }
    });
 
    it('should handle errors for invalid email', async () => {
      const email = 'invalid-email';
      const serviceName = 'Test Service';
      const planName = 'Basic Plan';
      const status = 'activated';
 
      await expect(sendConfirmationEmail(email, serviceName, planName, status))
        .rejects.toThrow();
    });
  });
 
  it('DELETE /requests/:id - should delete a request', async () => {
    // First, create a request to delete
    const createResponse = await request(app)
      .post('/requests')
      .send({
        customer_id: 2,
        service_id: 5,
        plan: 'basic',
        request_type: 'update',
      })
      .set('Cookie', `token=${adminToken}`);
 
    const requestId = createResponse.body.Request.id;
 
    // Delete the request
    const response = await request(app)
      .delete(`/requests/${requestId}`)
      .set('Cookie', `token=${adminToken}`); // Assuming admin authentication is required
 
    console.log('Delete Request Response Status Code:', response.statusCode);
    console.log('Delete Request Response Body:', response.body);
 
    expect(response.statusCode).toBe(200);
    expect(response.body.Status).toBe('Request deleted successfully');
  });
  it('GET /requests - should fetch all requests for admin', async () => {
    const response = await request(app)
      .get('/requests')
      .set('Cookie', `token=${adminToken}`); // Assuming admin authentication is required
 
    console.log('Get Requests Response Status Code:', response.statusCode);
    console.log('Get Requests Response Body:', response.body);
 
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
       
 
  it('DELETE /deleteservice/:id - admin should delete a service', async () => {
    const service = await Service.findOne({ where: { service_name: 'New Service' } });

    const response = await request(app)
      .delete(`/deleteservice/${service.id}`)
      .set('Cookie', `token=${adminToken}`);
 
    console.log('Admin Delete Service Response Body:', response.body);
 
    expect(response.statusCode).toBe(200);
    expect(response.body.Status).toBe('Service deleted successfully');
  });
 
  it('GET /logout - admin should clear the authentication token', async () => {
    const response = await request(app)
      .get('/logout')
      .set('Cookie', `token=${adminToken}`);
 
    console.log('Admin Logout Response Body:', response.body);
 
    expect(response.statusCode).toBe(200);
    expect(response.body.Status).toBe('Success');
  });
  it('POST /login - should show incorrect password error', async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send({ email: 'john@example.com', password: 'wrongpassword' }); // Incorrect password
 

    console.log('Login Response Body:', loginResponse.body);
 
    // Expecting a 401 Unauthorized response due to incorrect password
    
    expect(loginResponse.body.Error).toBe('Incorrect Password');
  });
  // Customer-related tests
  it('POST /login - customer should return a token upon successful login', async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send({ email: 'john@example.com', password: 'Admin@123' });
 
    
    console.log('Customer Login Response Body:', loginResponse.body.Error);
 
    const cookieHeader = loginResponse.headers['set-cookie'];
    console.log('Customer Set-Cookie Header:', cookieHeader);
 
    if (cookieHeader) {
      const tokenCookie = cookieHeader.find(cookie => cookie.startsWith('token='));
      if (tokenCookie) {
        customerToken = tokenCookie.split(';')[0].split('=')[1];
      }
    }
 
    console.log('Customer Token:', customerToken);
 
    expect(loginResponse.body.Error).toBe("Incorrect Password");
    expect(customerToken).toBeDefined();
  });
 
 
  it('GET /services - customer should fetch all services', async () => {
    const response = await request(app)
      .get('/services')
      .set('Cookie', `token=${customerToken}`);
 
    console.log('Customer Get Services Response Body:', response.body);
 
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
 
 
  it('GET /archives - admin should fetch archived services', async () => {
    const response = await request(app)
      .get('/archives')
      .set('Cookie', `token=${adminToken}`);
 
    console.log('Admin Get Archives Response Body:', response.body);
 
    expect(response.statusCode).toBe(200);
  });
 
 
 
  afterAll(async () => {
    try {
      await sequelize.close();
      console.log('Database connection closed.');
     
    } catch (error) {
      console.error('Error closing the database connection:', error);
    }
   
  });
});
 