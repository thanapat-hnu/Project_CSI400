import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const PublicRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      if (user.role === "admin" && location.pathname !== "/admin/dashboard") {
        navigate("/admin/dashboard", { replace: true });
      } else if (
        user.role !== "admin" &&
        ["/login", "/register"].includes(location.pathname)
      ) {
        navigate("/", { replace: true });
      }
    }
  }, [user, location.pathname, navigate]);

  return children;
};

export default PublicRoute;
