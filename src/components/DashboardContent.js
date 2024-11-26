import React, { useEffect, useState } from 'react';
import LineChart from '../components/LineChart'; // Ensure you have these chart components
import './DashboardContent.css';

const BaseUrl = 'https://crm-backend-6kqk.onrender.com'; // Your backend URL

const DashboardContent = () => {
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0); // State to store total revenue
  const [totalUsers, setTotalUsers] = useState(0); // State to store total users
  const [userRole, setUserRole] = useState(''); // Keep userRole if needed for conditional rendering
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]); // State for recent bookings
  const [todayRevenue, setTodayRevenue] = useState(0); // State to store today's revenue


  useEffect(() => {
    const userSession = JSON.parse(localStorage.getItem('userSession'));

    if (userSession && userSession.user_id) {
      setUserRole(userSession.user_role);
      fetchTotalBookings(userSession); // Fetch total bookings and calculate revenue
      fetchTotalUsers(); // Fetch total number of users
      fetchRecentBookings(userSession); // Fetch the most recent bookings
    } else {
      console.error('User session not found.');
      setLoading(false);
    }
  }, []);

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };


  // Fetch total bookings and calculate total revenue and today's revenue
const fetchTotalBookings = (userSession) => {
  setLoading(true);

  // Construct the correct API endpoint based on user role
  const url = ['admin', 'dev', 'senior admin'].includes(userSession.user_role)
    ? `${BaseUrl}/booking/all`
    : `${BaseUrl}/user/bookings/${userSession.user_id}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      const bookingsData = data.Allbookings || data;

      // Calculate the total bookings and revenue
      const totalBookingCount = bookingsData.length || 0;
      const totalRevenueAmount = bookingsData.reduce((acc, booking) => acc + booking.term_1 + booking.term_2 + booking.term_3, 0);

      // Calculate today's revenue by filtering bookings created today
      const today = getTodayDate();
      const todayRevenueAmount = bookingsData
        .filter((booking) => booking.createdAt.split('T')[0] === today)
        .reduce((acc, booking) => acc + booking.term_1 + booking.term_2 + booking.term_3, 0);

      setTotalBookings(totalBookingCount);
      setTotalRevenue(totalRevenueAmount);
      setTodayRevenue(todayRevenueAmount);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching total bookings:', error);
      setLoading(false);
    });
};


  // Fetch total users
  const fetchTotalUsers = () => {
    fetch(`${BaseUrl}/user/all`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        return response.json();
      })
      .then((data) => {
        setTotalUsers(data.no_of_users); // Set the total number of users from the response
      })
      .catch((error) => {
        console.error('Error fetching total users:', error);
      });
  };

  // Fetch recent bookings (sorted by createdAt)
  const fetchRecentBookings = (userSession) => {
    setLoading(true);

    const url = ['admin', 'dev', 'senior admin'].includes(userSession.user_role)
      ? `${BaseUrl}/booking/all`
      : `${BaseUrl}/user/bookings/${userSession.user_id}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch recent bookings');
        }
        return response.json();
      })
      .then((data) => {
        const bookingsData = data.Allbookings || data;

        // Sort by createdAt (descending) and slice the first 10 bookings
        const recentBookingsData = bookingsData
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 7);

        setRecentBookings(recentBookingsData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching recent bookings:', error);
        setLoading(false);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Top Row: Stats Cards */}
      <div className="stats-row">
        <div className="card">
          <div className="card-icon bookings-icon">
            <i className="fas fa-briefcase"></i>
          </div>
          <div className="card-info">
            <h3>Bookings</h3>
            <p>{totalBookings}</p>
            <span className="card-update">Your Total Bookings</span>
          </div>
        </div>
        <div className="card">
          <div className="card-icon users-icon">
            <i className="fas fa-chart-bar"></i>
          </div>
          <div className="card-info">
            <h3>Total Users</h3>
            {/* Dynamically display total users */}
            <p>{totalUsers}</p>
            <span className="card-update"> CRM users this month</span> {/* Example dynamic update */}
          </div>
        </div>
        <div className="card">
          <div className="card-icon revenue-icon">
            <i className="fas fa-store"></i>
          </div>
          <div className="card-info">
            <h3>Revenue</h3>
            <p>{totalRevenue.toLocaleString()} INR</p>
            <span className="card-update">Total Revenue</span>
          </div>
        </div>
        <div className="card">
  <div className="card-icon followers-icon">
    <i className="fas fa-calendar-day"></i>
  </div>
  <div className="card-info">
    <h3>Today's Revenue</h3>
    <p>{todayRevenue.toLocaleString()} INR</p>
    <span className="card-update">Revenue from Today's Bookings</span>
  </div>
</div>

      </div>

      {/* Conditionally render content based on userRole */}
      {userRole === 'admin' && (
        <div className="admin-section">
          <h4>Admin Dashboard Section</h4>
          {/* Additional content for admin users */}
        </div>
      )}

      {/* Middle Row: Charts */}
      <div className="charts-row">
        <div className="chart-container line-chart">
          <LineChart />
          <h4>Website Views</h4>
          <p>Last Campaign Performance</p>
        </div>
        <div className="chart-container green-chart">
          <LineChart />
          <h4>Daily Sales</h4>
          <p>(+15%) increase in today’s sales</p>
        </div>
        <div className="chart-container dark-chart">
          <LineChart />
          <h4>Completed Tasks</h4>
          <p>Last Campaign Performance</p>
        </div>
      </div>

      {/* Bottom Row: Recent Bookings Table */}
      <div className="bottom-row">
        <div className="recent-bookings">
          <h4>Recent Bookings</h4>
          <table>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>BDM Name</th>
                <th>Booking Date</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.company_name}</td>
                  <td>{booking.bdm}</td>
                  <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default DashboardContent;
