import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return null;

  return isAuthenticated ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;