import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../apis/axios";

export const MyProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get("/protech/user");
        const { email, first_name, last_name, phone } = res.data.user;
        setUserData({
          email: email,
          firstname: first_name ?? "-",
          lastname: last_name ?? "-",
          phone: phone ?? "-",
        });
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    navigate("/profile/edit");
  };

  const handleAddress = () => {
  navigate("/profile/address");
};

  return (
    <div>
      <div>
        <h1>ข้อมูลส่วนตัว</h1>
        <p>
          <strong>อีเมล:</strong> {userData.email}
        </p>
        <p>
          <strong>ชื่อ:</strong> {userData.firstname}
        </p>
        <p>
          <strong>นามสกุล:</strong> {userData.lastname}
        </p>
        <p>
          <strong>เบอร์โทร:</strong> {userData.phone}
        </p>

        <button onClick={handleEdit}>แก้ไขข้อมูลส่วนตัว</button>
        <button onClick={handleAddress}>ที่อยู่สำหรับจัดส่ง</button>
      </div>
    </div>
  );
};
