import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import ForgotCredentials from "./pages/Login/forgotCredentials/ForgotCredentials";
import Dashboard from "./pages/Dashboard/Dashboard"; 
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-credentials" element={<ForgotCredentials />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}