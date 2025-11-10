import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../apis/axios";

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
    <div>
      <h1>ที่อยู่สำหรับจัดส่ง</h1>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      {addresses.length > 0 ? (
        <ul>
          {addresses.map((addr) => (
            <li key={addr.id} style={{ marginBottom: "10px" }}>
              <p>
                <strong>ชื่อ-นามสกุล:</strong> {user?.first_name}{" "}
                {user?.last_name}
              </p>
              <p>
                <strong>ที่อยู่:</strong> {addr.address_line}
              </p>
              <p>
                <strong>เมือง:</strong> {addr.city}
              </p>
              <p>
                <strong>จังหวัด:</strong> {addr.province}
              </p>
              <p>
                <strong>รหัสไปรษณีย์:</strong> {addr.postal_code}
              </p>
              <p>
                <strong>เบอร์โทร:</strong> {addr.phone}
              </p>

              <button
                onClick={() => navigate(`/profile/address/edit/${addr.id}`)}
              >
                แก้ไข
              </button>

              <button
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
                ลบ
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>คุณยังไม่มีที่อยู่ในระบบ</p>
      )}

      <button onClick={() => navigate("/profile/address/create")}>
        เพิ่มที่อยู่
      </button>
      <button onClick={() => navigate("/profile")}>ข้อมูลส่วนตัว</button>
    </div>
  );
};
