  import { useEffect, useState } from "react";
  import "./History.css";
  import API from "../api/api"; // Aapka Axios instance
  import { FaTrash, FaDownload, FaHistory } from "react-icons/fa";

  export default function History() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- Report Download Function ---
    const downloadReport = async (id) => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://localhost:5000/api/report/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Report not found or Server Error");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `CAD_Report_${id.slice(-6)}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Download Error:", err);
        alert("Download Failed: " + err.message);
      }
    };

    // --- Delete History Function ---
    const deleteHistory = async (id) => {
      const token = localStorage.getItem("token");
      if (!window.confirm("Are you sure you want to delete this record?")) return;

      try {
        const res = await API.delete(`/delete-history/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Record Deleted Successfully");
        
        setData((prev) => prev.filter((item) => item._id !== id));
      } catch (err) {
        console.error("Delete Error:", err);
        const errorMsg = err.response?.data?.msg || "Network Error: Could not connect to server";
        alert("Delete Failed: " + errorMsg);
      }
    };

    // Fetch History on Load
    useEffect(() => {
      const fetchHistory = async () => {
        const token = localStorage.getItem("token");
        try {
          const res = await API.get("/history", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setData(res.data);
        } catch (err) {
          console.error("Fetch Error:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchHistory();
    }, []);

    return (
    <div className="container mt-5 fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <FaHistory className="me-2 text-primary" size={24} />
          <h3 className="fw-bold mb-0">Scan History</h3>
        </div>
        <span className="badge bg-primary px-3 py-2 rounded-pill">
          {data.length} Records Found
        </span>
      </div>

      {/* Card class change ki hai: history-card */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden history-card">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="custom-thead">
              <tr>
                <th className="ps-4 py-3 text-start">Patient Name</th>
                <th className="py-3 text-start">Prediction</th>
                <th className="py-3 text-start">Confidence</th>
                <th className="text-center py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-2 text-muted">Loading history...</p>
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item) => (
                  <tr key={item._id} className="align-middle">
                    {/* text-dark remove kiya taaki theme-text apply ho */}
                    <td className="ps-4 fw-medium">{item.name}</td>
                    <td>
                      <span className={`badge ${
                          item.prediction.includes("Negative") || item.prediction === "Normal"
                            ? "bg-success-subtle text-success"
                            : "bg-danger-subtle text-danger"
                        } px-3 py-2`}
                      >
                        {item.prediction}
                      </span>
                    </td>
                    <td className="fw-bold text-secondary">{item.confidence}%</td>
                    <td className="text-center">
                      <button
                        className="btn btn-outline-primary btn-sm me-2 rounded-pill px-3"
                        onClick={() => downloadReport(item._id)}
                      >
                        <FaDownload className="me-1" /> Report
                      </button>

                      <button
                        className="btn btn-outline-danger btn-sm rounded-pill px-3"
                        onClick={() => deleteHistory(item._id)}
                      >
                        <FaTrash className="me-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-5 text-muted">
                    <div className="opacity-50 mb-3">
                       <FaHistory size={40} />
                    </div>
                    <p>No scan history found for your account.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}