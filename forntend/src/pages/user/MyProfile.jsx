import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../apis/axios";
import UserSidebar from "./UserSidebar";
import styles from "./UserPage.module.css";

export const MyProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
  });
  const [coupons, setCoupons] = useState([]); // ✅ เพิ่ม state คูปอง
  const [loadingCoupons, setLoadingCoupons] = useState(true);

  // ✅ โหลดข้อมูลผู้ใช้
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get("/protech/user");
        const { email, first_name, last_name, phone } = res.data.user;
        setUserData({
          email,
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

  return (
    <div className={styles.container}>
      <UserSidebar />

      <div className={styles.content}>
        {/* ส่วนหัว */}
        <div className={styles.header}>
          <h1>ข้อมูลส่วนตัว</h1>
          <button
            className={styles.editProfileBtn}
            onClick={() => navigate("/profile/edit")}
          >
            แก้ไขข้อมูลส่วนตัว
          </button>
        </div>

        {/* 🧍‍♂️ โปรไฟล์กลางหน้า */}
        <div className={styles.centerProfile}>
          <div className={styles.profileCardLarge}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="avatar"
              className={styles.avatarLarge}
            />
            <div className={styles.profileInfo}>
              <h2>
                {userData.firstname} {userData.lastname}
              </h2>
              <p>{userData.email}</p>
              <p>📞 {userData.phone}</p>
            </div>
          </div>
        </div>

        {/* 📋 ตารางข้อมูลพื้นฐาน */}
        <div className={styles.infoTableSingle}>
          <table>
            <thead>
              <tr>
                <th>ชื่อ - นามสกุล</th>
                <th>อีเมล</th>
                <th>หมายเลขโทรศัพท์</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {userData.firstname} {userData.lastname}
                </td>
                <td>{userData.email}</td>
                <td>{userData.phone}</td>
              </tr>
            </tbody>
          </table>
          <button

            onClick={() => {
              localStorage.removeItem("token");
              alert("ออกจากระบบเรียบร้อย ✅");
              navigate("/login");
            }}
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  );
};
