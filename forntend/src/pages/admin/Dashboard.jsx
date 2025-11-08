import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import api from "../../apis/axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

const Dashboard = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [summary, setSummary] = useState({
    products: 0,
    orders: 0,
    reviews: 0,
  });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productRes, orderRes, reviewRes] = await Promise.all([
        api.get("/private/product"),
        api.get("/protech/reviews")
      ]);

      setSummary({
        products: productRes.data.length,
        orders: orderRes.data.length,
        reviews: reviewRes.data.length,
      });

      // 🔹 รวมกิจกรรมล่าสุด (จำลองจากข้อมูลจริง)
      setActivities([
        `เพิ่มสินค้าใหม่: ${productRes.data[0]?.name || "ไม่มีข้อมูล"}`,
        `คำสั่งซื้อ #${orderRes.data[0]?.id || "-"} ถูกจัดส่งแล้ว`,
        `รีวิวใหม่จากลูกค้า: “${reviewRes.data[0]?.comment || "ไม่มี"}”`,
      ]);
    } catch (err) {
      console.error("โหลดข้อมูล Dashboard ผิดพลาด:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    Swal.fire("ออกจากระบบแล้ว", "", "info");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      {/* ==== Main ==== */}
      <main className="admin-main">
        <header className="admin-topbar">
          <h1>Dashboard Overview</h1>
        </header>

        {/* Summary Section */}
        <section className="admin-summary">
          <div className="admin-summary-card">
            <h3>📦 Products</h3>
            <p>{summary.products} รายการ</p>
          </div>
          <div className="admin-summary-card">
            <h3>🧾 Orders</h3>
            <p>{summary.orders} รายการ</p>
          </div>
          <div className="admin-summary-card">
            <h3>⭐ Reviews</h3>
            <p>{summary.reviews} รีวิว</p>
          </div>
        </section>

        {/* Activity Section */}
        <section className="admin-activity">
          <h2>กิจกรรมล่าสุด</h2>
          <ul>
            {activities.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
