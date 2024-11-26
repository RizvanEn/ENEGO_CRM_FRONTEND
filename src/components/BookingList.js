// BookingList.js
import React from 'react';
import { Link } from 'react-router-dom';
import './BookingList.css';
import './DashboardContent.css';

const BookingList = () => {
  return (
    <div className="dashboard-container">
    <div className="booking-list">
      <h2>Booking List</h2>
      <ul>
        <li>Booking 1</li>
        <li>Booking 2</li>
        <li>Booking 3</li>
      </ul>
      <Link to="/new-booking" className="new-booking-link">
        Create New Booking
      </Link>
    </div>
    </div>
  );
};

export default BookingList;
