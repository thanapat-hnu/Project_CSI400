import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // 🔹 ยังโหลด token ไม่เสร็จ — แสดง loader หรือเปล่าไว้ก่อน
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        กำลังตรวจสอบสิทธิ์...
      </div>
    );
  }

  // 🔹 ยังไม่ได้ login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔹 ถ้าไม่ใช่ admin ห้ามเข้า
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // ✅ ถ้าเช็คผ่านหมด แสดง children ได้เลย
  return children;
};

export default PrivateRoute;
