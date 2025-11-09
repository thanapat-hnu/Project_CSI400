import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../apis/axios";

export const Address = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await api.get("/protech/address"); // เรียก API getAddresses
        if (res.data.addresses) {
          setAddresses(res.data.addresses);
        } else {
          setErrorMsg(res.data.message || "ไม่พบที่อยู่ในระบบ");
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("เกิดข้อผิดพลาดในการดึงที่อยู่");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  if (loading) return <p>กำลังโหลดที่อยู่...</p>;

  return (
    <div>
      <h1>ที่อยู่สำหรับจัดส่ง</h1>

      {/* {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>} */}

      {addresses.length > 0 ? (
        <ul>
          {addresses.map((addr) => (
            <li key={addr.id} style={{ marginBottom: "10px" }}>
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
            </li>
          ))}
        </ul>
      ) : (
        <p>คุณยังไม่มีที่อยู่ในระบบ</p>
      )}
      <button onClick={() => {navigate("/profile/address/create")}}>เพิ่มที่อยู่</button>
    </div>
  );
};
