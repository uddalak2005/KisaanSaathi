import { useState } from "react";
import {db} from "./firebaseConfig"; // Ensure Firebase is properly initialized
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function FinanceForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    aadharNumber: '',
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
    }
});  

const API_KEY = "AIzaSyCe9aY5nyzH0F_Tbk3vGsbX3kC418wVFtc"
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

const [userData,setuserData] = useState();
const [res,setres] = useState();
const navigate = useNavigate();
const [resGen,setresGen] = useState(false);

  const handleSubmit = async () => {
    console.log("handle clicked")
    try {
      const docRef = doc(db, "FormData",`${formData.aadharNumber}`);
      await setDoc(docRef, formData); // Saving the input data with a key
      console.log("Document successfully added!");
    } catch (e) {
      console.log("Error adding document:", e);
    }
    const token = localStorage.getItem('token');
    try{
        axios.get(`http://192.168.190.12:3000/api/dashboard/${formData.aadharNumber}`,{headers:{
            Authorization: `Bearer ${token}`}
        }).then((res)=>{
            setuserData(res.data.dashboardData);
            console.log(res.data);
        })
    }catch(e){
        console.log(e);
    }

    handleLoanApproval();
  };
  const styles = {
    container: { maxWidth: "600px", margin: "auto", padding: "20px", background: "#f9f9f9", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" },
    header: { textAlign: "center", marginBottom: "20px" },
    headerTitle: { fontSize: "24px", fontWeight: "bold", color: "#333" },
    headerSubtitle: { fontSize: "14px", color: "#666" },
    form: { display: "flex", flexDirection: "column", gap: "15px" },
    section: { padding: "10px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
    sectionTitle: { fontSize: "18px", fontWeight: "bold", marginBottom: "10px" },
    formRow: { display: "flex", gap: "10px", justifyContent: "space-between" },
    formGroup: { flex: 1 },
    input: { width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" },
    select: { width: "100%", padding: "8px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc", backgroundColor: "#fff" },
    submitButton: { width: "100%", padding: "10px", fontSize: "16px", backgroundColor: "#28a745", color: "#fff", borderRadius: "5px", border: "none", cursor: "pointer" }
};
  
      
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
        <div style={styles.container}>
        <div style={styles.header}>
            <h2 style={styles.headerTitle}>Loan Application</h2>
            <p style={styles.headerSubtitle}>Fill in the details to apply for an agricultural loan</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
            {/* Personal Details */}
            <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Personal Details</h3>
                <div style={styles.formRow}>
                    <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required style={styles.input} />
                    <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required style={styles.input} />
                </div>
                <div style={styles.formRow}>
                    <input type="text" name="aadharNumber" placeholder="Aadhar Number" value={formData.aadharNumber} onChange={handleChange} required style={styles.input} />
                    <input type="text" name="panCard" placeholder="PAN Card" value={formData.panCard} onChange={handleChange} required style={styles.input} />
                </div>
            </div>

            {/* Loan Details */}
            <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Loan Details</h3>
                <div style={styles.formRow}>
                    <input type="number" name="loanAmount" placeholder="Loan Amount (₹)" value={formData.loanAmount} onChange={handleChange} required style={styles.input} />
                    <select name="loanPurpose" value={formData.loanPurpose} onChange={handleChange} required style={styles.select}>
                        <option value="">Select Loan Purpose</option>
                        <option value="equipment">Farm Equipment</option>
                        <option value="seeds">Seeds and Fertilizers</option>
                        <option value="expansion">Farm Expansion</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div style={styles.formRow}>
                    <input type="text" name="landHolding" placeholder="Land Holding (in acres)" value={formData.landHolding} onChange={handleChange} required style={styles.input} />
                    <input type="number" name="annualIncome" placeholder="Annual Income (₹)" value={formData.annualIncome} onChange={handleChange} required style={styles.input} />
                </div>
            </div>

            {/* Bank Details */}
            <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Bank Details</h3>
                <div style={styles.formRow}>
                    <input type="text" name="bankDetails.accountNumber" placeholder="Account Number" value={formData.bankDetails.accountNumber} onChange={handleChange} required style={styles.input} />
                    <input type="text" name="bankDetails.ifscCode" placeholder="IFSC Code" value={formData.bankDetails.ifscCode} onChange={handleChange} required style={styles.input} />
                </div>
                <div style={styles.formRow}>
                    <input type="text" name="bankDetails.bankName" placeholder="Bank Name" value={formData.bankDetails.bankName} onChange={handleChange} required style={styles.input} />
                    <input type="text" name="bankDetails.branch" placeholder="Branch" value={formData.bankDetails.branch} onChange={handleChange} required style={styles.input} />
                </div>
            </div>

            <button type="submit" style={styles.submitButton} onClick={handleSubmit}>Submit Application</button>
        </form>
        {resGen ? (<p>{res}</p>):(<p>not generated</p>)}
    </div>
);
  };
  
