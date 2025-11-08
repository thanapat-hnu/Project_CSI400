import React, { useEffect, useState } from "react";
import {
  getAllCoupons,
  createCoupon,
  deleteCoupon,
  updateCouponStatus,
} from "../apis/couponAPI";
import styles from "./CouponManager.module.css";

function CouponManager() {
  const [coupons, setCoupons] = useState([]);
  const [formData, setFormData] = useState({
    code: "",
    type: "fixed",
    value: "",
    min_order_amount: "",
    start_date: "",
    expire_date: "",
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const res = await getAllCoupons();
      setCoupons(res.data);
    } catch (err) {
      console.error("Error loading coupons:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCoupon(formData);
      setFormData({
        code: "",
        type: "fixed",
        value: "",
        min_order_amount: "",
        start_date: "",
        expire_date: "",
      });
      loadCoupons();
    } catch (err) {
      alert("ไม่สามารถสร้างคูปองได้");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("ต้องการลบคูปองนี้หรือไม่?")) {
      await deleteCoupon(id);
      loadCoupons();
    }
  };

  const handleToggle = async (id, active) => {
    await updateCouponStatus(id, !active);
    loadCoupons();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>จัดการคูปอง</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="รหัสคูปอง"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          required
        />

        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="fixed">ลดเป็นจำนวนเงิน</option>
          <option value="percent">ลดเป็นเปอร์เซ็นต์</option>
        </select>

        <input
          type="number"
          placeholder="มูลค่าส่วนลด"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="ยอดสั่งซื้อขั้นต่ำ (0 = เท่าไหร่ก็ได้)"
          value={formData.min_order_amount}
          onChange={(e) =>
            setFormData({ ...formData, min_order_amount: e.target.value })
          }
        />

        <input
          type="date"
          value={formData.start_date}
          onChange={(e) =>
            setFormData({ ...formData, start_date: e.target.value })
          }
        />
        <input
          type="date"
          value={formData.expire_date}
          onChange={(e) =>
            setFormData({ ...formData, expire_date: e.target.value })
          }
        />
        <button type="submit" className={styles.createButton}>
          บันทึกคูปอง
        </button>
      </form>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>รหัส</th>
              <th>ประเภท</th>
              <th>มูลค่า</th>
              <th>ขั้นต่ำ</th>
              <th>วันเริ่มต้น</th>
              <th>วันหมดอายุ</th>
              <th>สถานะ</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan="8" className={styles.noData}>
                  ยังไม่มีคูปองในระบบ
                </td>
              </tr>
            ) : (
              coupons.map((c) => {
                const expired =
                  c.expire_date && new Date(c.expire_date) < new Date();
                return (
                  <tr key={c.id} style={{ opacity: expired ? 0.6 : 1 }}>
                    <td>{c.code}</td>
                    <td>{c.type === "fixed" ? "จำนวนเงิน" : "%"}</td>
                    <td>{c.value}</td>
                    <td>
                      {c.min_order_amount > 0
                        ? `${c.min_order_amount} บาท`
                        : "เท่าไหร่ก็ได้"}
                    </td>
                    <td>{c.start_date?.slice(0, 10) || "-"}</td>
                    <td>{c.expire_date?.slice(0, 10) || "-"}</td>
                    <td>
                      <button
                        onClick={() => handleToggle(c.id, c.active)}
                        className={
                          c.active
                            ? styles.activeButton
                            : styles.inactiveButton
                        }
                        disabled={expired}
                      >
                        {expired ? "หมดอายุ" : c.active ? "เปิด" : "ปิด"}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className={styles.deleteButton}
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CouponManager;
