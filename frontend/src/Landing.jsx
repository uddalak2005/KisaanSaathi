import React from 'react'
import './styles/Landing.css'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
    const navigate = useNavigate();
  return (
    <div className='Main_bg'>
        <div className='navbar'>
            <div className='logo'>
                
            </div>
            <div className='links'>
                <div className='Home' id='child'>Home</div>
                <div className='About' id='child'>About</div>
                <div className='Service' id='child'>Service</div>
                <div className='Contact_us' id='child'>Contact Us</div>
            </div>
            <div className='authButtons'>
                <button className='in' onClick={() => {navigate("/SignIn")}} style={{zIndex:'2'}}>Sign in</button>
                <button className='up' onClick={()=>{navigate("/SignUp")}} style={{zIndex:'2'}}>Sign up</button>
            </div>
        </div>

        <div className='Main_content'>
        
            <div className='hero'>
                <h1 className='hero_title'>
                    Empowering farmers, Enriching Futures
                </h1>
                <p className='hero_text'>
                    Helping farmers cultivate the most profitable crops for higher yields and hassle-free repayments, with the right financial and agricultural support, we make farmin more sustainable,efficient and rewarding
                </p>
                <button className='Learnmore' onClick={() => navigate("/SignIn")}>
                    Learn More
                </button>
            </div>
        </div>
    </div>
  )
}
