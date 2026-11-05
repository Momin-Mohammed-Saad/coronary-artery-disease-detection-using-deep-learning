// card tamplete
import React, { useState } from "react";
import API from "../api/api";
import "./Login.css"; 
import { Link } from "react-router-dom";
import logo from "../assets/logo1.png";
export default function Login() {
  const [form, setForm] = useState({});

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

const login = async (e) => {
  try {
    const res = await API.post("/login", form);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("doctorName", res.data.name);
    localStorage.setItem("role", String(res.data.role).toLowerCase().trim());

    alert("Login Success");
    window.location.href = "/dashboard";

  } catch (err) {
    alert("Invalid Credentials");
  }
};

  return (
    <div className="login-wrapper"> 
      <div className="login-card shadow">
        <div className="logo-container">
          <img src={logo} alt="CAD Detection AI" className="login-logo" />
        </div>
        <div className="login-header">
          <h3>👨‍⚕️ Doctor Login</h3>
          <p>CAD Diagnostic AI Portal</p>
        </div>

        <div className="mb-3">
          <label className="form-label small fw-bold">Email Address</label>
          <input
            className="form-control custom-input"
            name="email"
            placeholder="name@hospital.com"
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="form-label small fw-bold">Password</label>
          <input
            className="form-control custom-input"
            name="password"
            type="password"
            placeholder="••••••••"
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-success btn-login w-100" onClick={login}>
          Sing In
        </button>
        
        <div className="text-center mt-2">
          <Link to="/forgot-password">Forgot Password?</Link>
          </div>

        <div className="text-center mt-3">
            <small className="text-muted">Securely encrypted for medical use</small>
        </div>
      </div>
    </div>
  );
}