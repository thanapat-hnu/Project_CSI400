import { useState } from "react";
import { createPayment } from "../apis/paymentAPI";
import api from "../apis/axios";
import styles from "./CheckoutPayment.module.css";

const CheckoutPayment = ({ order }) => {
  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!method) {
      alert("❗ กรุณาเลือกช่องทางชำระเงิน");
      return;
    }

    try {
      setLoading(true);

      // ✅ ขั้นตอนที่ 1: ชำระเงิน (บันทึกลงตาราง payments)
      const paymentData = {
        order_id: order.id,
        amount: order.total_amount,
        method, // ช่องทางการชำระเงิน
        status: "success",
      };

      const paymentRes = await createPayment(paymentData);
      console.log("✅ Payment created:", paymentRes);

      // ✅ ขั้นตอนที่ 2: อัปเดตสถานะคำสั่งซื้อเป็น "paid"
      await api.put(
        `/protech/order/${order.id}`,
        { status: "paid" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // ✅ ขั้นตอนที่ 3: ล้างตะกร้าหลังจ่ายเสร็จ
      try {
        await api.delete("/protech/cart", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log("🧹 Cart cleared successfully");
      } catch (cartErr) {
        console.warn("⚠️ ล้างตะกร้าไม่สำเร็จ:", cartErr);
      }

      // ✅ ขั้นตอนที่ 4: แจ้งผู้ใช้
      alert("✅ ชำระเงินและอัปเดตคำสั่งซื้อเรียบร้อยแล้ว!");
    } catch (err) {
      console.error("❌ Payment error:", err);
      alert("❌ การชำระเงินล้มเหลว กรุณาลองอีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.paymentContainer}>
      <h2>💳 ช่องทางชำระเงิน</h2>

      <div className={styles.radioGroup}>
        {[
          "โอนผ่านบัญชี",
          "อินเทอร์เน็ตแบงก์",
          "ทรูวอลเล็ท",
          "พร้อมเพย์",
          "โอนผ่าน Pay",
        ].map((option) => (
          <label key={option} className={styles.radioOption}>
            <input
              type="radio"
              name="payment"
              value={option}
              checked={method === option}
              onChange={(e) => setMethod(e.target.value)}
            />
            {option}
          </label>
        ))}
      </div>

      <button
        className={styles.confirmBtn}
        disabled={!method || loading}
        onClick={handlePayment}
      >
        {loading ? "กำลังชำระเงิน..." : "ยืนยันการชำระเงิน"}
      </button>
    </div>
  );
};

export default CheckoutPayment;
