// config.js
const config = {
  development: {
    database: 'sps',
    username: 'admin',
    password: 'databasepassword123',
    host: 'database-1.ch5xfq1yvx7p.us-east-1.rds.amazonaws.com', // Your RDS endpoint
    dialect: 'mysql'
  },
  test: {
    database: 'test_db',
    username: 'admin',
    password: 'databasepassword123',
    host: 'database-1.ch5xfq1yvx7p.us-east-1.rds.amazonaws.com', // Your RDS endpoint
    dialect: "mysql",
    storage: ":memory:"
  },
  production: {
    database: 'sps', 
    username: 'admin', // Use your RDS username
    password: 'databasepassword123', // Use your RDS password
    host: 'database-1.ch5xfq1yvx7p.us-east-1.rds.amazonaws.com', // Your RDS endpoint
    dialect: 'mysql'
  }
};

export default config[process.env.NODE_ENV || 'development'];
