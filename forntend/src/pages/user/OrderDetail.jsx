import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./OrderDetail.module.css";
import UserSidebar from "./UserSidebar";
import { FaPrint } from "react-icons/fa";
import api from "../../apis/axios";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const order = state?.order;

  const [profile, setProfile] = useState(null);
  const [address, setAddress] = useState(null);

  // ✅ โหลดข้อมูลผู้ใช้
  useEffect(() => {
    const fetchProfileAndAddress = async () => {
      try {
        const token = localStorage.getItem("token");

        const [userRes, addressRes] = await Promise.all([
          api.get("/protech/user", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/protech/address", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const user = userRes.data.user || {};
        const addr = addressRes.data.addresses?.[0] || {}; // ✅ ใช้ที่อยู่ล่าสุด

        setProfile({
          name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "ลูกค้า",
          phone: user.phone || "-",
        });

        setAddress({
          fullAddress: addr.address_line
            ? `${addr.address_line}, ${addr.city}, ${addr.province}, ${addr.postal_code}`
            : "ไม่พบที่อยู่",
        });
      } catch (err) {
        console.error("❌ โหลดข้อมูลผู้ใช้ / ที่อยู่ล้มเหลว:", err);
      }
    };

    fetchProfileAndAddress();
  }, []);

  if (!order)
    return (
      <div className={styles.container}>
        <UserSidebar />
        <div className={styles.invoice}>
          <h2>❌ ไม่พบข้อมูลคำสั่งซื้อ</h2>
          <button onClick={() => navigate("/user/orders")} className={styles.backBtn}>
            กลับไปหน้าคำสั่งซื้อของฉัน
          </button>
        </div>
      </div>
    );

  const subtotal =
    order.items?.reduce((sum, item) => sum + item.price * item.qty, 0) || 0;
  const vat = subtotal * 0.07;
  const total = subtotal + vat;

  return (
    <div className={styles.container}>
      <UserSidebar />
      <div className={styles.invoice}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.logo}>LOGO</h1>
          <div className={styles.headerRight}>
            <h2>ใบเสร็จรับเงิน / ใบกำกับภาษี</h2>
            <p>
              วันที่: {order.date} | เลขที่: {order.id}
            </p>
            <button className={styles.printBtn} onClick={() => window.print()}>
              <FaPrint /> พิมพ์ใบเสร็จ
            </button>
          </div>
        </div>

        <hr className={styles.line} />

        {/* 🔹 ข้อมูลผู้ขาย */}
        <div className={styles.seller}>
          <h3>ชื่อผู้ขาย:</h3>
          <p>บริษัท Moss Tech Solution จำกัด</p>
          <p>ที่อยู่: 88 ถนนลาดพร้าว เขตจตุจักร กรุงเทพมหานคร 10900</p>
          <p>โทรศัพท์: 0999999999</p>
        </div>

        {/* 🔹 ข้อมูลผู้ซื้อ */}
        <div className={styles.buyer}>
          <h3>ชื่อผู้ซื้อ:</h3>
          <p>{profile?.name || "ลูกค้า"}</p>
          <p>{address?.fullAddress || "ไม่พบที่อยู่"}</p>
          <p>โทรศัพท์: {profile?.phone || "-"}</p>
        </div>

        {/* ตารางสินค้า */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>รายการ</th>
              <th>จำนวน</th>
              <th>หน่วยละ</th>
              <th>จำนวนเงิน</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>{item.price.toLocaleString()}</td>
                <td>{(item.price * item.qty).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* สรุปยอด */}
        <div className={styles.summary}>
          <p>มูลค่ารวมก่อนภาษี: {subtotal.toLocaleString()} ฿</p>
          <p>ภาษีมูลค่าเพิ่ม (VAT 7%): {vat.toLocaleString()} ฿</p>
          <p className={styles.total}>ยอดรวม: {total.toLocaleString()} ฿</p>
        </div>

        <p className={styles.thankyou}>ขอบคุณที่ใช้บริการ 🙏</p>
      </div>
    </div>
  );
};

export default OrderDetail;
