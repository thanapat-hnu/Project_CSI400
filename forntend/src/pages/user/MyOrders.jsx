
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./UserPage.module.css";
import UserSidebar from "./UserSidebar";
import { FaBox, FaTruck, FaCheckCircle, FaClock } from "react-icons/fa";
import api from "../../apis/axios";

export const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // แปลสถานะเป็นข้อความไทย
  const statusText = {
    pending: "รอการชำระเงิน",
    paid: "ชำระเงินแล้ว",
    shipped: "กำลังจัดส่ง",
    delivered: "จัดส่งสำเร็จ",
    completed: "เสร็จสมบูรณ์",
  };

  // คืน icon ตามสถานะ
  const statusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className={styles.statusIconPending} />;
      case "paid":
        return <FaCheckCircle className={styles.statusIconCompleted} />;
      case "shipped":
        return <FaTruck className={styles.statusIconShipped} />;
      case "delivered":
        return <FaBox className={styles.statusIconDelivered} />;
      case "completed":
        return <FaCheckCircle className={styles.statusIconCompleted} />;
      default:
        return <FaClock />;
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const u = await api.get("/protech/cart");
        const user_id = u.data.userId;

        const res = await api.get(`/protech/order/user/${user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const ordersData = res.data || [];

        const fetchedOrders = ordersData.map((order) => ({
          id: order.id,
          date: order.created_at
            ? new Date(order.created_at).toLocaleDateString("th-TH")
            : "-",
          total: Number(order.total_amount || 0),
          status: order.status || "pending",
          items: (order.items || []).map((i) => ({
            name: i.product?.name || "สินค้าไม่มีชื่อ",
            qty: i.quantity || 0,
            price: Number(i.price || 0),
          })),
        }));

        setOrders(fetchedOrders);
      } catch (err) {
        console.error("❌ โหลดคำสั่งซื้อของฉันล้มเหลว:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ✅ ฟังก์ชันเปลี่ยนหน้าไปยังใบเสร็จ
  const handleViewReceipt = (order) => {
    navigate(`/profile/order/${order.id}`, { state: { order } });
  };


  return (
    <div className={styles.container}>
      <UserSidebar />
      <div className={styles.content}>
        <h1 className={styles.pageTitle}>📦 คำสั่งซื้อของฉัน</h1>

        {loading ? (
          <p className={styles.emptyText}>⏳ กำลังโหลดคำสั่งซื้อ...</p>
        ) : orders.length === 0 ? (
          <p className={styles.emptyText}>ยังไม่มีคำสั่งซื้อในตอนนี้</p>
        ) : (
          <div className={styles.orderList}>
            {orders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div>
                    <h3>หมายเลขคำสั่งซื้อ: {order.id}</h3>
                    <p>วันที่สั่งซื้อ: {order.date}</p>
                  </div>
                  <div className={styles.orderStatus}>
                    {statusIcon(order.status)}
                    <span>{statusText[order.status]}</span>
                  </div>
                </div>

                <div className={styles.orderItems}>
                  {order.items.map((item, i) => (
                    <div key={i} className={styles.itemRow}>
                      <span>{item.name}</span>
                      <span>x{item.qty}</span>
                      <span>{item.price.toLocaleString()} ฿</span>
                    </div>
                  ))}
                </div>

                <div className={styles.orderFooter}>
                  <p>รวมทั้งหมด: {order.total.toLocaleString()} ฿</p>

                  {/* ✅ ปุ่มไปหน้า OrderDetail */}
                  <button
                    className={styles.trackBtn}
                    onClick={() => handleViewReceipt(order)} // ✅ ส่ง order ทั้งก้อน
                  >
                    ดูรายละเอียดใบเสร็จ
                  </button>
                </div>
              </div >
            ))}
          </div >
        )}
      </div >
    </div >
  );
};

export default MyOrders;
