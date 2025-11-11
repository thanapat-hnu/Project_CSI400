import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../apis/axios";
import UserSidebar from "./UserSidebar";
import styles from "./UserPage.module.css";

// ... import เหมือนเดิม

export const EditAddress = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    addressLine: "",
    city: "",
    province: "",
    postalCode: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await api.get(`/protech/address/${id}`);
        if (res.data.addresses && res.data.addresses[0]) {
          const a = res.data.addresses[0];
          setFormData({
            addressLine: a.address_line || "",
            city: a.city || "",
            province: a.province || "",
            postalCode: a.postal_code || "",
            phone: a.phone || "",
          });
        } else {
          setErrorMsg("ไม่พบที่อยู่");
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    };
    fetchAddress();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ✅ จำกัดความยาวและกรอกได้เฉพาะตัวเลข
    if (name === "phone") {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setFormData((prev) => ({ ...prev, phone: value }));
      }
      return;
    }
    if (name === "postalCode") {
      if (/^\d*$/.test(value) && value.length <= 5) {
        setFormData((prev) => ({ ...prev, postalCode: value }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ ตรวจสอบก่อน submit
    if (formData.phone.length !== 10) {
      setErrorMsg("กรุณากรอกเบอร์โทร 10 ตัวเลข");
      return;
    }
    if (formData.postalCode.length !== 5) {
      setErrorMsg("กรุณากรอกรหัสไปรษณีย์ 5 ตัวเลข");
      return;
    }

    try {
      const payload = {
        addressLine: formData.addressLine,
        city: formData.city,
        province: formData.province,
        postalCode: formData.postalCode,
        phone: formData.phone,
      };

      const res = await api.put(`/protech/address/${id}`, payload);
      alert(res.data.message || "✅ แก้ไขที่อยู่สำเร็จ");
      navigate("/profile/address");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "❌ แก้ไขไม่สำเร็จ");
    }
  };

  if (loading) return <p className={styles.loadingText}>กำลังโหลดข้อมูล...</p>;

  return (
    <div className={styles.container}>
      <UserSidebar />

      <div className={styles.content}>
        <div className={styles.headerRow}>
          <h1>แก้ไขที่อยู่สำหรับจัดส่ง</h1>
          <button
            type="button"
            onClick={() => navigate("/profile/address")}
            className={styles.cancelBtnTop}
          >
            กลับไปหน้าที่อยู่
          </button>
        </div>

        {errorMsg && <p className={styles.error}>{errorMsg}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>ที่อยู่:</label>
              <input
                type="text"
                name="addressLine"
                value={formData.addressLine}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>เมือง:</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>จังหวัด:</label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>รหัสไปรษณีย์:</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
                maxLength={5}
              />
            </div>

            <div className={styles.formGroup}>
              <label>เบอร์โทร:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                maxLength={10}
              />
            </div>
          </div>

          <div className={styles.btnGroup}>
            <button type="submit" className={styles.saveBtn}>
              💾 บันทึกการแก้ไข
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
  );
};
