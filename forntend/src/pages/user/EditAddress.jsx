import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../apis/axios";

export const EditAddress = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    address_line: "",
    city: "",
    province: "",
    postal_code: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await api.get(`/protech/address/${id}`);
        if (res.data.addresses) {
          setFormData(res.data.addresses[0]);
        } else {
          setErrorMsg("ไม่พบที่อยู่");
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/protech/address/${id}`, formData);
      alert("แก้ไขที่อยู่สำเร็จ");
      navigate("/profile/address"); // กลับไปหน้ารายการที่อยู่
    } catch (err) {
      console.error(err);
      alert("แก้ไขไม่สำเร็จ");
    }
  };

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;

  return (
    <div>
      <h1>แก้ไขที่อยู่</h1>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>ที่อยู่:</label>
          <input
            type="text"
            name="address_line"
            value={formData.address_line}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>เมือง:</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>จังหวัด:</label>
          <input
            type="text"
            name="province"
            value={formData.province}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>รหัสไปรษณีย์:</label>
          <input
            type="text"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>เบอร์โทร:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">บันทึก</button>
        <button type="button" onClick={() => navigate("/profile/address")}>
          ยกเลิก
        </button>
      </form>
    </div>
  );
};
