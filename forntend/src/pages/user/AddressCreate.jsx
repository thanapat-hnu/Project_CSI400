import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../apis/axios";

export const AddressCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    addressLine: "",
    city: "",
    province: "",
    postalCode: "",
    phone: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "addressLine",
      "city",
      "province",
      "postalCode",
      "phone",
    ];
    for (let field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        setErrorMsg("กรุณากรอกข้อมูลให้ครบทุกช่อง");
        return;
      }
    }

    try {
      const res = await api.post("/protech/address", formData);

      if (res.data.message === "เพิ่มที่อยู่สำเร็จ") {
        alert(res.data.message);
        navigate("/profile/address");
      } else {
        setErrorMsg(res.data.message || "เกิดข้อผิดพลาดในการเพิ่มที่อยู่");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มที่อยู่"
      );
    }
  };

  const handleCancel = () => {
    navigate("/profile/address");
  };

  return (
    <div>
      <h1>เพิ่มที่อยู่สำหรับจัดส่ง</h1>

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>ที่อยู่:</label>
          <input
            type="text"
            name="addressLine"
            value={formData.addressLine}
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
            name="postalCode"
            value={formData.postalCode}
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

        <button type="submit">บันทึกที่อยู่</button>
        <button
          type="button"
          onClick={handleCancel}
          style={{ marginLeft: "10px" }}
        >
          ยกเลิก
        </button>
      </form>
    </div>
  );
};
