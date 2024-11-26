import React, { useState, useEffect, useCallback } from 'react';
import './LoginSignup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/WhiteEnego.png'; // Adjust the path based on your folder structure

const API_URL = "https://crm-backend-6kqk.onrender.com";

const LoginSignup = ({ onLoginSuccess }) => {
  const [isActive, setIsActive] = useState(false); // Toggle between login and signup form
  const [formData, setFormData] = useState({ email: '', password: '', name: '', phone: '' });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false); // To show loading state during API calls
  const navigate = useNavigate();

  // Logout user wrapped with useCallback to prevent function recreation
  const logoutUser = useCallback(() => {
    localStorage.removeItem('userSession');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('loginTime');
    console.log("Session expired. Logging out...");
    navigate('/');
  }, [navigate]); // Add 'navigate' as a dependency

  // Check session on component load
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('userSession'));
    if (session) {
      const currentTime = Date.now();
      const loginTime = session.loginTime;

      // Check if session is older than 20 hours
      if (currentTime - loginTime >= 20 * 60 * 60 * 1000) {
        logoutUser();
      } else {
        const remainingTime = 20 * 60 * 60 * 1000 - (currentTime - loginTime);
        setTimeout(logoutUser, remainingTime);
      }
    }
  }, [logoutUser]);

  // Toggle between Sign Up and Sign In
  const handleRegisterClick = () => {
    setIsActive(true);
    clearErrors();
  };

  const handleLoginClick = () => {
    setIsActive(false);
    clearErrors();
  };

  // Clear form errors
  const clearErrors = () => {
    setFormErrors({});
  };

  // Form validation function
  const validateForm = () => {
    let errors = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (isActive && !formData.name) {
      errors.name = "Name is required for registration";
    }

    return errors;
  };

  // Handle Registration API Call
  const registerUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseBody = await response.json();
      if (response.ok) {
        console.log("Registration successful:", responseBody);
        clearForm();
      } else {
        setFormErrors({ email: responseBody.message || "Registration failed" });
      }
    } catch (error) {
      setFormErrors({ email: "An error occurred. Please try again." });
    }
    setLoading(false);
  };

  // Handle Login API Call
  const loginUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const responseBody = await response.json();
      if (response.ok) {
        console.log("Login successful:", responseBody);

        // Extract user data from the response
        const { _id, name, email, user_role } = responseBody.user;

        // Store session data, including user_id (_id), email, name, user_role
        localStorage.setItem('userSession', JSON.stringify({
          token: responseBody.token,  // Assuming token is part of responseBody
          user_id: _id,  // Save user _id as user_id
          name,  // Save user name
          email,  // Save user email
          user_role,  // Save user role
          loginTime: Date.now(),
        }));

        // Set authentication flag
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('loginTime', Date.now()); // Store the login timestamp

        // Set a timer for automatic logout after 20 hours
        setTimeout(logoutUser, 20 * 60 * 60 * 1000);

        onLoginSuccess(); // Trigger login success callback
        navigate('/dashboard'); // Redirect to the Dashboard page
      } else {
        setFormErrors({ login: responseBody.message || "Login failed" });
      }
    } catch (error) {
      setFormErrors({ login: "An error occurred. Please try again." });
    }
    setLoading(false);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      if (isActive) {
        registerUser(); // Register User API Call
      } else {
        loginUser(); // Login User API Call
      }
    } else {
      setFormErrors(errors);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Reset errors as user types
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (name === 'email' && /\S+@\S+\.\S+/.test(value)) {
        delete updatedErrors.email;
      }
      if (name === 'password' && value.length >= 6) {
        delete updatedErrors.password;
      }
      return updatedErrors;
    });
  };

  // Clear form after submission
  const clearForm = () => {
    setFormData({ email: '', password: '', name: '', phone: '' });
  };

  return (
    <div className={`container ${isActive ? 'active' : ''}`} id="container">
      {/* Signup Form */}
      <div className="form-container sign-up">
        <form onSubmit={handleSubmit}>
          <h1>Create Account</h1>
          <div className="social-icons">
            <button className="icon" type="button">
              <FontAwesomeIcon icon={faGoogle} />
            </button>
            <button className="icon" type="button">
              <FontAwesomeIcon icon={faFacebookF} />
            </button>
          </div>
          <span>or use your email for registration</span>
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
            {formErrors.name && <p className="error">{formErrors.name}</p>}
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            {formErrors.email && <p className="error">{formErrors.email}</p>}
          </div>
          <div>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            {formErrors.password && <p className="error">{formErrors.password}</p>}
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
      </div>

      {/* Login Form */}
      <div className="form-container sign-in">
        <form onSubmit={handleSubmit}>
          <h1>Enego CRM</h1>
          <h1>Sign In</h1>
          <div className="social-icons">
            <button className="icon" type="button">
              <FontAwesomeIcon icon={faGoogle} />
            </button>
            <button className="icon" type="button">
              <FontAwesomeIcon icon={faFacebookF} />
            </button>
          </div>
          <span>or use your email and password</span>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            {formErrors.email && <p className="error">{formErrors.email}</p>}
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            {formErrors.password && <p className="error">{formErrors.password}</p>}
          </div>
          {formErrors.login && <p className="error">{formErrors.login}</p>}
          <button type="submit" disabled={loading}>
            Sign In
          </button>
        </form>
      </div>

      {/* Toggle Form */}
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of the site features</p>
            <button className="hidden" onClick={handleLoginClick} disabled={loading}>Sign In</button>
          </div>
          <div className="toggle-panel toggle-right">
            {/* Add your logo here */}
            <img src={logo} alt="Company Logo" style={{ width: '500px', marginBottom:'10px' }} />
            {/* <button className="hidden" onClick={handleRegisterClick} disabled={loading}>Sign Up</button> Uncomment to use */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
