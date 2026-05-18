import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

export default function RoleRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-indigo-400 font-medium animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      {!isAuthenticated ? null : allowedRoles.includes(user?.role) ? (
        children
      ) : (
        <Navigate
          to={user?.role === "organizer" ? "/organizer-dashboard" : "/student-dashboard"}
          replace
        />
      )}
    </ProtectedRoute>
  );
}
