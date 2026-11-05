import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Predict from "./components/Predict";
import Dashboard from "./components/Dashboard";
import History from "./components/History";
import "./App.css";
import AdminPanel from "./components/AdminPanel";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      
      <Navbar />

      <div className="app-content">
<Routes>

  {/* Public Routes */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Dashboard Page */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  {/* Predict Page */}
  <Route
    path="/predict"
    element={
      <ProtectedRoute>
        <Predict />
      </ProtectedRoute>
    }
  />

  {/* History Page */}
  <Route
    path="/history"
    element={
      <ProtectedRoute>
        <History />
      </ProtectedRoute>
    }
  />

  {/* Default Route */}
  <Route path="*" element={<Navigate to="/login" />} />
{/* Admin pannel */}
<Route path="/admin" element={<AdminPanel />} />

<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />

</Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;