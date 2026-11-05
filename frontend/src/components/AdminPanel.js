import React, { useEffect, useState } from "react";
import API from "../api/api";
import { FaTrash, FaEdit, FaUserMd, FaUserShield } from "react-icons/fa";
export default function AdminPanel() {
  const [doctors, setDoctors] = useState([]);
  const token = localStorage.getItem("token");

  const promoteToAdmin = async (id) => {
  if (window.confirm("Make this doctor an Admin? They will get full control!")) {
    try {
      await API.put(`/make-admin/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert("Promoted successfully!");
      fetchDoctors(); // Refresh the list
    } catch (err) {
      alert("Failed to promote.");
    }
  }
};

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/get-all-doctors", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(res.data);
    } catch (err) { console.error("Error fetching doctors", err); }
  };

  const deleteDoc = async (id) => {
    if (window.confirm("Delete this doctor? All their data will be lost!")) {
      await API.delete(`/delete-doctor/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDoctors();
    }
  };

  const editDoc = async (id) => {
    const newName = prompt("Enter new name (Keep blank to skip):");
    const newPassword = prompt("Enter new password (Keep blank to skip):");

    if (!newName && !newPassword) return;

    const updateBody = {};
    if (newName) updateBody.name = newName;
    if (newPassword) updateBody.password = newPassword;
    try {
      await API.put(`/update-doctor/${id}`, updateBody, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert("Doctor updated successfully!");
      fetchDoctors();
    } catch (err) {
      alert("Failed to update doctor.");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4"><FaUserMd className="me-2"/>Admin: Manage Doctors</h2>
      <div className="card shadow border-0 rounded-4">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>Doctor Name</th>
              <th>Email</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(doc => (
              <tr key={doc._id}>
                <td>{doc.name}</td>
                <td>{doc.email}</td>
                <td className="text-end">
                <button className="btn btn-outline-warning btn-sm me-2" title="Make Admin" onClick={() => promoteToAdmin(doc._id)}>
                    <FaUserShield />
                </button>
                  <button className="btn btn-outline-primary btn-sm me-2" onClick={() => editDoc(doc._id)}><FaEdit /></button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => deleteDoc(doc._id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}