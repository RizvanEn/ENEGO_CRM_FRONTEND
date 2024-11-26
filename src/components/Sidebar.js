import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import './Sidebar.css';
import logo from '../assets/EnegoWhite.png'; // Adjust the path as necessary

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="Dashboard Logo" className="sidebar-logo" />
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink 
            to="/dashboard" 
            className="menu-item" 
            activeClassName="active" // This class will be added to the active link
            exact // Use exact for strict matching
          >
            <i className="fas fa-tachometer-alt"></i>
            Dashboard
          </NavLink>
        </li>
        {/* <li>
          <NavLink 
            to="/dashboard/booking" 
            className="menu-item" 
            activeClassName="active"
          >
            <i className="fas fa-book"></i>
            Booking
          </NavLink>
        </li> */}
        <li>
          <NavLink 
            to="/dashboard/new-booking" 
            className="menu-item" 
            activeClassName="active"
          >
            <i className="fas fa-plus-circle"></i>
            New Booking
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/dashboard/history" 
            className="menu-item" 
            activeClassName="active"
          >
            <i className="fas fa-history"></i>
            All Booking
          </NavLink>
        </li>
        {/* <li>
          <NavLink 
            to="/dashboard/scorecard" 
            className="menu-item" 
            activeClassName="active"
          >
            <i className="fas fa-chart-bar"></i>
            Scorecard
          </NavLink>
        </li> */}
      </ul>
    </div>
  );
};

export default Sidebar;