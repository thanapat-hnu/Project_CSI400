import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../apis/axios";
import UserSidebar from "./UserSidebar";
import styles from "./UserPage.module.css";
import { FaUserEdit } from "react-icons/fa"; // ✅ ไอคอนหัวข้อ

export const ProfileEdit = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
  });
  const [originalData, setOriginalData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get("/protech/user");
        const { email, first_name, last_name, phone } = res.data.user;

        const user = {
          email: email ?? "",
          firstname: first_name ?? "",
          lastname: last_name ?? "",
          phone: phone ?? "",
        };

        setFormData(user);
        setOriginalData(user);
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", err);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && value.length > 10) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.firstname === originalData.firstname &&
      formData.lastname === originalData.lastname &&
      formData.phone === originalData.phone
    ) {
      setErrorMsg("คุณไม่ได้แก้ไขข้อมูลใด ๆ");
      return;
    }

    try {
      const res = await api.put("/protech/user", {
        first_name: formData.firstname,
        last_name: formData.lastname,
        phone: formData.phone,
      });

      if (res.data.message === "อัปเดตข้อมูลสำเร็จ") {
        alert("✅ อัปเดตข้อมูลสำเร็จ!");
        navigate("/profile");
      } else {
        setErrorMsg(res.data.message || "เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
      }
    } catch (err) {
      setErrorMsg("ไม่สามารถอัปเดตข้อมูลได้");
    }
  };

  return (
    <div className={styles.container}>
      <UserSidebar />

      <div className={styles.content}>
        {/* 🔹 หัวข้อ */}
        <div className={styles.editHeader}>
          <div className={styles.headerLeft}>
            <FaUserEdit className={styles.icon} />
            <h1>แก้ไขข้อมูลส่วนตัว</h1>
          </div>
          <button
            className={styles.backBtn}
            onClick={() => navigate("/profile")}
          >
            กลับไปหน้าข้อมูลส่วนตัว
          </button>
        </div>

        {/* 🔹 กล่องฟอร์ม */}
        <div className={styles.editCard}>
          <form onSubmit={handleSubmit} className={styles.editForm}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>ชื่อ</label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="กรอกชื่อจริง"
                />
              </div>

              <div className={styles.formGroup}>
                <label>นามสกุล</label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="กรอกนามสกุล"
                />
              </div>

              <div className={styles.formGroup}>
                <label>อีเมล</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                />
              </div>

              <div className={styles.formGroup}>
                <label>เบอร์โทรศัพท์</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="กรอกเบอร์โทรศัพท์"
                />
              </div>
            </div>

            {errorMsg && <p className={styles.error}>{errorMsg}</p>}

            <div className={styles.btnGroup}>
              <button type="submit" className={styles.saveProfileBtn}>
                💾 บันทึกการแก้ไข
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => navigate("/profile")}
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
