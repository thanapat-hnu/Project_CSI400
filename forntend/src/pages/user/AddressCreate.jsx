import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../apis/axios";
import UserSidebar from "./UserSidebar";
import styles from "./UserPage.module.css";
import { FaMapMarkerAlt } from "react-icons/fa";

export const AddressCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    addressLine: "",
    city: "",
    province: "",
    postalCode: "",
    phone: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/protech/address", formData);
      alert("เพิ่มที่อยู่สำเร็จ");
      navigate("/profile/address");
    } catch (err) {
      console.error(err);
      setErrorMsg("เกิดข้อผิดพลาดในการเพิ่มที่อยู่");
    }
  };

  return (
    <div className={styles.container}>
      <UserSidebar />

      <div className={styles.content}>
        {/* 🔹 Header */}
        <div className={styles.addressHeader}>
          <div className={styles.headerLeft}>
            <FaMapMarkerAlt className={styles.icon} />
            <h1>เพิ่มที่อยู่สำหรับจัดส่ง</h1>
          </div>
          <button
            className={styles.backBtn}
            onClick={() => navigate("/profile/address")}
          >
            กลับไปหน้า ที่อยู่
          </button>
        </div>

        {/* 🔹 Form Card */}
        <div className={styles.editCard}>
          {errorMsg && <p className={styles.error}>{errorMsg}</p>}
          <form onSubmit={handleSubmit} className={styles.editForm}>
            <div className={styles.formGrid}>
              <div className={styles.formGroupFull}>
                <label>ที่อยู่</label>
                <input
                  type="text"
                  name="addressLine"
                  value={formData.addressLine}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>เมือง</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>จังหวัด</label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>รหัสไปรษณีย์</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>เบอร์โทร</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.btnGroup}>
              <button type="submit" className={styles.saveProfileBtn}>
                บันทึกที่อยู่
              </button>
              <button
                type="button"
                onClick={() => navigate("/profile/address")}
                className={styles.cancelBtn}
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
