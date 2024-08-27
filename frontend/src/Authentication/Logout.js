import React from 'react';
import { Link } from 'react-router-dom';

const Logout = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>You were logged out</h2>
      <p>Kindly login again.</p>
      <Link to="/login">
        <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
          Login
        </button>
      </Link>
    </div>
  );
};

export default Logout;
