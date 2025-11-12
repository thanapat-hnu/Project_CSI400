import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../../apis/orderAPI";
import styles from "./OrderDetail.module.css";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(id);
        if (res?.data) {
          setOrder(res.data);
        } else {
          setOrder({ items: [] });
        }
      } catch (err) {
        console.error("❌ โหลดคำสั่งซื้อไม่สำเร็จ:", err);
        setOrder({ items: [] });
      }
    };
    fetchOrder();
  }, [id]);

  if (!order) return <p className={styles.loading}>⏳ กำลังโหลดข้อมูลคำสั่งซื้อ...</p>;

  const handlePaymentConfirm = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      navigate("/profile/orders");
    }, 2000);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>รายละเอียดคำสั่งซื้อ #{order.id || "-"}</h2>

      <div className={styles.section}>
        <h3>📦 สินค้าในคำสั่งซื้อ</h3>
        {order?.items?.length > 0 ? (
          order.items.map((item) => (
            <div key={item.id || Math.random()} className={styles.itemRow}>
              <span>{item.product?.name || "ไม่พบชื่อสินค้า"}</span>
              <span>x{item.quantity || 0}</span>
              <span>฿{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
            </div>
          ))
        ) : (
          <p>ไม่มีสินค้าในคำสั่งซื้อนี้</p>
        )}
      </div>

      <div className={styles.section}>
        <h3>🏠 ที่อยู่จัดส่ง</h3>
        <p>{order?.address?.full_address || "ที่อยู่ผู้ใช้ (ดึงจากระบบ Address ที่เลือกใน Checkout)"}</p>
      </div>

      <div className={styles.section}>
        <h3>🚚 รูปแบบการจัดส่ง</h3>
        <p>{order?.shipping_method || "พัสดุธรรมดา (Mock)"}</p>
      </div>

      <div className={styles.section}>
        <h3>💳 ช่องทางชำระเงิน</h3>
        <p>{order?.payment_method || "โอนผ่านบัญชีธนาคาร (Mock)"}</p>
      </div>

      <div className={styles.summaryBox}>
        <div className={styles.summaryRow}>
          <span>ราคาก่อนภาษี:</span>
          <span>฿{((order?.total_amount || 0) / 1.07).toFixed(2)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>ภาษี VAT 7%:</span>
          <span>฿{((order?.total_amount || 0) - (order?.total_amount || 0) / 1.07).toFixed(2)}</span>
        </div>
        <div className={styles.totalRow}>
          <span>ยอดรวมทั้งหมด:</span>
          <span className={styles.totalPrice}>฿{Number(order?.total_amount || 0).toFixed(2)}</span>
        </div>
      </div>

      <button className={styles.confirmBtn} onClick={handlePaymentConfirm}>
        ยืนยันการชำระเงิน
      </button>

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupBox}>
            <h3>✅ ชำระเงินสำเร็จ</h3>
            <p>ขอบคุณที่ใช้บริการ</p>
          </div>
        </div>
      )}
    </div>
  );
}