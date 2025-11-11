// ContactUs.jsx
import React, { useState } from "react";

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // ส่งข้อมูลไป backend (ยังไม่ทำ)
    console.log("Contact form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h1 className="text-3xl font-bold mb-4">ติดต่อเรา</h1>
      <p className="mb-6 text-gray-700">
        หากคุณมีคำถาม ข้อเสนอแนะ หรือข้อสงสัย ทีมงานของเราพร้อมให้ความช่วยเหลือเสมอ
      </p>

      {submitted && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          ขอบคุณสำหรับข้อความของคุณ! เราจะติดต่อกลับโดยเร็วที่สุด
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">ชื่อ</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="ชื่อของคุณ"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">อีเมล</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">ข้อความ</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            className="w-full border px-3 py-2 rounded"
            placeholder="พิมพ์ข้อความของคุณที่นี่..."
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          ส่งข้อความ
        </button>
      </form>

      <div className="mt-6 text-gray-700">
        <p>หรือสามารถติดต่อเราได้ทาง:</p>
        <ul className="list-disc list-inside">
          <li>อีเมล: support@yourcompany.com</li>
          <li>โทรศัพท์: 02-123-4567 (จันทร์–ศุกร์ 9:00–18:00 น.)</li>
          <li>โซเชียลมีเดีย: Facebook / Line / Instagram @YourCompany</li>
        </ul>
      </div>
    </div>
  );
};
