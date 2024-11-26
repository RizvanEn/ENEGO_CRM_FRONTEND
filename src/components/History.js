import React, { useEffect, useState } from 'react';
import './History.css';
import AddBooking from './EditBooking'; // Assuming you have the AddBooking component
import EditBooking from './EditBooking'; // Import the EditBooking component
import Popup from './Popup'; // Importing the Popup component
import DeleteConfirmationModal from './DeleteConfirmationModal'; // Import the modal
import { enqueueSnackbar } from 'notistack';
import servicesList from '../Data/ServicesData';

const BaseUrl = 'https://crm-backend-6kqk.onrender.com';
// const BaseUrl = 'http://localhost:5353';

const History = () => {
  const [bookings, setBookings] = useState([]); // Initialize bookings as an empty array
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(''); // Single input field for both company name and booking ID
  const [startDate, setStartDate] = useState(''); // Add startDate state
  const [endDate, setEndDate] = useState(''); // Add endDate state
  const [status, setStatus] = useState(''); // State for the status filter
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState(''); // Store the logged-in user's ID
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to control popup visibility
  const [editBooking, setEditBooking] = useState(null); // State to hold the booking to be edited
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete confirmation modal
  const [bookingToDelete, setBookingToDelete] = useState(null); // Track which booking to delete
  const [services, setService] = useState('');//sate for sevrvice filter

  useEffect(() => {
    const userSession = JSON.parse(localStorage.getItem('userSession'));
    if (userSession && userSession.user_id) {
      setUserRole(userSession.user_role); // Set user role
      setUserId(userSession.user_id); // Set user ID
      fetchAllBookings(userSession); // Pass userSession to the function
    } else {
      setLoading(false);
    }
  }, []);

  const handleDeleteClick = (bookingId) => {
    setBookingToDelete(bookingId); // Set the booking ID to delete
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  };

  const isBookingId = (input) => {
    return /^[0-9a-fA-F]{24}$/.test(input); // Assuming MongoDB ObjectID format (24-character hex string)
  };

  const fetchAllBookings = (userSession, filters = {}) => {
    setLoading(true);
    const { startDate, endDate, searchInput, status, services } = filters;
    const userRole = userSession.user_role;
    const userId = userSession.user_id;
    let url;

    if (['admin', 'dev', 'senior admin'].includes(userRole)) {
      url = `${BaseUrl}/booking/all`;
    } else {
      url = `${BaseUrl}/user/bookings/${userId}`;
    }

    // Handle date filtering
    if (startDate && endDate) {
      url = `${BaseUrl}/booking/bookings?startDate=${startDate}&endDate=${endDate}&userRole=${userRole}&userId=${userId}`;
    }
    // Handle search filtering
    else if (searchInput) {
      url = isBookingId(searchInput)
        ? `${BaseUrl}/user/${searchInput}?userRole=${userRole}&userId=${userId}`
        : `${BaseUrl}/user/?pattern=${searchInput}&userRole=${userRole}&userId=${userId}`;
    }
    // Handle status filtering
    else if (status) {
      url = `${BaseUrl}/booking/bookings/status?status=${status}&userRole=${userRole}&userId=${userId}`;
    }
    else if (services) {
      url = `${BaseUrl}/booking/bookings/services?service=${services}&userRole=${userRole}&userId=${userId}`;
    }
    // Debugging: log the URL being used for fetch
    // console.log('Fetching URL:', url);
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);

        const bookingsData = data.Allbookings || data;
        // Sort bookings by createdAt in descending order (latest first)
        const sortedBookings = bookingsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setBookings(sortedBookings.length > 0 ? sortedBookings : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error); // Log errors to console
        setLoading(false);
      });
  };
  const handleEditClick = (booking) => {
    setEditBooking(booking);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setEditBooking(null); // Clear the current booking on popup close
    fetchAllBookings(JSON.parse(localStorage.getItem('userSession'))); // Fetch updated bookings
  };

  const confirmDelete = () => {
    if (!bookingToDelete) return;

    fetch(`${BaseUrl}/booking/deletebooking/${bookingToDelete}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error deleting the booking');
        }
        setBookings(prevBookings => prevBookings.filter(booking => booking._id !== bookingToDelete));
        enqueueSnackbar('Booking Deleted successfully!', { variant: 'success' });
      })
      .catch(error => {
        enqueueSnackbar('Failed to delete booking!', { variant: 'error' });
      })
      .finally(() => {
        setIsDeleteModalOpen(false); // Close the delete confirmation modal
        setBookingToDelete(null); // Reset the booking to delete
      });
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setBookingToDelete(null);
  };

  // Function to handle search functionality (by booking ID, company name, date range, and status)
  const handleSearch = () => {
    const userSession = JSON.parse(localStorage.getItem('userSession')); // Fetch userSession again for search

    if (status) {
      setSearchInput('');
      setStartDate('');
      setEndDate('');
      fetchAllBookings(userSession, { status });
    }
    else if (searchInput) {
      setStartDate('');
      setEndDate('');
      fetchAllBookings(userSession, { searchInput, userId, userRole });
      setSearchInput('');
    }
    else if (startDate && endDate) {
      setSearchInput('');
      fetchAllBookings(userSession, { startDate, endDate });
    }
    else if (services) {
      setSearchInput('');
      setStartDate('');
      setEndDate('');
      fetchAllBookings(userSession, { services });
    }
    else {
      fetchAllBookings(userSession);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch(); // Trigger search when Enter key is pressed
    }
  };
  const handleCopy = (booking) => {
    const bookingDetails = `
      Booking ID: ${booking._id}
      Booking Date: ${new Date(booking.date).toLocaleDateString()}
      Payment Date: ${booking.term_1_payment_date || booking.term_2_payment_date || booking.term_3_payment_date}
      Company Name: ${booking.company_name || "N/A"}
      Contact Person: ${booking.contact_person}
      Email: ${booking.email}
      Contact Number: ${booking.contact_no}
      Service: ${booking.services}
      Total Amount: ${booking.total_amount}₹
      Received Amount: ${booking.term_1 + booking.term_2 + booking.term_3}₹
      Pending Amount: ${
        booking.total_amount - (booking.term_1 + booking.term_2 + booking.term_3)
      }₹
      Term ${booking.term_1 ? "1" : booking.term_2 ? "2" : booking.term_3 ? "3":""}:  ${booking.term_1 || booking.term_2 || booking.term_3}
      Bdm name : ${booking.bdm}
      Lead Closed By: ${booking.closed_by || "N/A"}
      GST No: ${booking.gst || "N/A"}
      PAN No: ${booking.pan}
      Bank Name: ${booking.bank}
      Notes: ${booking.remark}
      After Disbursement:${booking.after_disbursement}
      Status: ${booking.status}
    `;
    navigator.clipboard.writeText(bookingDetails).then(() => {
      enqueueSnackbar("Booking details copied to clipboard!", { variant: "success" });
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="history-page">
      <h2 className="history-header">All Bookings</h2>

      {/* Filter Container for Date and Status */}
      <div className="filter-container">
        {/* Date Filter */}
        <div className="date-filter">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)} // Updates startDate state
            placeholder="Start Date"
            onKeyDown={handleKeyPress}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)} // Updates endDate state
            placeholder="End Date"
            onKeyDown={handleKeyPress}
          />
          <button className="search-button" onClick={handleSearch}>
            Filter by Date
          </button>
        </div>
        <div className="service-filter">
          <select
            value={services}
            onChange={(e) => setService(e.target.value)}
            className="service-dropdown"
          >
            <option value="">Select Service</option>
            {servicesList.map((serviceItem) => (
              <option
                key={serviceItem.value}
                value={serviceItem.value}
                disabled={serviceItem.disabled}
              >
                {serviceItem.label}
              </option>
            ))}
          </select>
          <button className="search-button" onClick={handleSearch}>
            Filter by Service
          </button>
        </div>
        {/* Status Filter */}
        <div className="status-filter">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="status-dropdown"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button className="search-button" onClick={handleSearch}>
            Filter by Status
          </button>
        </div>
      </div>
      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search by company name or booking ID..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className="booking-list">
        {bookings.length > 0 ? (
        bookings.map((booking) => (
      <div className="booking-item" key={booking._id}>
        <div className="booking-header">
          <button className="copy-button" onClick={() => handleCopy(booking)}>
            Copy
          </button>
        </div>
        <table className="booking-table">
          <tbody>
            <tr>
              <td><strong>Booking Date</strong></td>
              <td><span class="colon-bold">:</span> &nbsp;&nbsp;{new Date(booking.date).toLocaleDateString('en-GB')}</td>
            </tr>
            <tr>
              <td><strong>Payment Date</strong></td>
              <td><span class="colon-bold">:</span> &nbsp;&nbsp;
                {(() => {
                  const date =
                    booking.term_3_payment_date ||
                    booking.term_2_payment_date ||
                    booking.term_1_payment_date;

                  return date
                    ? new Date(date).toLocaleDateString('en-GB') // 'en-GB' ensures dd/mm/yyyy format
                    : 'N/A';
                })()}
              </td>
            </tr>
            <tr>
              <td><strong>Booking ID </strong></td>
              <td style={{ textTransform: "uppercase" }}><span class="colon-bold">:</span> &nbsp;&nbsp;{booking._id}</td>
            </tr>
            <tr>
              <td><strong>Company Name </strong></td>
              <td><span class="colon-bold">:</span> &nbsp;&nbsp;<strong>{booking.company_name || "N/A"}</strong></td>
            </tr>
            <tr>
              <td><strong>Contact Person </strong></td>
              <td><span class="colon-bold">:</span> &nbsp;&nbsp;{booking.contact_person}</td>
            </tr>
            <tr>
              <td><strong>Email </strong></td>
              <td><span class="colon-bold">:</span>  &nbsp;&nbsp; {booking.email}</td>
            </tr>
            <tr>
              <td><strong>Contact Number</strong></td>
              <td><span class="colon-bold">:</span> &nbsp;&nbsp;{booking.contact_no}</td>
            </tr>
                <tr>
                  <td><strong>Service</strong></td>
                  <td>
                    <span className="colon-bold">:</span>
                    &nbsp;&nbsp;
                    <strong>{Array.isArray(booking.services) ? booking.services.join(", ") : booking.services || "N/A"}</strong>
                  </td>
                </tr>

            <tr>
              <td><strong>Term <span>{booking.term_1 ? "1" : booking.term_2 ? "2" : booking.term_3 ? "3" : ""}</span>   </strong></td>
              <td><span class="colon-bold">:</span> &nbsp;&nbsp;{booking.term_1 || booking.term_2 || booking.term_3} ₹</td>
            </tr>
            <tr>
              <td><strong>Total Amount </strong></td>
              <td><span class="colon-bold">:</span> &nbsp;&nbsp;{booking.total_amount}₹</td>
            </tr>
            <tr>
              <td><strong>Received Amount </strong></td>
              <td><span class="colon-bold">:</span> &nbsp;&nbsp;{booking.term_1 + booking.term_2 + booking.term_3}₹</td>
            </tr>
            <tr>
              <td><strong>Pending Amount </strong></td>
              <td><span class="colon-bold">:</span> &nbsp;&nbsp;
                {booking.total_amount -
                  (booking.term_1 + booking.term_2 + booking.term_3)}
                ₹
              </td>
            </tr>
            <tr>
              <td><strong>GST No </strong></td>
              <td><span class="colon-bold">:</span> &nbsp;&nbsp;{booking.gst || "N/A"}</td>
            </tr>
            <tr>
              <td><strong>PAN No </strong></td>
              <td><span class="colon-bold">:</span> &nbsp;&nbsp;{booking.pan}</td>
            </tr>
            <tr>
              <td><strong>Bank Name </strong></td>
              <td><span class="colon-bold">:</span> &nbsp;&nbsp;{booking.bank}</td>
            </tr>
            <tr>
              <td><strong>Bdm Name </strong></td>
              <td><span class="colon-bold">:</span> &nbsp;&nbsp;<strong>{booking.bdm|| "N/A"}</strong></td>
            </tr>
            <tr>
              <td><strong>Closed By </strong></td>
              <td><span class="colon-bold">:</span> &nbsp;&nbsp;{booking.closed_by || "N/A"}</td>
            </tr>
            <tr>
              <td><strong>After Fund disbursement </strong></td>
              <td><span class="colon-bold">:</span> &nbsp;&nbsp;{booking.after_disbursement || "N/A"}</td>
            </tr>
            <tr>
              <td><strong>Notes</strong></td>
              <td><span class="colon-bold">:</span> &nbsp;&nbsp;{booking.remark}</td>
            </tr>
          </tbody>
        </table>
        <div className="booking-footer">
        {userRole === "dev" &&  (
          <button className="edit-link" onClick={() => handleEditClick(booking)}>
            Edit
          </button>
        )}
          {userRole === "dev" && (
            <button
              className="delete-link"
              onClick={() => handleDeleteClick(booking._id)}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    ))
  ) : (
    <p>No bookings found for the selected filters.</p>
  )}
</div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
      <div className="total-bookings">
        Total Bookings: {bookings.length}
      </div>
      {isPopupOpen && (
        <Popup isOpen={isPopupOpen} onClose={closePopup}>
          {editBooking ? (
            <EditBooking
              initialData={editBooking} // Pass the booking data to be edited
              onClose={closePopup} // Callback to close popup after form submission
            />
          ) : (
            <AddBooking onClose={closePopup} /> // Render AddBooking if creating new booking
          )}
        </Popup>
      )}
    </div>
  );
};

export default History;
