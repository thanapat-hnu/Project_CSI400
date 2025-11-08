import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute"; // ✅ เพิ่มเพื่อใช้กับฝั่ง User
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";

// 🧩 Pages
import Home from "./pages/user/Home";
import Products from "./pages/user/Products";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import ProductDetail from "./pages/user/ProductDetail";

// 🆕 เพิ่มหน้าโปรโมชั่น
import AdminPromotions from "./pages/admin/Promotions";
import UserPromotions from "./pages/user/HomePromotions";

function App() {
  return (
    <Routes>
      {/* 🏠 ส่วนของผู้ใช้ (Public) */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <UserLayout />
          </PublicRoute>
        }
      >
        <Route index element={<Home />} /> {/* หน้าแรก */}
        <Route path="products" element={<Products />} /> {/*หน้า "สินค้า" */}
        <Route path="products/:id" element={<ProductDetail />} />
        <Route index element={<Home />} />

        <Route path="promotions" element={<UserPromotions />} />
      </Route>

      {/* 🔐 หน้า Login */}
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

      {/* 👑 ส่วน Admin */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products" element={<Products />} />

        {/* 🆕 หน้าโปรโมชั่นสำหรับ Admin */}
        <Route path="promotions" element={<AdminPromotions />} />
      </Route>
    </Routes>
  );
}

export default App;
