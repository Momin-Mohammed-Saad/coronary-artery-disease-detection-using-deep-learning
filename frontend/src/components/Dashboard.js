import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserPlus, FaCheckCircle, FaExclamationTriangle, FaChartBar } from "react-icons/fa";
import API from "../api/api";
import "./Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, normal: 0, cad: 0, recent: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/history", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const allData = res.data;

        const cadCount = allData.filter(item => 
          item.label === "CAD"
        ).length;
        
        const normalCount = allData.filter(item => 
          item.label === "Normal"
        ).length;


        setStats({
          total: allData.length,
          normal: normalCount,
          cad: cadCount,
          recent: allData.slice(0, 5) 
        });
        setLoading(false);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const doctorName = localStorage.getItem("doctorName") || "Doctor";

  if (loading) return <div className="text-center mt-5">Loading Dashboard...</div>;

  return (
    // dashboard-container class add ki hai jo aapke CSS mein hai
    <div className="dashboard-container container-fluid px-4 fade-in">
      <div className="row mb-4 align-items-center">
        <div className="col-md-8">
          <h2 className="fw-bold theme-text">Welcome, <span className="text-primary">{doctorName}</span></h2>
          <p className="text-muted">Live summary of your CAD Diagnostic activities.</p>
        </div>
        <div className="col-md-4 text-md-end">
          <Link to="/predict" className="btn btn-primary px-4 py-2 rounded-pill shadow-sm">
            <FaUserPlus className="me-2" /> New Patient Scan
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 stat-card">
            <div className="d-flex align-items-center">
              <div className="bg-primary text-white p-3 rounded-3 fs-4 me-3"><FaChartBar /></div>
              <div>
                <h6 className="text-muted mb-0">Total Scans</h6>
                <h3 className="fw-bold mb-0">{stats.total}</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 stat-card">
            <div className="d-flex align-items-center">
              <div className="bg-success text-white p-3 rounded-3 fs-4 me-3"><FaCheckCircle /></div>
              <div>
                <h6 className="text-muted mb-0">Normal</h6>
                <h3 className="fw-bold mb-0">{stats.normal}</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 stat-card">
            <div className="d-flex align-items-center">
              <div className="bg-danger text-white p-3 rounded-3 fs-4 me-3"><FaExclamationTriangle /></div>
              <div>
                <h6 className="text-muted mb-0">CAD Detected</h6>
                <h3 className="fw-bold mb-0">{stats.cad}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Mini Table */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-4 p-4 stat-card">
            <div className="d-flex justify-content-between mb-4">
              <h5 className="fw-bold mb-0 theme-text">Recent Patient Analysis</h5>
              <Link to="/history" className="text-decoration-none">View Full History</Link>
            </div>
            <div className="table-responsive">
              <table className="table table-hover border-0 theme-table">
                <thead>
                  <tr className="text-muted">
                    <th>Patient Name</th>
                    <th>Prediction</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody className="theme-text">
                  {stats.recent.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>
                        <span className={`badge rounded-pill ${item.prediction === 'Normal' ? 'bg-success-subtle' : 'bg-danger-subtle'}`}>
                          {item.prediction}
                        </span>
                      </td>
                      <td>{item.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}