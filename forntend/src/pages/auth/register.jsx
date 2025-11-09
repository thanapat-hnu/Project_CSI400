import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../apis/axios";

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

      console.log("ผลลัพธ์จาก server:", res.data);
      alert(res.data.message);

      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>สมัครสมาชิก</h2>

      <div>
        <label>อีเมล :</label>
        <input
          placeholder="example@hotmail.com"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>รหัสผ่าน :</label>
        <input
          placeholder="******"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>ยืนยันรหัสผ่าน :</label>
        <input
          placeholder="******"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>ชื่อจริง :</label>
        <input
          placeholder="ชื่อจริง"
          type="text"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>นามสกุล :</label>
        <input
          placeholder="นามสกุล"
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>เบอร์ :</label>
        <input
          placeholder="0123456789"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          maxLength={10}
          required
        />
      </div>

      <button type="submit">สมัครสมาชิก</button>
    </form>
  );
};
