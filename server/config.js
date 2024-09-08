// config.js
const config = {
    development: {
      database: 'sps',
      username: 'root',
      password: 'Itone@123',
      host: 'localhost',
      dialect: 'mysql'
    },
    test: {
      database: 'test_db',
      username: 'root',
      password: 'Itone@123',
      host: 'localhost',
      dialect: "sqlite",
      storage: ":memory:"
    },
    production: {
      database: 'sps_prod',
      username: 'root',
      password: 'Itone@123',
      host: 'localhost',
      dialect: 'mysql'
    }
  };
  
  export default config[process.env.NODE_ENV || 'development'];

  