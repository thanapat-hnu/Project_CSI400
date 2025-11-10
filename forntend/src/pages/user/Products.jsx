import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../apis/axios";
import styles from "./Products.module.css";

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  // 🧭 โหลดหมวดหมู่
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/public/category/sub");
        setCategories(res.data);
      } catch (err) {
        console.error("❌ Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // 📦 โหลดสินค้า
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = selectedCategory
          ? `/public/product?category_id=${selectedCategory}`
          : "/public/product";
        const res = await axios.get(url);
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>หมวดหมู่สินค้า</h2>

      {/* 🔹 ปุ่มเลือกหมวดหมู่ */}
      <div className={styles.categoryGrid}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() =>
              setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
            }
            className={`${styles.categoryBtn} ${
              selectedCategory === cat.id ? styles.active : ""
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <h2 className={styles.title}>สินค้าทั้งหมด</h2>

      {/* 🔹 แสดงสินค้าทั้งหมด */}
      <div className={styles.grid}>
        {products.map((product) => (
          <div key={product.id} className={styles.card}>
            <div
              className={styles.imageWrapper}
              onClick={() => navigate(`/products/${product.id}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={
                  product.images?.[0]?.url
                    ? `http://localhost:3000${product.images[0].url}`
                    : "https://dummyimage.com/300x200/e5e7eb/9ca3af.png&text=No+Image"
                }
                alt={product.name}
                className={styles.image}
              />
            </div>

            <div
              className={styles.info}
              onClick={() => navigate(`/products/${product.id}`)}
              style={{ cursor: "pointer" }}
            >
              <h3 className={styles.name}>{product.name}</h3>

              {/* ✅ รายละเอียดสินค้า */}
              <p className={styles.desc}>
                {product.description
                  ? product.description.length > 80
                    ? product.description.slice(0, 80) + "..."
                    : product.description
                  : "ไม่มีรายละเอียดสินค้า"}
              </p>

              <p className={styles.price}>
                ฿
                {Number(product.price).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
