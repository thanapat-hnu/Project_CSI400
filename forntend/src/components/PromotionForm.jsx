import React, { useState } from "react";
import { createPromotion } from "../apis/promotionAPI";
import styles from "./PromotionForm.module.css";

function PromotionForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("start_date", formData.start_date);
      data.append("end_date", formData.end_date);
      data.append("image", formData.image);

      await createPromotion(data);
      alert("✅ เพิ่มโปรโมชั่นสำเร็จ!");

      setFormData({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        image: null,
      });
      setPreview(null);

      if (onSubmit) onSubmit();
    } catch (err) {
      console.error("❌ Error creating promotion:", err);
      alert("เพิ่มโปรโมชั่นไม่สำเร็จ");
    } finally {
      setTimeout(() => setIsSubmitting(false), 300);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input type="text" name="title" placeholder="หัวข้อโปรโมชั่น" value={formData.title} onChange={handleChange} required />
      <textarea name="description" placeholder="รายละเอียดโปรโมชั่น" value={formData.description} onChange={handleChange} required />
      
      <div className={styles.dateFields}>
        <label>
          เริ่มวันที่:
          <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required />
        </label>
        <label>
          สิ้นสุดวันที่:
          <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required />
        </label>
      </div>

      <label>
        อัปโหลดรูปภาพ:
        <input type="file" name="image" accept="image/*" onChange={handleChange} />
      </label>

      {preview && (
        <div className={styles.previewBox}>
          <img src={preview} alt="Preview" className={styles.previewImage} />
        </div>
      )}

      <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
        {isSubmitting ? "⏳ กำลังบันทึก..." : "💾 บันทึกโปรโมชั่น"}
      </button>
    </form>
  );
}

export default PromotionForm;
