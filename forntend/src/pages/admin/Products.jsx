import React, { useEffect, useState } from "react";
import "./Products.css";
import api from "../../apis/axios";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

const Products = () => {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // ✅ หมวดย่อยเท่านั้น
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [tempPreview, setTempPreview] = useState({}); // ✅ preview ในตาราง

  const initialForm = {
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    image: null,
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ✅ โหลดสินค้าทั้งหมด
  const fetchProducts = async () => {
    try {
      const res = await api.get("/public/product");
      setProducts(res.data);
    } catch (err) {
      console.error("fetchProducts error:", err);
    }
  };

  // ✅ โหลดเฉพาะหมวดย่อยจาก backend
  const fetchCategories = async () => {
    try {
      const res = await api.get("/public/category/sub");
      setCategories(res.data);
    } catch (err) {
      console.error("fetchCategories error:", err);
    }
  };

  // ✅ handle input เปลี่ยนค่า
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      const file = files[0];
      const previewURL = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(previewURL);
      setTempPreview((prev) => ({
        ...prev,
        [editingId || "new"]: previewURL,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ เปิด modal เพิ่มสินค้า
  const openCreateModal = () => {
    setModalMode("create");
    setEditingId(null);
    setFormData(initialForm);
    setImagePreview(null);
    setShowModal(true);
  };

  // ✅ เปิด modal แก้ไขสินค้า
  const openEditModal = (product) => {
    setModalMode("edit");
    setEditingId(product.id);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      category_id: product.category_id || "",
      image: null,
    });
    setImagePreview(null);
    setShowModal(true);
  };

  // ✅ บันทึก (เพิ่ม / แก้ไข)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "create") {
        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (key === "image" && !value) return;
          form.append(key, value);
        });

        await api.post("/private/product", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("สำเร็จ!", "เพิ่มสินค้าสำเร็จ", "success");
      } else if (modalMode === "edit" && editingId) {
        const { name, description, price, stock, category_id } = formData;
        await api.put(`/private/product/${editingId}`, {
          name,
          description,
          price,
          stock,
          category_id,
        });
        Swal.fire("สำเร็จ!", "แก้ไขสินค้าสำเร็จ", "success");
      }

      setShowModal(false);
      setImagePreview(null);
      setFormData(initialForm);
      fetchProducts();
    } catch (err) {
      console.error("handleSubmit error:", err);
      Swal.fire("ผิดพลาด!", "บันทึกสินค้าไม่สำเร็จ", "error");
    }
  };

  // ✅ ลบสินค้า
  const handleDelete = async (product) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      text: `คุณต้องการลบสินค้า "${product.name}" หรือไม่`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/private/product/${product.id}`);
      Swal.fire("สำเร็จ!", "ลบสินค้าสำเร็จ", "success");
      fetchProducts();
    } catch (err) {
      console.error("handleDelete error:", err);
      Swal.fire("ผิดพลาด!", "ลบสินค้าไม่สำเร็จ", "error");
    }
  };

  return (
    <div className="admin-products-container">
      <div className="admin-products-header">
        <h2>📦 จัดการสินค้า</h2>
        <button className="add-btn" onClick={openCreateModal}>
          + เพิ่มสินค้า
        </button>
      </div>

      {/* ✅ ตารางสินค้า */}
      <table className="product-table">
        <thead>
          <tr>
            <th>#</th>
            <th>ชื่อสินค้า</th>
            <th>ราคา</th>
            <th>สต็อก</th>
            <th>หมวดหมู่</th>
            <th>รูปภาพ</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((p, i) => (
              <tr key={p.id}>
                <td>{i + 1}</td>
                <td>{p.name}</td>
                <td>{p.price} บาท</td>
                <td>{p.stock}</td>
                <td>{p.category?.name || "-"}</td>
                <td>
                  {tempPreview[p.id] ? (
                    <img
                      src={tempPreview[p.id]}
                      alt="preview"
                      className="table-img"
                    />
                  ) : p.images && p.images.length > 0 ? (
                    <img
                      src={`http://localhost:3000${p.images[0].url}`}
                      alt={p.name}
                      className="table-img"
                    />
                  ) : (
                    <span className="no-image">ไม่มีรูป</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => openEditModal(p)}
                  >
                    แก้ไข
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(p)}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", color: "#666" }}>
                ไม่มีข้อมูลสินค้า
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ✅ Modal เพิ่ม / แก้ไขสินค้า */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>{modalMode === "create" ? "เพิ่มสินค้าใหม่" : "แก้ไขสินค้า"}</h3>

            <form onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="ชื่อสินค้า"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="description"
                placeholder="รายละเอียดสินค้า"
                value={formData.description}
                onChange={handleInputChange}
              />
              <input
                name="price"
                type="number"
                placeholder="ราคา"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
              <input
                name="stock"
                type="number"
                placeholder="จำนวนในสต็อก"
                value={formData.stock}
                onChange={handleInputChange}
                required
              />

              {/* ✅ ดึงหมวดย่อยจาก /public/category/sub */}
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                required
              >
                <option value="">เลือกหมวดย่อย</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* ✅ พรีวิวรูป */}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleInputChange}
              />
              {imagePreview && (
                <div className="image-preview-container">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                </div>
              )}

              <div className="modal-buttons">
                <button type="submit" className="save-btn">
                  {modalMode === "create" ? "บันทึก" : "บันทึกการแก้ไข"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowModal(false);
                    setImagePreview(null);
                    setFormData(initialForm);
                  }}
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
