import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../apis/axios";
import styles from "./Register.module.css"; // ✅ เพิ่ม CSS module

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password, confirmPassword, firstname, lastname, phone } =
      formData;

    if (
      !email ||
      !password ||
      !confirmPassword ||
      !firstname ||
      !lastname ||
      !phone
    ) {
      return alert("กรุณากรอกข้อมูลทุกช่อง!");
    }

    if (password !== confirmPassword) {
      return alert("รหัสผ่านไม่ตรงกัน!");
    }

    if (password.length < 6) {
      return alert("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
    }

    if (phone.length !== 10) {
      return alert("กรุณากรอกเบอร์โทร 10 หลัก");
    }

    try {
      const res = await api.post("/public/auth/register", {
        email,
        password,
        first_name: firstname,
        last_name: lastname,
        phone,
      });

      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.registerBox}>
        <h2 className={styles.title}>สมัครสมาชิก</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>อีเมล</label>
          <input
            type="email"
            name="email"
            placeholder="example@hotmail.com"
            value={formData.email}
            onChange={handleChange}
          />

          <label>รหัสผ่าน</label>
          <input
            type="password"
            name="password"
            placeholder="******"
            value={formData.password}
            onChange={handleChange}
          />

          <label>ยืนยันรหัสผ่าน</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="******"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <label>ชื่อจริง</label>
          <input
            type="text"
            name="firstname"
            placeholder="ชื่อจริง"
            value={formData.firstname}
            onChange={handleChange}
          />

          <label>นามสกุล</label>
          <input
            type="text"
            name="lastname"
            placeholder="นามสกุล"
            value={formData.lastname}
            onChange={handleChange}
          />

          <label>เบอร์โทรศัพท์</label>
          <input
            type="tel"
            name="phone"
            placeholder="0123456789"
            value={formData.phone}
            onChange={handleChange}
            maxLength={10}
          />

          <button type="submit" className={styles.submitBtn}>
            สมัครสมาชิก
          </button>

          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate("/")}
          >
            กลับหน้าหลัก
          </button>

          <p className={styles.footerText}>
            มีบัญชีอยู่แล้ว?{" "}
            <span onClick={() => navigate("/login")} className={styles.link}>
              เข้าสู่ระบบ
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};
