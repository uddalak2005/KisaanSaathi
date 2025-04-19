import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Landing from './Landing.jsx'
import SignIn from './SignIn.jsx'
import SignUp from './SignUp.jsx'
import Dashboard from './Dashboard.jsx'
import Notification from './components/notif.jsx'
import FinanceForm from './financeForm.jsx'
function App() {
  return(
    <Router>
      <Routes>
        <Route path='/' element={<Landing/>}></Route>
        <Route path='/SignIn' element={<SignIn/>}></Route>
        <Route path='/SignUp' element={<SignUp/>}></Route>
        <Route path='/Finance' element={<FinanceForm/>}></Route>
        <Route path='/Dashboard/:aadharNum' element={<Dashboard/>}></Route>
      </Routes>
      <Notification/>
    </Router>
  )
}

export default App
