import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../apis/axios";
import UserSidebar from "./UserSidebar";
import styles from "./UserPage.module.css";
import Swal from "sweetalert2"; // ✅ เพิ่ม SweetAlert2

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
          Swal.fire({
            icon: "error",
            title: "ไม่พบข้อมูล!",
            text: "ไม่พบที่อยู่ที่คุณต้องการแก้ไข",
          });
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("เกิดข้อผิดพลาดในการดึงข้อมูล");
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด!",
          text: "ไม่สามารถโหลดข้อมูลที่อยู่ได้",
        });
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
      return Swal.fire({
        icon: "warning",
        title: "เบอร์โทรไม่ถูกต้อง!",
        text: "กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก",
        confirmButtonColor: "#f59e0b",
      });
    }
    if (formData.postalCode.length !== 5) {
      return Swal.fire({
        icon: "warning",
        title: "รหัสไปรษณีย์ไม่ถูกต้อง!",
        text: "กรุณากรอกรหัสไปรษณีย์ให้ครบ 5 หลัก",
        confirmButtonColor: "#f59e0b",
      });
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

      await Swal.fire({
        icon: "success",
        title: "แก้ไขที่อยู่สำเร็จ!",
        text: res.data.message || "อัปเดตข้อมูลเรียบร้อยแล้ว",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/profile/address");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "❌ แก้ไขไม่สำเร็จ");
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: err.response?.data?.message || "ไม่สามารถบันทึกการแก้ไขได้",
        confirmButtonColor: "#d33",
      });
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
