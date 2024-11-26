// import React, { useState } from 'react';
// import './NewBooking.css';
// import { enqueueSnackbar } from 'notistack';
// import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
// import servicesList from '../Data/ServicesData'; // Import the reusable services list
// import Select from 'react-select'; // Import react-select

// const AddBooking = ({ onClose }) => {
//   const [formData, setFormData] = useState({
//     branch: '',
//     companyName: '',
//     contactPerson: '',
//     contactNumber: '',
//     email: '',
//     date: '',
//     services: [], // Updated to handle multiple services
//     totalAmount: '',
//     selectTerm: '',
//     amount: '',
//     paymentDate: '',
//     closed: '',
//     pan: '',
//     gst: '',
//     notes: '',
//     bank: '',
//     funddisbursement: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [openDialog, setOpenDialog] = useState(false); // Dialog state for popup
//   const [bookingId, setBookingId] = useState(null); // Store booking ID

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // Handle multiple services selection
//   const handleServiceChange = (selectedOptions) => {
//     setFormData({
//       ...formData,
//       services: selectedOptions ? selectedOptions.map(option => option.value) : [], // Map selected options to an array
//     });
//   };

//   // Prepare service options
//   const serviceOptions = servicesList.map((service) => ({
//     value: service.value,
//     label: service.label,
//     isDisabled: service.disabled, // Optional: Handle disabled options
//   }));

//   // Validation
//   const validate = () => {
//     let validationErrors = {};

//     if (!formData.branch) validationErrors.branch = "Branch is required";
//     if (!formData.contactPerson) validationErrors.contactPerson = "Contact Person is required";
//     const contactNumberRegex = /^\d{10}$/;
//     if (!formData.contactNumber || !contactNumberRegex.test(formData.contactNumber)) {
//       validationErrors.contactNumber = "Valid Contact Number is required (10 digits, no spaces)";
//     }
//     if (!formData.email) validationErrors.email = "Email is required";
//     if (!formData.date) validationErrors.date = "Date is required";
//     if (!formData.totalAmount || isNaN(formData.totalAmount)) {
//       validationErrors.totalAmount = "Valid Total Amount is required";
//     }
//     if (!formData.selectTerm) validationErrors.selectTerm = "Select Term is required";
//     if (!formData.amount || isNaN(formData.amount)) {
//       validationErrors.amount = "Valid Amount is required";
//     }
//     if (Number(formData.amount) > Number(formData.totalAmount)) {
//       validationErrors.amount = "Received Amount cannot be greater than Total Amount";
//     }
//     if (!formData.paymentDate) validationErrors.paymentDate = "Payment Date is required";
//     const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
//     if (formData.pan && !panRegex.test(formData.pan)) {
//       validationErrors.pan = "Valid PAN is required (10 characters, no spaces, no special characters)";
//     }
//     if (formData.services.length === 0) {
//       validationErrors.services = "At least one service must be selected";
//     }

