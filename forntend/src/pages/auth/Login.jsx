import { useState } from "react";
import api from "../../apis/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

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

      // ✅ เก็บ token และ user ลง localStorage
      localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      // ✅ decode JWT เผื่อเช็ก role
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("🎫 Token Payload:", payload);

      // ✅ login context (ถ้ามี)
      login(token);

      // ✅ ตรวจ role แล้ว redirect
      if (payload.roles === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ");
    }
  };

  return (
    <div className="flex flex-col items-center mt-16">
      <h2 className="text-2xl font-bold mb-6">เข้าสู่ระบบ</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-72">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="อีเมล"
          className="border px-3 py-2 rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="รหัสผ่าน"
          className="border px-3 py-2 rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          เข้าสู่ระบบ
        </button>
        <button type="button" onClick={() => navigate("/register")}>
          สมัครสมาชิก
        </button>
      </form>
    </div>
  );
};

export default Login;
