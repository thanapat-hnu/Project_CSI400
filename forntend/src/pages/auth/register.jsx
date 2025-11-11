import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../apis/axios";
import styles from "./Register.module.css";
import Swal from "sweetalert2"; // ✅ เพิ่ม SweetAlert2

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

    // 🔹 ตรวจสอบข้อมูลก่อนส่ง
    if (!email || !password || !confirmPassword || !firstname || !lastname || !phone) {
      return Swal.fire({
        icon: "warning",
        title: "กรุณากรอกข้อมูลให้ครบ!",
        text: "ทุกช่องต้องถูกกรอกก่อนดำเนินการต่อ",
        confirmButtonColor: "#f59e0b",
      });
    }

    if (password !== confirmPassword) {
      return Swal.fire({
        icon: "error",
        title: "รหัสผ่านไม่ตรงกัน!",
        confirmButtonColor: "#d33",
      });
    }

    if (password.length < 6) {
      return Swal.fire({
        icon: "warning",
        title: "รหัสผ่านสั้นเกินไป!",
        text: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
        confirmButtonColor: "#f59e0b",
      });
    }

    if (phone.length !== 10) {
      return Swal.fire({
        icon: "warning",
        title: "เบอร์โทรไม่ถูกต้อง!",
        text: "กรุณากรอกเบอร์โทรศัพท์ 10 หลัก",
        confirmButtonColor: "#f59e0b",
      });
    }

    try {
      const res = await api.post("/public/auth/register", {
        email,
        password,
        first_name: firstname,
        last_name: lastname,
        phone,
      });

      await Swal.fire({
        icon: "success",
        title: "สมัครสมาชิกสำเร็จ!",
        text: res.data.message || "สามารถเข้าสู่ระบบได้เลย",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err.message);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: err.response?.data?.message || "ไม่สามารถสมัครสมาชิกได้",
        confirmButtonColor: "#d33",
      });
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
