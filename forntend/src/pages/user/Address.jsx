import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../apis/axios";
import UserSidebar from "./UserSidebar";
import styles from "./UserPage.module.css";

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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;

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
                    onClick={() =>
                      navigate(`/profile/address/edit/${addr.id}`)
                    }
                  >
                    ✏️
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={async () => {
                      if (!window.confirm("คุณต้องการลบที่อยู่นี้หรือไม่?")) return;
                      try {
                        await api.delete(`/protech/address/${addr.id}`);
                        setAddresses(addresses.filter((a) => a.id !== addr.id));
                      } catch (err) {
                        console.error(err);
                        alert("ลบที่อยู่ไม่สำเร็จ");
                      }
                    }}
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
