import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Protected() {
  const { user, ready } = useAuth();
  if (!ready) return null; // можно показать лоадер
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}
