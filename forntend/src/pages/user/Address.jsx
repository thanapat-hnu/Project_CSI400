import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../apis/axios";
import UserSidebar from "./UserSidebar";
import styles from "./UserPage.module.css";
import Swal from "sweetalert2"; // ✅ เพิ่ม SweetAlert2

export const Address = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [user, setUser] = useState({ first_name: "", last_name: "" });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get("/protech/user");
        setUser(userRes.data.user);

        const addrRes = await api.get("/protech/address");
        setAddresses(addrRes.data.addresses || []);
      } catch (err) {
        console.error(err);
        setErrorMsg("เกิดข้อผิดพลาดในการดึงข้อมูล");
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด!",
          text: "ไม่สามารถโหลดข้อมูลที่อยู่ได้",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;

  // 🗑️ ลบที่อยู่ (พร้อม SweetAlert)
  const handleDelete = async (addr) => {
    const confirmResult = await Swal.fire({
      title: "คุณต้องการลบที่อยู่นี้หรือไม่?",
      text: `${addr.address_line} ${addr.city} ${addr.province}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "ลบเลย",
      cancelButtonText: "ยกเลิก",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      await api.delete(`/protech/address/${addr.id}`);
      setAddresses((prev) => prev.filter((a) => a.id !== addr.id));
      Swal.fire({
        icon: "success",
        title: "ลบที่อยู่เรียบร้อย!",
        showConfirmButton: false,
        timer: 1300,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "ลบไม่สำเร็จ!",
        text: "ไม่สามารถลบที่อยู่นี้ได้ โปรดลองอีกครั้ง",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className={styles.container}>
      <UserSidebar />

      <div className={styles.content}>
        {/* 🔹 หัวข้อ */}
        <div className={styles.addressHeader}>
          <h1>📍 ที่อยู่สำหรับจัดส่ง</h1>
          <button
            className={styles.addAddressBtn}
            onClick={() => navigate("/profile/address/create")}
          >
            ➕ เพิ่มที่อยู่
          </button>
        </div>

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        {/* 🔹 รายการที่อยู่ */}
        {addresses.length > 0 ? (
          <div className={styles.addressList}>
            {addresses.map((addr) => (
              <div key={addr.id} className={styles.addressCard}>
                <div className={styles.addressInfo}>
                  <div className={styles.addrLabel}>สำหรับจัดส่ง</div>
                  <div className={styles.addrDetails}>
                    {addr.address_line} {addr.city} {addr.province}{" "}
                    {addr.postal_code}
                  </div>
                  <div className={styles.addrPhone}>{addr.phone}</div>
                </div>

                <div className={styles.addrActions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => navigate(`/profile/address/edit/${addr.id}`)}
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(addr)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noAddress}>คุณยังไม่มีที่อยู่ในระบบ</p>
        )}
      </div>
    </div>
  );
};
