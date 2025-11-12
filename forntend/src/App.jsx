import { Routes, Route } from "react-router-dom";

import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute"; // ✅ ใช้สำหรับ User

import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";

// 🧩 Pages (User)
import Home from "./pages/user/Home";
import Products from "./pages/user/Products";
import ProductDetail from "./pages/user/ProductDetail";
import Cart from "./pages/user/Cart";
import CheckoutDetail from "./pages/user/CheckoutDetail";
import { Wishlist } from "./pages/user/Wishlist";
import { MyProfile } from "./pages/user/MyProfile";
import { ProfileEdit } from "./pages/user/ProfileEdit";
import { Address } from "./pages/user/Address";
import { AddressCreate } from "./pages/user/AddressCreate";
import { EditAddress } from "./pages/user/EditAddress";
import { MyOrders } from "./pages/user/MyOrders";
import OrderDetail from "./pages/user/OrderDetail"; // ✅ เพิ่มหน้าใบเสร็จ
import { ContactUs } from "./pages/user/ContectUs";

// 🧾 คูปอง + โปรโมชั่น
import MyCoupons from "./pages/user/MyCoupons";
import UserPromotions from "./pages/user/HomePromotions";

// 🔐 Auth
import Login from "./pages/auth/Login";
import { Register } from "./pages/auth/register";

// 👑 Admin
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminPromotions from "./pages/admin/Promotions";

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
        {/* 🏠 หน้า Public */}
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="promotions" element={<UserPromotions />} />
        <Route
          path="contact"
          element={
            <PublicRoute>
              <ContactUs />
            </PublicRoute>
          }
        />
        <Route
          path="login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* 🛒 หน้าตะกร้า / เช็คเอาท์ */}
        <Route
          path="cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="checkout/detail"
          element={
            <ProtectedRoute>
              <CheckoutDetail />
            </ProtectedRoute>
          }
        />

        {/* 🧍‍♂️ โปรไฟล์ผู้ใช้ */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile/edit"
          element={
            <ProtectedRoute>
              <ProfileEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile/address"
          element={
            <ProtectedRoute>
              <Address />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile/address/create"
          element={
            <ProtectedRoute>
              <AddressCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile/address/edit/:id"
          element={
            <ProtectedRoute>
              <EditAddress />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        {/* 🎟️ ✅ คูปองของฉัน */}
        <Route
          path="profile/mycoupons"
          element={
            <ProtectedRoute>
              <MyCoupons />
            </ProtectedRoute>
          }
        />

        {/* 🧾 ✅ คำสั่งซื้อของฉัน */}
        <Route
          path="user/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        {/* 🧾 ✅ รายละเอียดใบเสร็จคำสั่งซื้อ */}
        <Route
          path="profile/order/:id"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
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
