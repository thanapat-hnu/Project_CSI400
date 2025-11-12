import { useState } from "react";
import styles from "./UserPage.module.css";
import UserSidebar from "./UserSidebar";
import { FaBox, FaTruck, FaCheckCircle, FaClock } from "react-icons/fa";

export const MyOrders = () => {
  // mock data — ตัวอย่างคำสั่งซื้อ
  const [orders] = useState([
    {
      id: "ORD-2025-001",
      date: "2025-11-10",
      total: 35900,
      status: "shipped", // pending, shipped, delivered, completed
      items: [
        { name: "ASUS TUF Gaming F15", qty: 1, price: 29900 },
        { name: "Logitech G Pro Mouse", qty: 1, price: 6000 },
      ],
    },
    {
      id: "ORD-2025-002",
      date: "2025-11-09",
      total: 15900,
      status: "completed",
      items: [{ name: "Dell Monitor 27”", qty: 1, price: 15900 }],
    },
  ]);

  // แปลสถานะเป็นข้อความไทย
  const statusText = {
    pending: "รอการชำระเงิน",
    shipped: "กำลังจัดส่ง",
    delivered: "จัดส่งสำเร็จ",
    completed: "เสร็จสมบูรณ์",
  };

  // คืน icon ตามสถานะ
  const statusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className={styles.statusIconPending} />;
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

  return (
    <div className={styles.container}>
      <UserSidebar />

      <div className={styles.content}>
        <h1 className={styles.pageTitle}>📦 คำสั่งซื้อของฉัน</h1>

        {orders.length === 0 ? (
          <p className={styles.emptyText}>ยังไม่มีคำสั่งซื้อในตอนนี้</p>
        ) : (
          <div className={styles.orderList}>
            {orders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                {/* หัวคำสั่งซื้อ */}
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

                {/* รายการสินค้า */}
                <div className={styles.orderItems}>
                  {order.items.map((item, i) => (
                    <div key={i} className={styles.itemRow}>
                      <span>{item.name}</span>
                      <span>x{item.qty}</span>
                      <span>{item.price.toLocaleString()} ฿</span>
                    </div>
                  ))}
                </div>

                {/* ส่วนล่าง */}
                <div className={styles.orderFooter}>
                  <p>รวมทั้งหมด: {order.total.toLocaleString()} ฿</p>
                  <button className={styles.trackBtn}>
                    ดูรายละเอียดใบเสร็จ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
