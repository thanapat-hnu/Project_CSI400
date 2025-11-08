import React, { useEffect, useState } from "react";
import styles from "./Promotions.module.css";
import { getAllPromotions, deletePromotion, togglePromotionStatus } from "../../apis/promotionAPI";
import PromotionForm from "../../components/PromotionForm";
import CouponManager from "../../components/CouponManager";

function AdminPromotions() {
  const [promotions, setPromotions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const data = await getAllPromotions();
      setPromotions(data);
    } catch (err) {
      console.error("Error fetching promotions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("ต้องการลบโปรโมชั่นนี้ใช่หรือไม่?")) {
      await deletePromotion(id);
      loadPromotions();
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    await togglePromotionStatus(id, !currentStatus);
    loadPromotions();
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <h1 className={styles.title}>จัดการโปรโมชั่น</h1>
        <button className={styles.addButton} onClick={() => setShowForm(!showForm)}>
          {showForm ? "ปิดฟอร์ม" : "➕ เพิ่มโปรโมชั่น"}
        </button>
      </div>

      {showForm && <PromotionForm onSubmit={() => { loadPromotions(); setShowForm(false); }} />}

      <div className={styles.tableContainer}>
        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : promotions.length === 0 ? (
          <p className={styles.noData}>ยังไม่มีโปรโมชั่นในระบบ</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>รูปภาพ</th>
                <th>หัวข้อ</th>
                <th>รายละเอียด</th>
                <th>สถานะ</th>
                <th>ระยะเวลา</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promo) => (
                <tr key={promo.id} className={promo.active ? "" : styles.inactiveRow}>
                  <td>
                    <img src={`http://localhost:3000${promo.image}`} alt={promo.title} className={styles.image} onError={(e) => (e.target.src = "/no-image.jpg")} />
                  </td>
                  <td>{promo.title}</td>
                  <td>{promo.description}</td>
                  <td>
                    <button className={promo.active ? styles.activeButton : styles.inactiveButton} onClick={() => handleToggleStatus(promo.id, promo.active)}>
                      {promo.active ? "เปิดอยู่" : "ปิดอยู่"}
                    </button>
                  </td>
                  <td>
                    {new Date(promo.start_date).toLocaleDateString("th-TH")} - {new Date(promo.end_date).toLocaleDateString("th-TH")}
                  </td>
                  <td>
                    <button className={styles.deleteButton} onClick={() => handleDelete(promo.id)}>
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <CouponManager />
    </div>
  );
}

export default AdminPromotions;
