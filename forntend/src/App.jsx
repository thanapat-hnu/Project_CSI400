import { Routes, Route } from "react-router-dom";

import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute"; // ✅ ใช้สำหรับ User
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
import { EditAddress } from "./pages/user/EditAddress";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import ProductDetail from "./pages/user/ProductDetail";
import { Wishlist } from "./pages/user/Wishlist";
import Cart from "./pages/user/Cart";
import CheckoutDetail from "./pages/user/CheckoutDetail";
import { ContactUs } from "./pages/user/ContectUs"

// 🆕 เพิ่มหน้าโปรโมชั่น
import AdminPromotions from "./pages/admin/Promotions";
import UserPromotions from "./pages/user/HomePromotions";

// 🆕 ✅ เพิ่มหน้า “คูปองของฉัน”
import MyCoupons from "./pages/user/MyCoupons";

function App() {
  return (
    <Routes>
      {/* 🌐 User Layout (Public + Protected) */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <UserLayout />
          </PublicRoute>
        }
      >
        {/* หน้า Public */}
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="promotions" element={<UserPromotions />} />

        {/* 🛒 หน้าตะกร้า */}
        <Route path="cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>} />
        <Route
          path="/checkout/detail"
          element={
            <ProtectedRoute>
              <CheckoutDetail />
            </ProtectedRoute>
          }
        />

        {/* 🧍‍♂️ โปรไฟล์ผู้ใช้ */}
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
        <Route
          path="/profile/address/edit/:id"
          element={
            <ProtectedRoute>
              <EditAddress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        {/* 🎟️ ✅ เพิ่ม Route คูปองของฉัน */}
        <Route
          path="/profile/mycoupons"
          element={
            <ProtectedRoute>
              <MyCoupons />
            </ProtectedRoute>
          }
        />
        {/* 🔐 Authentication */}
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
        <Route
          path="/contact"
          element={
            <PublicRoute>
              <ContactUs />
            </PublicRoute>
          }
        />

      </Route>



      {/* 👑 Admin Section */}
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
        <Route path="promotions" element={<AdminPromotions />} />
      </Route>
    </Routes>
  );
}

export default App;
