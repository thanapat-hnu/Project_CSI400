import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../apis/axios";

export const ProfileEdit = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
  });

  const [originalData, setOriginalData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(""); // สำหรับข้อความแจ้งเตือน

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
        setOriginalData(user); // เก็บข้อมูลเดิม
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", err);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" && value.length > 10) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        alert("อัปเดตข้อมูลสำเร็จ!");
        navigate("/profile");
      } else {
        setErrorMsg(res.data.message || "เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("ไม่สามารถอัปเดตข้อมูลได้");
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div>
      <h1>แก้ไขข้อมูลส่วนตัว</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>อีเมล:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            style={{ backgroundColor: "#f2f2f2", cursor: "not-allowed" }}
          />
        </div>

        <div>
          <label>ชื่อ:</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>นามสกุล:</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>เบอร์โทร:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        {/* ✅ ข้อความแจ้งเตือน */}
        {errorMsg && (
          <p style={{ color: "red", marginTop: "10px" }}>{errorMsg}</p>
        )}

        <button type="submit">ยืนยันการแก้ไข</button>
        <button
          type="button"
          onClick={handleCancel}
          style={{ marginLeft: "10px" }}
        >
          กลับไปหน้า ข้อมูลส่วนตัว
        </button>
      </form>
    </div>
  );
};
