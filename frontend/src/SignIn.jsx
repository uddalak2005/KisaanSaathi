import React from 'react'
import './styles/Sign.css'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
export default function SignIn() {

  const [formData, setFormData] = useState({
    phone: '',
    password: '' // this will store the OTP
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const FlushText = ({ text = '', speed = 50, delay = delay, color = "rgba(201, 255, 203, 1)", size = '4rem' }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
      if (!text) return; // Add early return if text is undefined
      
      let index = 0;

      const startTimeout = setTimeout(() => {
        const interval = setInterval(() => {
          setDisplayedText((prev) => prev + text[index]);
          index++;
          if (index >= text.length - 1) clearInterval(interval);
        }, speed);
      }, delay);

      return () => clearTimeout(startTimeout);
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

  const handleSubmit = async() =>{
    console.log(formData);
    try{
    axios.post('http://192.168.190.12:3000/api/auth/login', formData).then((res) => {
      if(res.status === 200 || 201){
        var token = res.data.token;
        localStorage.setItem('token',token);
        console.log(token);
      }

    })
  }
  catch(e){
    console.log(e);
  }}

  return (
    <div className='login_main'>
    <div className='info'>
    <div className='flush-text'>
    <FlushText 
    text='Grrowing Dreams, Cultivating Prosperity – Smart Loans for Every Farmer'
    speed={50}
    delay= {1000}
    size='4rem'></FlushText>
    </div>
    </div>
    <div className='login-container'>
      <div className='logo-login'> </div>
      <h1 className='singin-h1'>Log in</h1>
      <input 
        type='number' 
        name='phone'
        value={formData.phone}
        onChange={handleInputChange}
        placeholder='Enter Mobile number' 
        className='phone'
      />
      <input 
        type='number' 
        name='password'
        value={formData.password}
        onChange={handleInputChange}
        placeholder='Enter OTP' 
        className='otp'
      />
      <button className='login' onClick={handleSubmit}>Log in</button>
      <button className='new'>Create new user account</button>
    </div>

    </div>
  )
}
