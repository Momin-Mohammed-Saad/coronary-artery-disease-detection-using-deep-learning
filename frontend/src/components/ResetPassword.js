import React, { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

export default function ResetPassword() {

  const { token } = useParams();
  const [password, setPassword] = useState("");

  const handleReset = async () => {
    try {
      await API.post(`/reset-password/${token}`, {
        password
      });

      alert("Password updated successfully");
    } catch (err) {
      alert("Invalid or expired token");
    }
  };

  return (
    <div className="container py-5 text-center">
      <h3>Change Password</h3>

      <input
        type="password"
        className="form-control my-3 w-50 mx-auto"
        placeholder="Enter new password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn btn-success" onClick={handleReset}>
        Change Password
      </button>
    </div>
  );
}