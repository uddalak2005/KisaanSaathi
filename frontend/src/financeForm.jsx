import { useEffect, useState } from "react";
import {db} from "./firebaseConfig"; // Ensure Firebase is properly initialized
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/form.css"; // Import your CSS file

export default function FinanceForm() {

const API_KEY = "AIzaSyCe9aY5nyzH0F_Tbk3vGsbX3kC418wVFtc"
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

const [userData,setuserData] = useState();
const [res,setres] = useState();
// const navigate = useNavigate();
const [resGen,setresGen] = useState(false);

const [formData, setFormData] = useState({
    fullName: userData? userData.fullName : '',
    phoneNumber: userData? userData.phoneNumber : '',
    aadharNumber: userData? userData.aadharNumber : '',
    panCard: '',
    loanAmount: '',
    loanPurpose: '',
    landHolding: '',
    annualIncome: '',
    bankDetails: {
        accountNumber: '',
        ifscCode: '',
        bankName: '',
        branch: ''
    },
    cropScore : userData? userData.cropScore : 0.7,
});  


//Fetch the data alreay given by user from DB and set it in the uerData state
useEffect(() => {
const fetchDefaultData = async () => {

};
},[]);



//This handlesubmit function creates the details object and logs it, pass it to a DB collection to maintain formdata
const handleSubmit = async () => {
    console.log("handle clicked")
    console.log("Loan details: ", formData);
}





//   const handleSubmit = async () => {
//     console.log("handle clicked")
//     try {
//       const docRef = doc(db, "FormData",`${formData.aadharNumber}`);
//       await setDoc(docRef, formData); // Saving the input data with a key
//       console.log("Document successfully added!");
//     } catch (e) {
//       console.log("Error adding document:", e);
//     }
//     const token = localStorage.getItem('token');
//     try{
//         axios.get(`http://192.168.190.12:3000/api/dashboard/${formData.aadharNumber}`,{headers:{
//             Authorization: `Bearer ${token}`}
//         }).then((res)=>{
//             setuserData(res.data.dashboardData);
//             console.log(res.data);
//         })
//     }catch(e){
//         console.log(e);
//     }

//     handleLoanApproval();
//   };
  
  
      
    const handleLoanApproval = async() => {
        const pred_amount = userData ? userData.yieldScore ? userData.yieldScore.yieldScore.loan_amount : "" : "";
        const given_amount = formData.loanAmount;
        const score = userData.yieldScore.yieldScore.crops;
        console.log(score);

        if(pred_amount>given_amount){
            const requestBody = {
                contents: [{ role: "user", parts: [{ text: `You are a Indian financial advisor, and you are given three parameters based on which u have to provide information about loans, especially micro loans for farmers. your parameters are - 1. ${pred_amount} which is a predicted loan amount that a farmer can take according to his yearly yield analytics, 2. ${given_amount}, the loan he wants, and 3. ${score} which is a crop info array, from which you have to extract the score from it to have an idea about the crops he has and tell if he is eligible or not, if yes, what loans he can get. focus mostly on if the predicted_amount is greater than given_amount or not. keep the response short within about 200 words.}` }] }]
            };
        
            try {
                const response = await fetch(apiUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody),
                });
        
                const data = await response.json();
                console.log("Gemini AI Response:", data);
                const result =  data.candidates[0].content.parts[0].text;
                setres(result);
                setresGen(!resGen);
        }catch(e){
            console.log(e);
        }

    }

    
    

};

  
          const handleChange = (e) => {
            const { name, value } = e.target;
        
            setFormData((prev) => {
                // Handling nested fields (e.g., bankDetails.accountNumber)
                if (name.includes(".")) {
                    const [parent, child] = name.split(".");
                    return {
                        ...prev,
                        [parent]: {
                            ...prev[parent],
                            [child]: value
                        }
                    };
                } else {
                    // Handling regular fields
                    return {
                        ...prev,
                        [name]: value
                    };
                }
            });
        };
        
  return(
    <div className="financeformcontainer">
    <div className="container">
    <div className="header">
      <h2 className="header-title">Loan Application</h2>
      <p className="header-subtitle">Fill in the details to apply for an agricultural loan</p>
    </div>
  
    <form className="form" onSubmit={handleSubmit}>
  {/* Personal Details */}
  <div className="section">
    <h3 className="section-title">Personal Details</h3>
    <div className="form-row">
      <div className="form-group">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="input"
        />
      </div>
      <div className="form-group">
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          className="input"
        />
      </div>
    </div>
    <div className="form-row">
      <div className="form-group">
        <input
          type="text"
          name="aadharNumber"
          placeholder="Aadhar Number"
          value={formData.aadharNumber}
          onChange={handleChange}
          required
          className="input"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="panCard"
          placeholder="PAN Card"
          value={formData.panCard}
          onChange={handleChange}
          required
          className="input"
        />
      </div>
    </div>
  </div>

  {/* Loan Details */}
  <div className="section">
    <h3 className="section-title">Loan Details</h3>
    <div className="form-row">
      <div className="form-group">
        <input
          type="number"
          name="loanAmount"
          placeholder="Loan Amount (₹)"
          value={formData.loanAmount}
          onChange={handleChange}
          required
          className="input"
        />
      </div>
      <div className="form-group">
        <select
          name="loanPurpose"
          value={formData.loanPurpose}
          onChange={handleChange}
          required
          className="select"
        >
          <option value="">Select Loan Purpose</option>
          <option value="equipment">Farm Equipment</option>
          <option value="seeds">Seeds and Fertilizers</option>
          <option value="expansion">Farm Expansion</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
    <div className="form-row">
      <div className="form-group">
        <input
          type="text"
          name="landHolding"
          placeholder="Land Holding (in acres)"
          value={formData.landHolding}
          onChange={handleChange}
          required
          className="input"
        />
      </div>
      <div className="form-group">
        <input
          type="number"
          name="annualIncome"
          placeholder="Annual Income (₹)"
          value={formData.annualIncome}
          onChange={handleChange}
          required
          className="input"
        />
      </div>
    </div>
  </div>

  {/* Bank Details */}
  <div className="section">
    <h3 className="section-title">Bank Details</h3>
    <div className="form-row">
      <div className="form-group">
        <input
          type="text"
          name="bankDetails.accountNumber"
          placeholder="Account Number"
          value={formData.bankDetails.accountNumber}
          onChange={handleChange}
          required
          className="input"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="bankDetails.ifscCode"
          placeholder="IFSC Code"
          value={formData.bankDetails.ifscCode}
          onChange={handleChange}
          required
          className="input"
        />
      </div>
    </div>
    <div className="form-row">
      <div className="form-group">
        <input
          type="text"
          name="bankDetails.bankName"
          placeholder="Bank Name"
          value={formData.bankDetails.bankName}
          onChange={handleChange}
          required
          className="input"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="bankDetails.branch"
          placeholder="Branch"
          value={formData.bankDetails.branch}
          onChange={handleChange}
          required
          className="input"
        />
      </div>
      </div>
      </div>
      <div className="section">
    <h3 className="section-title">Scores from KisaanSaathi</h3>
    <div className="form-row">
      <div className="form-group">
        <input
          type="number"
          name="cropScore"
          placeholder="Crop score given by KisaanSaathi"
          value={formData.cropScore}
          onChange={handleChange}
          required
          className="input"
          readOnly={true} // Make it read-only to prevent user input
        />
      </div>
      <div className="form-group">
      <input
  type="text"
  name="likelihood"
  placeholder="Loan Eligibility"
  value={
    formData.cropScore === undefined || formData.cropScore === null
      ? ''
      : formData.cropScore > 0.5
      ? 'Eligible'
      : 'Not Eligible'
  }
  disabled={
    formData.cropScore === undefined || formData.cropScore === null
  }
  required
  className="input"
  readOnly={true} // Make it read-only to prevent user input
/>
        </div>
    </div>
    </div>

  <button type="submit" className="submit-button" onClick={handleSubmit}>
    Submit Application
  </button>
</form>
  
    {/* {resGen ? <p>{res}</p> : <p>not generated</p>} */}
  </div>
  </div>
  
  )}
