import React from 'react'
import './styles/Sign.css'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function SignUp() {

  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [secondForm, setSecondForm] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [districts, setDistricts] = useState([]);

  const stateDistricts = {
    "Andhra Pradesh": ["Srikakulam", "Visakhapatnam", "East Godavari", "West Godavari", "Krishna"],
    "Assam": ["Cachar", "Darrang", "Dibrugarh", "Goalpara", "Kamrup"],
    "Bihar": ["Champaran", "Muzaffarpur", "Darbhanga", "Saharsa", "Purnea"],
    "Chhattisgarh": ["Durg", "Bastar", "Raipur", "Bilaspur", "Raigarh"],
    "Gujarat": ["Ahmedabad", "Amreli", "Banaskantha", "Bharuch", "Vadodara / Baroda"],
    "Haryana": ["Hissar", "Gurgaon", "Jind", "Mahendragarh / Narnaul", "Ambala"],
    "Himachal Pradesh": ["Bilashpur", "Chamba", "Kangra", "Kinnaur", "Kullu"],
    "Jharkhand": ["Santhal Paragana / Dumka", "Hazaribagh", "Dhanbad", "Palamau", "Ranchi"],
    "Karnataka": ["Bangalore", "Kolar", "Tumkur", "Mysore", "Mandya"],
    "Kerala": ["Alappuzha", "Kannur", "Eranakulam", "Kottayam", "Kozhikode"],
    "Madhya Pradesh": ["Jabalpur", "Balaghat", "Chhindwara", "Narsinghpur", "Seoni / Shivani"],
    "Maharashtra": ["Bombay", "Thane", "Raigad", "Ratnagiri", "Nasik"],
    "Orissa": ["Balasore", "Bolangir", "Cuttack", "Dhenkanal", "Ganjam"],
    "Punjab": ["Gurdaspur", "Amritsar", "Kapurthala", "Jalandhar", "Hoshiarpur"],
    "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Barmer", "Bharatpur"],
    "Tamil Nadu": ["Chengalpattu MGR / Kanchipuram", "South Arcot / Cuddalore", "North Arcot / Vellore", "Salem", "Coimbatore"],
    "Telangana": ["Hyderabad", "Nizamabad", "Medak", "Mahabubnagar", "Nalgonda"],
    "Uttar Pradesh": ["Saharanpur", "Muzaffarnagar", "Meerut", "Buland Shahar", "Aligarh"],
    "Uttarakhand": ["Nainital", "Almorah", "Pithorgarh", "Chamoli", "Uttar Kashi"],
    "West Bengal": ["24 Parganas", "Nadia", "Murshidabad", "Burdwan", "Birbhum"]
  }

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    phone: '',
    password: '',
    aadharNum: '',
    location: {
      state: '',
      district: ''
    }
  });




  const FlushText = ({ text = '', speed = 50, delay = delay, color = "rgba(201, 255, 203, 1)", size = '4rem' }) => {
    const [displayedText, setDisplayedText] = useState("");
    useEffect(() => {
        if (!text) return;
        
        const animateText = () => {
            let index = 0;
            setDisplayedText(""); // Reset text before starting new animation

            const interval = setInterval(() => {
                setDisplayedText(prev => prev + text[index]);
                index++;
                
                if (index === text.length - 1) {
                    clearInterval(interval);
                    // Wait for delay time before starting next animation
                    setTimeout(animateText, delay);
                }
            }, speed);

            return () => clearInterval(interval);
        };

        // Initial delay before first animation
        const initialTimeout = setTimeout(animateText, delay);
        
        return () => {
            clearTimeout(initialTimeout);
        };
    }, [text, speed, delay]);

    const isMultiline = text ? text.includes("\n") : false; // Add null check here

    return isMultiline ? (
      <pre
        style={{
          fontSize: size,
          color: color,
          maxWidth: "70%",
          wordWrap: "break-word",
          margin: "0 auto",
          whiteSpace: 'pre-wrap',
          maxHeight: '90%',
        }}
      >
        {displayedText}
      </pre>
    ) : (
      <div style={{fontSize: size, color: color }}>
        {displayedText}
      </div>
    );
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'state') {
      setSelectedState(value);
      const distArr = stateDistricts[value] || [];
      setDistricts(distArr);
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          state: value,
          district: '' // Reset district when state changes
        }
      }));
    } else if (name === 'district') {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          district: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', formData);

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.data.user));
        
        // Navigate to dashboard with aadhar number
        navigate(`/dashboard/${formData.aadharNum}`);
      }
    } catch (error) {
      console.error('Registration Error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };


 
    return (
      <div className='login_main'>
      <div className='info'>
      <div className='flush-text'>
      <FlushText 
      text='Growing Dreams, Cultivating Prosperity – Smart Loans for Every Farmer'
      speed={50}
      delay= {1000}
      size='4rem'></FlushText>
      </div>
      </div>
      <div className='login-container'>
        <div className='logo-login_signup'> </div>
        <h1 className='signup-h1'>Create account</h1>
        {error && <div className="error-message">{error}</div>}
        <input 
          type='text' 
          placeholder='Enter Firstname' 
          name='firstName'  // correct, matches state
          onChange={handleInputChange} 
          value={formData.firstName} 
          className='firstname'
        />
        <input 
          type='text' 
          placeholder='Enter Lastname' 
          name='lastName'   // was 'Lastname', should be 'lastname'
          onChange={handleInputChange} 
          value={formData.lastName} 
          className='lastname'
        />
        <input 
          type='text' 
          placeholder='Enter Middlename (Optional)' 
          name='middleName'
          onChange={handleInputChange} 
          value={formData.middleName} 
          className='middlename'
        />
        <input 
          type='text' 
          placeholder='Enter Mobile number' 
          name='phone'  // was 'Number', should be 'phoneNumber'
          onChange={handleInputChange} 
          value={formData.phone} 
          className='phone_signup'
        />
        <input 
          type='text' 
          placeholder='Enter Password' 
          name='password'  // was 'OTP', should be 'otp'
          onChange={handleInputChange} 
          value={formData.password} 
          className='otp_signup'
        />
        <input 
          type='number' 
          placeholder='Enter Aadhar number' 
          name='aadharNum'  // was 'aadhar', should be 'aadharNumber'
          onChange={handleInputChange} 
          value={formData.aadharNum} 
          className='aadhar'
        />
        {/* State Dropdown */}
        <select 
          name='state'  // Add name attribute
          value={formData.location.state}
          onChange={handleInputChange} 
          className='state'
        >
          <option value="">Select State</option>
          {Object.keys(stateDistricts).map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        {/* District Dropdown */}
        <select 
          name='district'  // Add name attribute
          value={formData.location.district}
          onChange={handleInputChange} 
          disabled={!selectedState} 
          className='district'
        >
          <option value="">Select District</option>
          {districts && districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
        
        <button className='signup' onClick={handleSubmit}>Sign Up</button>
      </div>
  
      </div>
    )
  }


