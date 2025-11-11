import { useState } from "react";
import api from "../../apis/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import Swal from "sweetalert2"; // ✅ เพิ่ม SweetAlert2

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/public/auth/login", { email, password });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));
      login(token);

      // ✅ แสดง popup เข้าสู่ระบบสำเร็จ
      await Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ!",
        showConfirmButton: false,
        timer: 1300,
      });

      // ✅ ตรวจสิทธิ์ role แล้วค่อย navigate
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.roles === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ");

      // ❌ popup แจ้งข้อผิดพลาด
      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        text: err.response?.data?.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>เข้าสู่ระบบ</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="อีเมล"
            className={styles.input}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="รหัสผ่าน"
            className={styles.input}
          />

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.loginBtn}>
            เข้าสู่ระบบ
          </button>

          <p className={styles.footerText}>
            ยังไม่มีบัญชี?{" "}
            <span onClick={() => navigate("/register")} className={styles.link}>
              สมัครสมาชิก
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
