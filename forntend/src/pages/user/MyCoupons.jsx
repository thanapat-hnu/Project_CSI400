import { useState, useEffect } from "react";
import api from "../../apis/axios";
import UserSidebar from "./UserSidebar";
import styles from "./UserPage.module.css";
import { discardCoupon } from "../../apis/couponAPI";
import Swal from "sweetalert2";

const MyCoupons = () => {
  const [tab, setTab] = useState("saved"); // ✅ "saved" หรือ "used"
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // โหลดคูปอง
  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const url =
          tab === "saved"
            ? "/protech/coupon/saved"
            : "/protech/coupon/used";
        const res = await api.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCoupons(res.data.coupons || []);
      } catch (err) {
        console.error("❌ ดึงข้อมูลคูปองล้มเหลว:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, [tab]);

  // ✅ ฟังก์ชันลบทิ้งคูปองหมดอายุ
  const handleDiscard = async (couponId) => {
    // ✅ แสดง popup ยืนยันก่อนลบ
    const result = await Swal.fire({
      title: "คุณต้องการทิ้งคูปองนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่",
      cancelButtonText: "ยกเลิก",
    });

    if (!result.isConfirmed) return;

    try {
      await discardCoupon(couponId);
      // ✅ แสดง popup success
      await Swal.fire({
        icon: "success",
        title: "🗑️ ลบคูปองหมดอายุเรียบร้อยแล้ว",
        showConfirmButton: false,
        timer: 1500,
      });

      // ✅ อัปเดต state
      setCoupons(coupons.filter((c) => c.id !== couponId));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "❌ ไม่สามารถลบคูปองได้",
        text: err.response?.data?.message || "",
      });
    }
  };

  // ✅ ฟังก์ชันตรวจสอบคูปองหมดอายุ
  const isExpired = (coupon) => {
    if (!coupon.expire_date) return false;
    return new Date(coupon.expire_date) < new Date();
  };

  return (
    <div className={styles.container}>
      <UserSidebar />

      <div className={styles.content}>
        <h1>🎟️ คูปองของฉัน</h1>

        {/* 🔘 แท็บ */}
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tabBtn} ${tab === "saved" ? styles.activeTab : ""
              }`}
            onClick={() => setTab("saved")}
          >
            คูปองที่เก็บไว้
          </button>
          <button
            className={`${styles.tabBtn} ${tab === "used" ? styles.activeTab : ""
              }`}
            onClick={() => setTab("used")}
          >
            คูปองที่ใช้แล้ว
          </button>
        </div>

        {loading ? (
          <p>⏳ กำลังโหลด...</p>
        ) : coupons.length === 0 ? (
          <p>
            {tab === "saved"
              ? "คุณยังไม่มีคูปองที่เก็บไว้"
              : "คุณยังไม่เคยใช้คูปอง"}
          </p>
        ) : (
          <div className={styles.couponGrid}>
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                className={`${styles.couponCard} ${tab === "used" ? styles.usedCoupon : ""
                  }`}
              >
                <h3>{coupon.code}</h3>
                <p>
                  ประเภท:{" "}
                  {coupon.type === "percent" ? "เปอร์เซ็นต์" : "คงที่"}
                </p>
                <p>
                  ส่วนลด:{" "}
                  {coupon.type === "percent"
                    ? `${coupon.value}%`
                    : `${Number(coupon.value).toFixed(2)} บาท`}
                </p>
                <p>ขั้นต่ำ: {coupon.min_order_amount} บาท</p>
                <p>
                  หมดอายุ:{" "}
                  {coupon.expire_date
                    ? new Date(coupon.expire_date).toLocaleDateString("th-TH")
                    : "-"}
                </p>

                {/* 🧾 ใช้แล้ว */}
                {tab === "used" && (
                  <p className={styles.usedText}>🧾 ใช้แล้ว</p>
                )}

                {/* 🗑️ ปุ่มทิ้งคูปอง (เฉพาะที่หมดอายุ) */}
                {tab === "saved" && isExpired(coupon) && (
                  <button
                    className={styles.discardBtn}
                    onClick={() => handleDiscard(coupon.id)}
                  >
                    🗑️ ทิ้งคูปอง
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoupons;
