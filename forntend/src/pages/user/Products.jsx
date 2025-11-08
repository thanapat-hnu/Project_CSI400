import { useEffect, useState } from "react";
import axios from "../../apis/axios";
import styles from "./Products.module.css";

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 🧭 โหลดหมวดหมู่จาก DB
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

  // 📦 โหลดสินค้า (ทั้งหมดหรือเฉพาะตามหมวด)
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

      {/* 🧩 ปุ่มหมวดหมู่จาก DB */}
      <div className={styles.categoryGrid}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`${styles.categoryBtn} ${
              selectedCategory === cat.id ? styles.active : ""
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <h2 className={styles.title}>สินค้าทั้งหมด</h2>

      <div className={styles.grid}>
        {products.map((product) => (
          <div key={product.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img
                src={
                  product.images?.[0]?.url
                    ? product.images[0].url.startsWith("http")
                      ? product.images[0].url
                      : `http://localhost:3000${product.images[0].url}`
                    : "https://dummyimage.com/300x200/e5e7eb/9ca3af.png&text=No+Image"
                }
                alt={product.name}
                className={styles.image}
              />
            </div>
            <div className={styles.info}>
              <h3 className={styles.name}>{product.name}</h3>
              <p className={styles.price}>฿{product.price}</p>
              <button className={styles.btn}>หยิบใส่ตะกร้า</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
