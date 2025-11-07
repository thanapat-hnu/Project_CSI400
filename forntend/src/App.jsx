import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout"; // ✅ เพิ่มตรงนี้

import Home from "./pages/user/Home";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";

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
        {/* สามารถเพิ่มหน้าอื่นได้ */}
        {/* <Route path="product/:id" element={<ProductDetail />} /> */}
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
      </Route>
    </Routes>
  );
}

export default App;
