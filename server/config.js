// config.js
const config = {
  development: {
    database: 'telsps',
    username: 'root',
    password: '12345',
    host: 'localhost',
    dialect: 'mysql'
  },
  test: {
    database: 'test_db',
    username: 'root',
    password: '12345',
    host: 'localhost',
    dialect: "mysql",
    storage: ":memory:"
  },
  production: {
    database: 'sps_prod',
    username: 'root',
    password: '12345',
    host: 'localhost',
    dialect: 'mysql'
  }
};

export default config[process.env.NODE_ENV || 'development'];

