import React from 'react';
import Home from './Home';
import CreateService from './CreateService';

const AdminHome = () => {
  return (
    <div>
      <Home />
      <h2>Create a New Service</h2>
      <CreateService />
    </div>
  );
};

export default AdminHome;
