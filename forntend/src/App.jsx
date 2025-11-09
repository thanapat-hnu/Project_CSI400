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
import { Register } from "./pages/auth/register";
import { MyProfile } from "./pages/user/MyProfile";
import { ProfileEdit } from "./pages/user/ProfileEdit";
import { Address } from "./pages/user/Address";
import { AddressCreate } from "./pages/user/AddressCreate";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import ProductDetail from "./pages/user/ProductDetail";

// 🆕 เพิ่มหน้าโปรโมชั่น
import AdminPromotions from "./pages/admin/Promotions";
import UserPromotions from "./pages/user/HomePromotions";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <UserLayout />
          </PublicRoute>
        }
      >
        {/* <Route index element={<Home />} /> */}
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="promotions" element={<UserPromotions />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <ProfileEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/address"
          element={
            <ProtectedRoute>
              <Address />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/address/create"
          element={
            <ProtectedRoute>
              <AddressCreate />
            </ProtectedRoute>
          }
        />
      </Route>
      
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
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
