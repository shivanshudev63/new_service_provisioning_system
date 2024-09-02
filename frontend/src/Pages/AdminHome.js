import React from 'react';
import Home from './Home';
import CreateService from '../Components/CreateService';
import AvailableServices from '../Components/AvailableServices';

const AdminHome = () => {
  return (
    <div>
      <Home />
      <AvailableServices />
      <h2>Create a New Service</h2>
      <CreateService />
      {/* <UpdateService /> */}
    </div>
  );
};

export default AdminHome;
