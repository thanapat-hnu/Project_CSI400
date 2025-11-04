import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      {/* === Sidebar === */}
      <aside className="admin-sidebar">
        <h2 className="admin-logo">🛠 SlideShop Admin</h2>
        <nav>
          <ul>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/products">Products</Link></li>
            <li><Link to="/admin/orders">Orders</Link></li>
            <li><Link to="/admin/users">Users</Link></li>
            <li><Link to="/admin/reviews">Reviews</Link></li>
          </ul>
        </nav>

        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </aside>

      {/* === Main Content === */}
      <main className="admin-content">
        <Outlet /> {/* <-- จะ render หน้า child (Dashboard, Products ฯลฯ) */}
      </main>
    </div>
  );
};

export default AdminLayout;
