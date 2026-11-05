import React, { useState } from "react";
import API from "../api/api";
import "./Register.css";
import logo from "../assets/logo1.png"; 

export default function Register() {
  const [form, setForm] = useState({});
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const sendOtp = async () => {
    try {
      await API.post("/send-otp", { email: form.email });
      alert("OTP sent to your email");
      setStep(2);
    } catch (err) {
      alert("Please enter a valid email address.");
    }
  };

  const register = async () => {
    try {
      await API.post("/register", { ...form, otp: otp });
      alert("Registration successful");
      window.location.href = "/login";
    } catch (err) {
      alert("Invalid OTP or registration failed");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card shadow-sm">
        {/* Logo Section Added */}
        <div className="logo-container text-center mb-3">
          <img src={logo} alt="CAD Detection AI" className="register-logo"/>
        </div>
        
        <div className="register-header">
          <h3>👤 Create Account</h3>
          <p>Join the CAD AI Diagnostic Network</p>
        </div>
        
        <input className="form-control custom-input mb-3" name="name" placeholder="Full Name" onChange={handleChange}/>
        <input className="form-control custom-input mb-3" name="email" placeholder="Email" onChange={handleChange}/>
        <input className="form-control custom-input mb-3" type="password" name="password" placeholder="Password" onChange={handleChange}/>
        
        {step === 1 && (
          <button className="btn-register w-100" onClick={sendOtp}> Send OTP </button>
        )}
        
        {step === 2 && (
          <>
            <input className="form-control custom-input mt-2 mb-3" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)}/>
            <button className="btn-register w-100" onClick={register}> Register </button>
          </>
        )}
      </div>
    </div>
  );
}