import React from 'react'
import { motion } from 'framer-motion';
import './styles/Dash.css'
import { useState } from 'react';
import { useEffect } from 'react';
import 'boxicons'

export default function () {
    const [expanded, setExpanded] = useState(false);
  return (
    <div className='dash-page' onClick={() => setExpanded(!expanded)}>
    <motion.div className={expanded ? 'dashboard-exp' : 'dashboard'}>
    <div className='ham'></div>
    <box-icon name='menu' color='#ffffff' size='40px' className='ham'></box-icon>
        {/* <div className='Accounts'>
            <h1>Accounts</h1>
        </div>
        <div className='transactions'>
            <h1>Transactions</h1>

        </div>
        <div className='Services'>
            <h1>Services</h1>

        </div> */}
    </motion.div>
    </div>
  )
}
