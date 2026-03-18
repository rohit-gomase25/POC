import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export default function PublicRoute() {
  const tokens = useAuthStore((state) => state.tokens);

  if (tokens) {
    // If tokens exist, user is already logged in; redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}