//     setErrors(validationErrors);
//     return Object.keys(validationErrors).length === 0;
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (validate()) {
//       const userSession = JSON.parse(localStorage.getItem('userSession'));

//       if (userSession) {
//         const dataToSubmit = {
//           user_id: userSession.user_id,
//           bdm: userSession.name,
//           branch_name: formData.branch,
//           company_name: formData.companyName.toUpperCase(),
//           contact_person: formData.contactPerson,
//           email: formData.email,
//           contact_no: Number(formData.contactNumber),
//           services: formData.services, // Submit as an array
//           total_amount: Number(formData.totalAmount),
//           closed_by: formData.closed || "",
//           term_1: formData.selectTerm === "Term 1" ? Number(formData.amount) : null,
//           term_2: formData.selectTerm === "Term 2" ? Number(formData.amount) : null,
//           term_3: formData.selectTerm === "Term 3" ? Number(formData.amount) : null,
//           term_1_payment_date: formData.selectTerm === "Term 1" ? formData.paymentDate : null,
//           term_2_payment_date: formData.selectTerm === "Term 2" ? formData.paymentDate : null,
//           term_3_payment_date: formData.selectTerm === "Term 3" ? formData.paymentDate : null,
//           pan: formData.pan,
//           gst: formData.gst || "N/A",
//           remark: formData.notes,
//           date: formData.date,
//           bank: formData.bank,
//           status: 'Pending',
//           funddisbursement: formData.funddisbursement
//         };

//         const apiEndpoint = 'https://crm-backend-6kqk.onrender.com/booking/addbooking';

//         fetch(apiEndpoint, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(dataToSubmit),
//         })
//           .then((response) => {
//             if (!response.ok) {
//               throw new Error('Error creating booking');
//             }
//             return response.json();
//           })
//           .then((res) => {
//             const bookingId = res.booking_id.toUpperCase(); // Use booking_id from the backend response
//             setBookingId(bookingId); // Set booking ID to show in the popup
//             setOpenDialog(true); // Open the dialog popup
//             enqueueSnackbar(`Booking created successfully!`, { variant: 'success' });

//             setFormData({
//               branch: '',
//               companyName: '',
//               contactPerson: '',
//               contactNumber: '',
//               email: '',
//               date: '',
//               services: [], // Reset services as an array
//               totalAmount: '',
//               closed: '',
//               selectTerm: '',
//               amount: '',
//               paymentDate: '',
//               pan: '',
//               gst: '',
//               notes: '',
//               bank: '',
//               funddisbursement: ''
//             });

//             if (onClose) onClose();
//           })
//           .catch((error) => {
//             console.error('Error:', error);
//             enqueueSnackbar(`Error creating booking: ${error.message}`, { variant: 'error' });
//           });
//       } else {
//         enqueueSnackbar('User session not found. Please log in again.', { variant: 'warning' });
//       }
//     }
//   };

//   const handleDialogClose = () => {
//     setOpenDialog(false);
//     if (onClose) onClose();
//   };

//   return (
//     <div>
//       <form className="booking-form" onSubmit={handleSubmit}>
//         <h2>Create New Booking</h2>

//         <div className="form-group">
//           <label>Branch</label>
//           <select name="branch" value={formData.branch} onChange={handleChange}>
//             <option value="">Select branch</option>
//             <option>1206 A</option>
//             <option>808</option>
//             <option>404</option>
//             <option>Admin</option>
//           </select>
//           {errors.branch && <p className="error">{errors.branch}</p>}
//         </div>
        
//         <div className="form-group">
//           <label>Company Name</label>
//           <input
//             type="text"
//             name="companyName"
//             value={formData.companyName}
//             onChange={handleChange}
//             placeholder="Enter company name"
//           />
//           {errors.companyName && <p className="error">{errors.companyName}</p>}
//         </div>

//         <div className="form-group">
//           <label>Contact Person Name</label>
//           <input
//             type="text"
//             name="contactPerson"
//             value={formData.contactPerson}
//             onChange={handleChange}
//             placeholder="Enter contact person name"
//           />
//           {errors.contactPerson && <p className="error">{errors.contactPerson}</p>}
//         </div>

//         <div className="form-group">
//           <label>Contact Number</label>
//           <input
//             type="Number"
//             name="contactNumber"
//             value={formData.contactNumber}
//             onChange={handleChange}
//             placeholder="Enter contact number"
//           />
//           {errors.contactNumber && <p className="error">{errors.contactNumber}</p>}
//         </div>

//         <div className="form-group">
//           <label>Email ID</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="Enter email ID"
//           />
//           {errors.email && <p className="error">{errors.email}</p>}
//         </div>

//         <div className="form-group">
//           <label>Booking Date</label>
//           <input
//             type="Date"
//             name="date"
//             value={formData.date}
//             onChange={handleChange}
//             placeholder="dd-mm-yyyy"
//           />
//           {errors.date && <p className="error">{errors.date}</p>}
//         </div>
//         <div className="form-group">
//           <label>Services</label>
//           <Select
//             options={serviceOptions}
//             value={serviceOptions.filter(option => formData.services.includes(option.value))} // Match selected options
//             onChange={handleServiceChange}
//             isMulti // Enable multi-select
//             placeholder="Select Services"
//           />
//           {errors.services && <p className="error">{errors.services}</p>}
//         </div>
//         {/* <div className="form-group">
//           <label>Services</label>
//           <Select
//             options={serviceOptions} // Use the options
//             value={serviceOptions.find((option) => option.value === formData.services)} // Match selected option
//             onChange={handleServiceChange} // Handle change
//             isClearable={true} // Allow clearing the selection
//             placeholder="Select Service"
//             isDisabled={false} // Handle disabled state (optional)
//           />
//           {errors.services && <p className="error">{errors.services}</p>}
//         </div> */}


//         <div className="form-group">
//           <label>Total Amount</label>
//           <input
//             type="number"
//             name="totalAmount"
//             value={formData.totalAmount}
//             onChange={handleChange}
//             placeholder="Enter total amount"
//           />
//           {errors.totalAmount && <p className="error">{errors.totalAmount}</p>}
//         </div>

//         <div className="form-group">
//           <label>Select Term</label>
//           <select name="selectTerm" value={formData.selectTerm} onChange={handleChange}>
//             <option value="">Select Term</option>
//             <option>Term 1</option>
//             <option>Term 2</option>
//             <option>Term 3</option>
//           </select>
//           {errors.selectTerm && <p className="error">{errors.selectTerm}</p>}
//         </div>

//         <div className="form-group">
//           <label>Recieved Amount</label>
//           <input
//             type="number"
//             name="amount"
//             value={formData.amount}
//             onChange={handleChange}
//             placeholder="Enter Recieved Amount"
//           />
//           {errors.amount && <p className="error">{errors.amount}</p>}
//         </div>
//         <div className="form-group">
//           <label>Closed By</label>
//           <input
//             type="text"
//             name="closed"
//             value={formData.closed}
//             onChange={handleChange}
//             placeholder="Lead Closed by"
//           />
//           {errors.closed && <p className="error">{errors.closed}</p>}
//         </div>

//         <div className="form-group">
//           <label>Payment Date</label>
//           <input
//             type="Date"
//             name="paymentDate"
//             value={formData.paymentDate}
//             onChange={handleChange}
//             placeholder="Enter Date"
//           />
//           {errors.paymentDate && <p className="error">{errors.paymentDate}</p>}
//         </div>

//         <div className="form-group">
//           <label>PAN Number </label>
//           <input
//             type="text"
//             name="pan"
//             value={formData.pan}
//             onChange={handleChange}
//             placeholder="Enter PAN"
//           />
//           {errors.pan && <p className="error">{errors.pan}</p>}
//         </div>

//         <div className="form-group">
//           <label>GST Number </label>
//           <input
//             type="text"
//             name="gst"
//             value={formData.gst}
//             onChange={handleChange}
//             placeholder="Enter GST"
//           />
//           {errors.gst && <p className="error">{errors.gst}</p>}
//         </div>
//         <div className="form-group">
//           <label>Bank Name</label>
//           <select name="bank" value={formData.bank} onChange={handleChange}>
//             <option value="">Select Bank</option>
//             <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
//             <option value="HDFC Bank">HDFC Bank</option>
//             <option value="Razorpay">Razorpay</option>
//           </select>
//           {errors.bank && <p className="error">{errors.bank}</p>}
//         </div>
//         <div className="form-group">
//         <label>After Fund disbursement</label>
//         <input
//           type="text"
//           name="funddisbursement"
//           value={formData.funddisbursement}
//           onChange={handleChange}
//           placeholder="Enter After Fund disbursement  %"
//         />
//         {errors.funddisbursement && <p className="error">{errors.funddisbursement}</p>}
//       </div>

//         <div className="form-group">
//           <label>Notes</label>
//           <textarea
//             name="notes"
//             value={formData.notes}
//             onChange={handleChange}
//             placeholder="Enter any notes"
//             rows="3"
//           ></textarea>
//         </div>
//         {/* <div className="form-group">
//           <label>Services</label>
//           <Select
//             options={serviceOptions}
//             value={serviceOptions.filter(option => formData.services.includes(option.value))} // Match selected options
//             onChange={handleServiceChange}
//             isMulti // Enable multi-select
//             placeholder="Select Services"
//           />
//           {errors.services && <p className="error">{errors.services}</p>}
//         </div> */}

//         <button className="submit-btn" type="submit">Submit</button>
//       </form>

//       {/* Dialog for Popup */}
//       <Dialog open={openDialog} onClose={handleDialogClose}>
//         <DialogTitle>Booking Created Successfully!</DialogTitle>
//         <DialogContent>
//           <h1>Your Booking ID is: {bookingId}</h1>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleDialogClose} color="primary">Close</Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// // export default AddBooking;
