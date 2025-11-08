import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute"; // ✅ เพิ่มเพื่อใช้กับฝั่ง User
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";

// 🧩 Pages
import Home from "./pages/user/Home";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";

// 🆕 เพิ่มหน้าโปรโมชั่น
import AdminPromotions from "./pages/admin/Promotions";
import UserPromotions from "./pages/user/HomePromotions";

function App() {
  return (
    <Routes>
      {/* 🏠 User Layout */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <UserLayout />
          </PublicRoute>
        }
      >
        <Route index element={<Home />} />

        <Route path="promotions" element={<UserPromotions />} />
      </Route>

      {/* 🟢 Login */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/admin/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* 👑 Admin Layout */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />

        {/* 🆕 หน้าโปรโมชั่นสำหรับ Admin */}
        <Route path="promotions" element={<AdminPromotions />} />
      </Route>
    </Routes>
  );
}

export default App;
