import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DashboardContent from '../components/DashboardContent';
import BookingList from '../components/BookingList';
// import NewBooking from '../components/NewBooking';
import AddBooking from '../components/NewBooking';
// import AddBooking from '../components/Updatedbooking';
import History from '../components/History';
import './Dashboard.css';
import Scorecard from '../components/Scorecard'; // Adjust the path if necessary


const Dashboard = ({ onLogout }) => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Fetching user session data from localStorage
    const userSession = JSON.parse(localStorage.getItem('userSession')) || {};

    // Check if the userSession contains the name and set it to the state
    if (userSession && userSession.name) {
      setUsername(userSession.name); // Set the name from session
    } else {
      console.warn('No user name found in session data');
    }
  }, []);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <div className="header">
          {/* Display Hello with the fetched username */}
          <h1>Hello, {username ? username : 'User'}😀!</h1>
          <p>Welcome to your dashboard. Here you can view your statistics and manage your data.</p>
          <button onClick={onLogout} className="logout-button">Logout</button>
        </div>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<DashboardContent />} />
          <Route path="booking" element={<BookingList />} />
          <Route path="new-booking" element={<AddBooking />} />
          <Route path="history" element={<History />} />
          <Route path="scorecard" element={<Scorecard />} /> {/* New route for Scorecard */}
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
