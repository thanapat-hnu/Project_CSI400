import React, { useState } from "react";
import styles from "./ContactUs.module.css"; // ✅ import CSS

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
    console.log("Contact form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>ติดต่อเรา</h1>
      <p className={styles.description}>
        หากคุณมีคำถาม ข้อเสนอแนะ หรือข้อสงสัย ทีมงานของเราพร้อมให้ความช่วยเหลือเสมอ
      </p>

      {submitted && (
        <div className={styles.successBox}>
          ขอบคุณสำหรับข้อความของคุณ! เราจะติดต่อกลับโดยเร็วที่สุด 💬
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>ชื่อ</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="ชื่อของคุณ"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>อีเมล</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="example@email.com"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>ข้อความ</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className={styles.textarea}
            placeholder="พิมพ์ข้อความของคุณที่นี่..."
          />
        </div>

        <button type="submit" className={styles.submitBtn}>
          ส่งข้อความ
        </button>
      </form>

      <div className={styles.contactInfo}>
        <p>หรือสามารถติดต่อเราได้ทาง:</p>
        <ul>
          <li>อีเมล: support@yourcompany.com</li>
          <li>โทรศัพท์: 02-123-4567 (จันทร์–ศุกร์ 9:00–18:00 น.)</li>
          <li>โซเชียลมีเดีย: Facebook / Line / Instagram @YourCompany</li>
        </ul>
      </div>
    </div>
  );
};
