import { useEffect, useState } from "react";
import axios from "../../apis/axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [notebooks, setNotebooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotebooks = async () => {
      try {
        const res = await axios.get("/public/product");
        const allProducts = res.data;

        // 🔍 กรองเฉพาะสินค้าที่หมวดชื่อ "โน้ตบุ๊ก" หรือ "Notebook"
        const filtered = allProducts.filter(
          (p) =>
            p.category?.name?.toLowerCase().includes("โน้ต") ||
            p.category?.name?.toLowerCase().includes("notebook")
        );

        setNotebooks(filtered.slice(0, 6)); // เอาแค่ 6 ชิ้น
      } catch (err) {
        console.error("❌ Error fetching notebooks:", err);
      }
    };

    fetchNotebooks();
  }, []);

  // 🔧 ฟังก์ชันช่วยเลือก URL รูปให้แสดงได้แน่ๆ
  const getImageUrl = (product) => {
    if (!product.images || product.images.length === 0)
      return "https://placehold.co/250x160?text=No+Image";

    const img = product.images[0];
    const url =
      img.url || img.image_url || img.path || img.filename || img.filepath;

    if (!url) return "https://placehold.co/250x160?text=No+Image";

    return url.startsWith("http") ? url : `http://localhost:3000${url}`;
  };

  return (
    <div className="home-page">
      {/* 🎆 Hero Section */}
      <section className="hero-section">
        <h2>ศูนย์รวมอุปกรณ์คอมพิวเตอร์ครบวงจร</h2>
        <p>สินค้าคุณภาพ ราคาคุ้มค่า พร้อมบริการจัดส่งทั่วประเทศ</p>
        <button className="hero-btn">เริ่มช้อปเลย</button>
      </section>

      {/* 💻 โซนสินค้าโน้ตบุ๊ก (ดึงจาก DB จริง) */}
      <section className="product-section">
        <div className="product-header">
          <h3 className="section-title">Notebook</h3>
          <a href="#" className="view-all">
            ดูทั้งหมด ▶
          </a>
        </div>

        <div className="product-grid">
          {notebooks.length > 0 ? (
            notebooks.map((product) => (
              <div
                key={product.id}
                className="product-card notebook-card"
                onClick={() => navigate(`/products/${product.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="discount-badge">ลดพิเศษ</div>
                <img
                  src={getImageUrl(product)}
                  alt={product.name}
                  className="product-img"
                />
                <h4 className="product-name">{product.name}</h4>
                <p className="product-spec">
                  {product.description
                    ? product.description.slice(0, 60) + "..."
                    : "-"}
                </p>
                <p className="product-price">
                  ฿
                  {Number(product.price).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            ))
          ) : (
            <p style={{ color: "#6b7280" }}>กำลังโหลดสินค้าโน้ตบุ๊ก...</p>
          )}
        </div>
      </section>

      {/* ⚙️ Footer */}
      <footer className="footer">
        <p>© 2025 MossPC. All Rights Reserved.</p>
        <p className="footer-contact">
          ติดต่อเรา: mosspc@example.com | โทร: 02-123-4567
        </p>
      </footer>
    </div>
  );
};

export default Home;
