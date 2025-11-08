import React, { useEffect, useState } from "react";
import { getPublicPromotions } from "../../apis/promotionAPI";
import { getPublicCoupons, saveUserCoupon } from "../../apis/couponAPI";
import styles from "./HomePromotions.module.css";

function HomePromotions() {
  const [promotions, setPromotions] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // โหลดโปรโมชั่นทั้งหมด
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const data = await getPublicPromotions();
        setPromotions(data);
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    };
    fetchPromotions();
  }, []);

  // โหลดคูปองทั้งหมด
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const fetchCoupons = async () => {
      try {
        const data = await getPublicCoupons();
        setCoupons(data);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };
    fetchCoupons();
  }, []);

  // ✅ ฟังก์ชันเก็บคูปอง
  const handleSaveCoupon = async (couponId) => {
    try {
      await saveUserCoupon(couponId);
      alert("🎟️ เก็บคูปองเรียบร้อยแล้ว!");
    } catch (err) {
      alert(err.response?.data?.message || "เกิดข้อผิดพลาดในการเก็บคูปอง");
    }
  };

  return (
    <div className={styles.promotionsPage}>
      {/* 🟦 Hero Section */}
      <div className={styles.heroSection}>
        <h1>🎉 โปรโมชั่นพิเศษจากเรา</h1>
        <p>ไม่ว่าคุณจะเป็นสมาชิกหรือลูกค้าใหม่ ก็รับสิทธิ์ได้ทันที!</p>
      </div>

      {/* 🧾 Promotion List */}
      <div className={styles.promotionContent}>
        <h2>โปรโมชั่นทั้งหมด</h2>

        {promotions.length === 0 ? (
          <p className={styles.noPromotions}>ขณะนี้ยังไม่มีโปรโมชั่น</p>
        ) : (
          <div className={styles.marqueeWrapper}>
            <div className={styles.marqueeTrack}>
              {promotions.concat(promotions).map((promo, i) => (
                <div key={i} className={styles.promotionCard}>
                  <img
                    src={
                      promo.image?.startsWith("http")
                        ? promo.image
                        : `http://localhost:3000${promo.image}`
                    }
                    alt={promo.title}
                    className={styles.image}
                    onError={(e) => (e.target.src = "/no-image.jpg")}
                  />
                  <h3>{promo.title}</h3>
                  <p>{promo.description}</p>
                  <p className={styles.promotionDate}>
                    {new Date(promo.start_date).toLocaleDateString("th-TH")} -{" "}
                    {new Date(promo.end_date).toLocaleDateString("th-TH")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 🎟️ Coupon Section */}
      <div className={styles.couponSection}>
        <h2>🎟️ คูปองส่วนลดสำหรับสมาชิก</h2>

        {coupons.length === 0 ? (
          <p className={styles.noPromotions}>ยังไม่มีคูปองในขณะนี้</p>
        ) : (
          <div className={styles.couponMarquee}>
            <div className={styles.couponTrack}>
              {coupons.concat(coupons).map((coupon, index) => (
                <div key={index} className={styles.couponCard}>
                  <span
                    className={
                      coupon.active ? styles.activeBadge : styles.inactiveBadge
                    }
                  >
                    {coupon.active ? "ใช้งานได้" : "หมดอายุ"}
                  </span>

                  <h3>รหัส: {coupon.code}</h3>
                  <p>
                    ประเภท:{" "}
                    {coupon.type === "fixed"
                      ? `ลด ${coupon.value} บาท`
                      : `ลด ${coupon.value}%`}
                  </p>
                  <p>
                    {coupon.min_order_amount > 0
                      ? `ยอดสั่งซื้อขั้นต่ำ ${coupon.min_order_amount} บาท`
                      : "ใช้ได้ทุกยอดสั่งซื้อ"}
                  </p>
                  <p className={styles.couponDate}>
                    {new Date(coupon.start_date).toLocaleDateString("th-TH")} -{" "}
                    {new Date(coupon.expire_date).toLocaleDateString("th-TH")}
                  </p>

                  {isLoggedIn && (
                    <button
                      className={styles.btnSave}
                      onClick={() => handleSaveCoupon(coupon.id)}
                    >
                      💾 เก็บคูปอง
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 🦶 Footer */}
      <footer className={styles.footer}>
        © {new Date().getFullYear()} SlideShop. All rights reserved.
      </footer>
    </div>
  );
}

export default HomePromotions;
