// import { useEffect, useState } from "react";
// import API from "../api/api";
// import { FaMicroscope, FaFileUpload, FaChartLine } from 'react-icons/fa';
// import './Predict.css';

// export default function Predict() {
//   const [form, setForm] = useState({ name: "", age: "", gender: "Male", image: null });
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);

//   const downloadReport = async (id, nameForReport) => { 
//   const token = localStorage.getItem("token");

//   const response = await fetch(`http://localhost:5000/api/report/${id}`, {
//     method: "GET",
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   if (!response.ok) {
//     alert("Download Failed");
//     return;
//   }

//   const blob = await response.blob();
//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;

//   a.download = `${nameForReport.replace(/\s+/g, "_")}_CAD_Report.pdf`;
//   document.body.appendChild(a);
//   a.click();
//   a.remove();
// };

//   const [status, setStatus] = useState("Checking...");
//   const [isOnline, setIsOnline] = useState(false);

//   useEffect(() => {
//   fetch("http://localhost:5000/api/health")
//     .then(res => {
//       if (res.status === 200) {
//         setStatus("AI Online");
//         setIsOnline(true);
//       } else {
//         setStatus("AI Offline");
//         setIsOnline(false);
//       }
//     })
//     .catch(() => {
//       setStatus("AI Offline");
//       setIsOnline(false);
//     });
// }, []);

// const handleFile = (e) => {
//   const file = e.target.files[0];

//   if (!file) {
//     console.log("No file selected");
//     return;
//   }

//   setImage(file);
//   setForm({ ...form, image: file})
//   setPreview(URL.createObjectURL(file));


// };


// const runAnalysis = async (e) => {
//   e.preventDefault();

//   const token = localStorage.getItem("token");
//   console.log("TOKEN SENT:", token);
//   if (!token) {
//     alert("Please login again");
//     return;
//   }

//   console.log("FORM DATA:",form);
//   console.log("IMAGE:", image);

//   if (!form.name || !form.age || !image){
//     alert("All fields required");
//     return;
//   }

//   setLoading(true);

//   const formData = new FormData();

//   formData.append("name", form.name);
//   formData.append("age", form.age);
//   formData.append("gender", form.gender);
//   formData.append("image", image);

//   try {
//     const res = await API.post("/predict", formData, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data'
//       },
//     });
//   setResult(res.data);
//   setLoading(false);

// } catch (err) {
//   console.error("Error:", err);
//   setLoading(false);

//   if (err.response?.status === 401) {
//     alert("Unauthorized. Please login again.");
//   } else {
//     alert("Prediction Failed");
//   }
// }
// };
//   return (
//     <div className="container py-5 fade-in">
//       {/* Top Stats Section */}
//       <div className="row mb-4 text-center">
//         <div className="col-md-4">
//           <div className="card p-3 shadow-sm border-0 rounded-4">
//             <h6 className="text-muted"><FaMicroscope className="me-2"/>System Status</h6>
//             <h5 className={`fw-bold ${isOnline ? "text-success" : "text-danger"}`}>
//               {status}
//             </h5>
//           </div>
//         </div>
//       </div>

//       <div className="row g-4">
//         {/* Form Column */}
//         <div className="col-lg-5">
//           <div className="card shadow-sm p-4 rounded-4 border-0">
//             <h4 className="fw-bold mb-4">Patient Diagnostics</h4>
//             <form onSubmit={runAnalysis}>
//               <div className="mb-3">
//                 <input 
//                   name="name"
//                   className="form-control" 
//                   placeholder="Patient Full Name"
//                   value={form.name}
//                   onChange={e => setForm({ ...form, name: e.target.value})}
//                 />
//               </div>

//               <div className="row g-2 mb-3">
//                 <div className="col">
//                   <input 
//                     name="age" 
//                     type="number"
//                     className="form-control" 
//                     value={form.age}
//                     placeholder="Age" 
//                     onChange={e => setForm({ ...form, age: e.target.value})}
//                   />
//                 </div>

//                 <div className="col">
//                   <select className="form-select"
//                     value={form.gender}
//                     onChange={e => setForm({ ...form, gender: e.target.value})}>
//                   <option>Male</option>
//                   <option>Female</option>
//                 </select>
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label className="btn btn-outline-primary w-100 py-3 border-dashed">
//                   <FaFileUpload className="me-2"/> {form.image ? form.image.name : "Upload CCTA Image"}
//                   <input 
//                     name="image"
//                     type="file" 
//                     hidden 
//                     onChange={handleFile} />
//                 </label>
//               </div>
//               <button className="btn btn-primary w-100 py-2 fw-bold" disabled={loading}>
//                 {loading ? "AI Analysis in Progress..." : "Run AI Prediction"}
//               </button>
//             </form>
//           </div>
//         </div>

//         {/* Animation & Result Column */}
//         <div className="col-lg-7">
//           {loading && preview && (
//             <div className="scan-container shadow-lg">
//               <div className="scan-line"></div>
//               <div className="scan-overlay"></div>
//               <img src={preview} alt="Scanning" className="scan-image" />
//               <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 text-white fw-bold">
//                 Analyzing Arterial Blockages...
//               </div>
//             </div>
//           )}

//           {result && !loading && (
//             <div className={`card shadow-lg p-5 rounded-4 result-card-professional ${result.prediction === 'Normal' ? 'normal-border' : 'cad-border'}`}>
//               <div className="-flex justify-content-between align-items-start">
//                 <div>
//                   <h6 className="text-muted text-uppercase fw-bold ls-2">AI Diagnostic Report</h6>
//                   <h1 className={`display-4 fw-bold ${result.prediction === 'Normal' ? 'text-success' : 'text-danger'}`}>
//                     {result.prediction}
//                   </h1>
//                 </div>
//                 <div className="text-end">
//                   <span className="badge bg-light text-dark p-2 border">ID: #{result._id?.slice(-6)}</span>
//                 </div>
//               </div>
//               <hr />
//               <div className="row align-items-center">
//                 <div className="col-6">
//                   <p className="mb-0 text-muted">AI Confidence</p>
//                   <h3 className="fw-bold text-primary">{result.confidence}%</h3>
//                 </div>
//                 <div className="col-6 text-end">
//                   <button className="btn btn-dark px-4 py-2" onClick={ () => downloadReport(result._id, result.name)}>
//                     Download Report (PDF)
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {!loading && !result && (
//             <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted border-dashed rounded-4 bg-white p-5">
//                <FaChartLine size={50} className="mb-3 opacity-25" />
//                <p>Patient analysis data will appear here.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import API from "../api/api";
import { FaMicroscope, FaFileUpload, FaChartLine } from 'react-icons/fa';
import './Predict.css';

export default function Predict() {
  const [form, setForm] = useState({ name: "", age: "", gender: "Male", image: null });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("Checking...");
  const [isOnline, setIsOnline] = useState(false);

  const downloadReport = async (id, nameForReport) => { 
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/api/report/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Download Failed");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${nameForReport.replace(/\s+/g, "_")}_CAD_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) { alert(err.message); }
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/health")
      .then(res => {
        if (res.status === 200) { setStatus("AI Online"); setIsOnline(true); }
        else { setStatus("AI Offline"); setIsOnline(false); }
      })
      .catch(() => { setStatus("AI Offline"); setIsOnline(false); });
  }, []);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setForm({ ...form, image: file});
    setPreview(URL.createObjectURL(file));
  };

  const runAnalysis = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login again");
    if (!form.name || !form.age || !image) return alert("All fields required");

    setLoading(true);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("age", form.age);
    formData.append("gender", form.gender);
    formData.append("image", image);

    try {
      const res = await API.post("/predict", formData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data);
    } catch (err) {
      alert(err.response?.status === 401 ? "Unauthorized" : "Prediction Failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="container py-5 fade-in">
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card p-3 shadow-sm border-0 rounded-4 theme-card">
            <h6 className="text-muted"><FaMicroscope className="me-2"/>System Status</h6>
            <h5 className={`fw-bold ${isOnline ? "text-success" : "text-danger"}`}>{status}</h5>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card shadow-sm p-4 rounded-4 border-0 theme-card">
            <h4 className="fw-bold mb-4 theme-text">Patient Diagnostics</h4>
            <form onSubmit={runAnalysis}>
              <div className="mb-3">
                <input name="name" className="form-control theme-input" placeholder="Patient Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value})} />
              </div>
              <div className="row g-2 mb-3">
                <div className="col">
                  <input name="age" type="number" className="form-control theme-input" value={form.age} placeholder="Age" onChange={e => setForm({ ...form, age: e.target.value})} />
                </div>
                <div className="col">
                  <select className="form-select theme-input" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value})}>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="btn btn-outline-primary w-100 py-3 border-dashed">
                  <FaFileUpload className="me-2"/> {form.image ? form.image.name : "Upload CCTA Image"}
                  <input name="image" type="file" hidden onChange={handleFile} />
                </label>
              </div>
              <button className="btn btn-primary w-100 py-2 fw-bold" disabled={loading}>
                {loading ? "AI Analysis in Progress..." : "Run AI Prediction"}
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          {loading && preview && (
            <div className="scan-container shadow-lg">
              <div className="scan-line"></div>
              <div className="scan-overlay"></div>
              <img src={preview} alt="Scanning" className="scan-image" />
              <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 text-white fw-bold">Analyzing Arterial Blockages...</div>
            </div>
          )}

          {result && !loading && (
            <div className={`card shadow-lg p-5 rounded-4 theme-card result-card-professional ${result.prediction === 'Normal' ? 'normal-border' : 'cad-border'}`}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted text-uppercase fw-bold ls-2">AI Diagnostic Report</h6>
                  <h1 className={`display-4 fw-bold ${result.prediction === 'Normal' ? 'text-success' : 'text-danger'}`}>{result.prediction}</h1>
                </div>
                <div className="text-end">
                  <span className="badge theme-badge p-2 border">ID: #{result._id?.slice(-6)}</span>
                </div>
              </div>
              <hr className="theme-hr" />
              <div className="row align-items-center">
                <div className="col-6">
                  <p className="mb-0 text-muted">AI Confidence</p>
                  <h3 className="fw-bold text-primary">{result.confidence}%</h3>
                </div>
                <div className="col-6 text-end">
                  <button className="btn btn-dark px-4 py-2" onClick={() => downloadReport(result._id, result.name)}>Download Report (PDF)</button>
                </div>
              </div>
            </div>
          )}

          {!loading && !result && (
            <div className="h-100 d-flex flex-column align-items-center justify-content-center theme-placeholder border-dashed rounded-4 p-5">
              <FaChartLine size={50} className="mb-3 opacity-25" />
              <p>Patient analysis data will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}