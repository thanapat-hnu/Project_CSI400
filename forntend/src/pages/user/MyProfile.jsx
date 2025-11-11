import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../apis/axios";
import UserSidebar from "./UserSidebar";
import styles from "./UserPage.module.css";
import Swal from "sweetalert2"; // ✅ เพิ่ม SweetAlert2

export const MyProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
  });

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
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด!",
          text: "ไม่สามารถโหลดข้อมูลผู้ใช้ได้",
        });
      }
    };
    fetchUserData();
  }, []);

  // ✅ ฟังก์ชันออกจากระบบ (ใช้ SweetAlert2)
  const handleLogout = () => {
    Swal.fire({
      title: "ยืนยันการออกจากระบบ?",
      text: "คุณต้องการออกจากระบบใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        Swal.fire({
          icon: "success",
          title: "ออกจากระบบเรียบร้อย ✅",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/login");
      }
    });
  };

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

          {/* ปุ่มออกจากระบบ */}
          <div className={styles.buttonWrapper}>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              ออกจากระบบ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
