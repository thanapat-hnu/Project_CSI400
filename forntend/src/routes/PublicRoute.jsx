import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    if (user) {
      if (user.role === "admin" && location.pathname !== "/admin/dashboard") {
        setRedirectPath("/admin/dashboard");
      } else if (user.role !== "admin" && location.pathname !== "/") {
        setRedirectPath("/");
      }
    }
  }, [user, location.pathname]);

  // ✅ ป้องกัน loop — ให้ redirect ทำงานครั้งเดียว
  if (redirectPath) {
    const path = redirectPath;
    setRedirectPath(null); // เคลียร์หลัง redirect
    return <Navigate to={path} replace />;
  }

  return children;
};

export default PublicRoute;
