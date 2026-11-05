import React, { useState } from "react";
import API from "../api/api";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");

  const handleSendLink = async () => {
    try {
      const res = await API.post("/forgot-password", { email });
    
      const token = res.data.token;

      //  auto redirect
      window.location.href = `/reset-password/${token}`;

    } catch (err) {
      alert("Email not found");
    }
  };
  
  return (
    <div className="container py-5 text-center">
      <h3>Forgot Password</h3>

      <input
        className="form-control my-3 w-50 mx-auto"
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button className="btn btn-primary" onClick={handleSendLink}>
        Send Reset Link
      </button>
    </div>
  );
}