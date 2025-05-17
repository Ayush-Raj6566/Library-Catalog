// src/pages/Dashboard.jsx

import React, { useState } from 'react';

const Dashboard = () => {
  // For demo, toggle between 'reader' and 'admin'
  const [userType] = useState('reader'); // Change to 'admin' to test

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Welcome to the Dashboard</h1>

      <div className="mb-4">
        <strong>User Type:</strong> {userType}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-medium mb-2">Your Borrowed Books</h2>
        <ul className="list-disc pl-6">
          <li>Book 1 - Due: 20 May</li>
          <li>Book 2 - Due: 25 May</li>
        </ul>
      </div>

      {userType === 'admin' && (
        <div className="p-4 border rounded bg-gray-100">
          <h2 className="text-xl font-medium mb-2">Admin Controls</h2>
          <ul className="list-disc pl-6">
            <li>Add New Book</li>
            <li>View All Users</li>
            <li>Manage Penalties</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
