import React, { useEffect, useState } from 'react';
import './NewBooking.css';
import { enqueueSnackbar } from 'notistack';
import servicesList from '../Data/ServicesData'; // Import the reusable services list
import Select from 'react-select'; // Import react-select

const EditBooking = ({ initialData, onClose }) => {
  const [formData, setFormData] = useState({
    branch: '',
    companyName: '',
    contactPerson: '',
    contactNumber: '',
    email: '',
    date: '',
    services: [], // Updated to handle multiple services
    totalAmount: '',
    selectTerm: '',
    amount: '',
    paymentDate: '',
    pan: '',
    gst: '',
    notes: '',
    bank:'',
    closed:'',
    status:'',
    funddisbursement:''
  });

  const [errors, setErrors] = useState({});

  // Populate the form with initialData if available
  useEffect(() => {
    if (initialData) {
      setFormData({
        branch: initialData.branch_name || '',
        companyName: initialData.company_name ? initialData.company_name.toUpperCase() : '', 
        contactPerson: initialData.contact_person || '',
        contactNumber: initialData.contact_no || '',
        email: initialData.email || '',
        date: initialData.date ? new Date(initialData.date).toLocaleDateString('en-GB').split('/').reverse().join('-') : '', // format to 'dd-mm-yyyy',
        services: initialData.services || '',
        totalAmount: initialData.total_amount || '',
        selectTerm: initialData.term_1 ? 'Term 1' : initialData.term_2 ? 'Term 2' : '',
        amount: initialData.term_1 || initialData.term_2 || '',
        paymentDate: initialData.term_1_payment_date || '',
        pan: initialData.pan || '',
        gst: initialData.gst || '',
        notes: initialData.remark || '',
        bank: initialData.bank,
        status: initialData.status || '',
        closed:initialData.closed_by || '',
        funddisbursement:initialData.fund_disbursement || ''
      });
    }
  }, [initialData]);

  // Handle multiple services selection
  const handleServiceChange = (selectedOptions) => {
    setFormData({
      ...formData,
      services: selectedOptions ? selectedOptions.map(option => option.value) : [], // Map selected options to an array
    });
  };
  // Prepare service options
  const serviceOptions = servicesList.map((service) => ({
    value: service.value,
    label: service.label,
    isDisabled: service.disabled, // Optional: Handle disabled options
  }));
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate form
  const validate = () => {
    let validationErrors = {};
    if (!formData.branch) validationErrors.branch = "Branch is required";
    if (!formData.companyName) validationErrors.companyName = "Company Name is required";
    if (!formData.contactPerson) validationErrors.contactPerson = "Contact Person is required";
    if (!formData.contactNumber || isNaN(formData.contactNumber)) validationErrors.contactNumber = "Valid Contact Number is required";
    if (!formData.email) validationErrors.email = "Email is required";
    if (!formData.date) validationErrors.date = "Date is required";
    if (!formData.totalAmount || isNaN(formData.totalAmount)) validationErrors.totalAmount = "Valid Total Amount is required";
    if (!formData.selectTerm) validationErrors.selectTerm = "Select Term is required";
    if (!formData.amount || isNaN(formData.amount)) validationErrors.amount = "Valid Amount is required";
    if (!formData.paymentDate) validationErrors.paymentDate = "Payment Date is required";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (validate()) {
      const userSession = JSON.parse(localStorage.getItem('userSession'));
  
      if (userSession) {
        const dataToSubmit = {
          branch_name: formData.branch,
          company_name: formData.companyName,
          contact_person: formData.contactPerson,
          email: formData.email,
          contact_no: Number(formData.contactNumber),
          services: formData.services,
          closed_by:formData.closed,
          total_amount: Number(formData.totalAmount),
          term_1: formData.selectTerm === "Term 1" ? Number(formData.amount) : initialData.term_1 || null,
          term_2: formData.selectTerm === "Term 2" ? Number(formData.amount) : initialData.term_2 || null,
          term_3: formData.selectTerm === "Term 3" ? Number(formData.amount) : null, // Ensure Term 3 is handled correctly
          pan: formData.pan,
          gst: formData.gst,
          remark: formData.notes,
          date: formData.date,
          bank: formData.bank,
          status:formData.status,
          funddisbursement:formData.funddisbursement
        };
  
        const apiEndpoint = `https://crm-backend-6kqk.onrender.com/booking/editbooking/${initialData._id}`; // Adjust to your actual endpoint
        // const apiEndpoint = `http://localhost:5353/booking//editbooking/${initialData._id}`
  
        fetch(apiEndpoint, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'user-role': userSession.user_role, // Add user role to headers
          },
          body: JSON.stringify(dataToSubmit),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Error updating booking');
            }
            return response.json();
          })
          .then(() => {
            enqueueSnackbar('Booking Updated successfully!', { variant: 'success' }); // Use notistack's success notification
            if (onClose) onClose(); // Close the form after submission
          })
          .catch((error) => {
            console.error('Error:', error);
            enqueueSnackbar(`Error Updating  booking: ${error.message}`, { variant: 'error' }); // Use notistack's error notification
          });
      } else {
        enqueueSnackbar('User session not found. Please log in again.', { variant: 'warning' }); // Use notistack's warning notification
      }
    }
  };
  


  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h2>Edit Booking</h2>

      {/* Form input fields (keep them unchanged) */}
      <div className="form-group">
        <label>Branch</label>
        <select name="branch" value={formData.branch} onChange={handleChange}>
          <option value="">Select branch</option>
          <option>1206 A</option>
          <option>808</option>
          <option>404</option>
        </select>
        {errors.branch && <p className="error">{errors.branch}</p>}
      </div>

      <div className="form-group">
        <label>Company Name</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Enter company name"
        />
        {errors.companyName && <p className="error">{errors.companyName}</p>}
      </div>

      <div className="form-group">
        <label>Contact Person Name</label>
        <input
          type="text"
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleChange}
          placeholder="Enter contact person name"
        />
        {errors.contactPerson && <p className="error">{errors.contactPerson}</p>}
      </div>

      <div className="form-group">
        <label>Contact Number</label>
        <input
          type="text"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          placeholder="Enter contact number"
        />
        {errors.contactNumber && <p className="error">{errors.contactNumber}</p>}
      </div>
      <div className="form-group">
        <label>Email ID</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email ID"
        />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>

      <div className="form-group">
        <label>Booking Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          placeholder="dd-mm-yyyy"
        />
        {errors.date && <p className="error">{errors.date}</p>}
      </div>

      <div className="form-group">
          <label>Services</label>
          <Select
            options={serviceOptions}
            value={serviceOptions.filter(option => formData.services.includes(option.value))} // Match selected options
            onChange={handleServiceChange}
            isMulti // Enable multi-select
            placeholder="Select Services"
          />
          {errors.services && <p className="error">{errors.services}</p>}
        </div>

       {/* Services field */}
       {/* <div className="form-group">
          <label>Services</label>
          <select name="services" value={formData.services} onChange={handleChange}>
            <option value="">Select Service</option>
            {servicesList.map((service) => (
              <option key={service.value} value={service.value} disabled={service.disabled}>
                {service.label}
              </option>
            ))}
          </select>
          {errors.services && <p className="error">{errors.services}</p>}
        </div> */}


      <div className="form-group">
        <label>Total Amount</label>
        <input
          type="number"
          name="totalAmount"
          value={formData.totalAmount}
          onChange={handleChange}
          placeholder="Enter total amount"
        />
        {errors.totalAmount && <p className="error">{errors.totalAmount}</p>}
      </div>

      <div className="form-group">
        <label>Select Term</label>
        <select name="selectTerm" value={formData.selectTerm} onChange={handleChange}>
          <option value="">Select Term</option>
          <option>Term 1</option>
          <option>Term 2</option>
          <option>Term 3</option>
        </select>
        {errors.selectTerm && <p className="error">{errors.selectTerm}</p>}
      </div>
        <div className="form-group">
          <label>Recieved Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter Recieved Amount"
          />
          {errors.amount && <p className="error">{errors.amount}</p>}
        </div>
        <div className="form-group">
          <label>Closed By</label>
          <input
            type="text"
            name="closed"
            value={formData.closed}
            onChange={handleChange}
            placeholder="Lead Closed by"
          />
          {errors.closed && <p className="error">{errors.closed}</p>}
        </div>

      <div className="form-group">
        <label>Payment Date</label>
        <input
          type="date"
          name="paymentDate"
          value={formData.paymentDate}
          onChange={handleChange}
          placeholder="Enter Date"
        />
        {errors.paymentDate && <p className="error">{errors.paymentDate}</p>}
      </div>

      <div className="form-group">
        <label>PAN Number</label>
        <input
          type="text"
          name="pan"
          value={formData.pan}
          onChange={handleChange}
          placeholder="Enter PAN"
        />
      </div>

      <div className="form-group">
        <label>GST Number </label>
        <input
          type="text"
          name="gst"
          value={formData.gst}
          onChange={handleChange}
          placeholder="Enter GST"
        />
      </div>
      <div className="form-group">
          <label>Bank Name</label>
          <select name="bank" value={formData.bank} onChange={handleChange}>
            <option value="">Select Bank</option>
            <option>Kotak Mahindra Bank</option>
            <option>HDFC Bank</option>
            <option>Razorpay</option>
          </select>
          {errors.bank && <p className="error">{errors.bank}</p>}
        </div>
        <div className="form-group">
        <label> Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        {errors.status && <p className="error">{errors.status}</p>}
      </div>
      <div className="form-group">
        <label>Fund disbursement</label>
        <input
          type="text"
          name="funddisbursement"
          value={formData.funddisbursement}
          onChange={handleChange}
          placeholder="Enter After Fund disbursement data"
        />
        {errors.funddisbursement && <p className="error">{errors.funddisbursement}</p>}
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Enter any notes"
          rows="3"
        ></textarea>
      </div>

      <button className="submit-btn" type="submit">Update</button>
    </form>
  );
};

export default EditBooking;
