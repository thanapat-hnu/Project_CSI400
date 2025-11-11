import { useEffect, useState } from "react";
import axios from "../../apis/axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [notebooks, setNotebooks] = useState([]);
  const [monitors, setMonitors] = useState([]);
  const [keyboards, setKeyboards] = useState([]); // ⌨️
  const [mice, setMice] = useState([]); // 🖱️
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/public/product");
        const allProducts = res.data;

        // 💻 โน้ตบุ๊ก
        const filteredNotebook = allProducts.filter(
          (p) =>
            p.category?.name?.toLowerCase().includes("โน้ต") ||
            p.category?.name?.toLowerCase().includes("notebook")
        );
        setNotebooks(filteredNotebook.slice(0, 6));

        // 🖥️ มอนิเตอร์ (id 13)
        const filteredMonitor = allProducts.filter(
          (p) => p.category?.id === 13
        );
        setMonitors(filteredMonitor.slice(0, 5));

        // ⌨️ คีย์บอร์ด (id 14)
        const filteredKeyboard = allProducts.filter(
          (p) => p.category?.id === 14
        );
        setKeyboards(filteredKeyboard.slice(0, 5));

        // 🖱️ เมาส์ (id 15)
        const filteredMouse = allProducts.filter(
          (p) => p.category?.id === 15
        );
        setMice(filteredMouse.slice(0, 5));
      } catch (err) {
        console.error("❌ Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  // ✅ ฟังก์ชันเลือกรูป
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

      {/* 💻 Notebook */}
      <section className="product-section">
        <div className="product-header">
          <h3 className="section-title">Notebook</h3>
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

      {/* 🖥️ Monitor */}
      <section className="product-section">
        <div className="product-header">
          <h3 className="section-title">Monitor</h3>
        </div>

        <div className="product-grid">
          {monitors.length > 0 ? (
            monitors.map((product) => (
              <div
                key={product.id}
                className="product-card monitor-card"
                onClick={() => navigate(`/products/${product.id}`)}
                style={{ cursor: "pointer" }}
              >
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
            <p style={{ color: "#6b7280" }}>กำลังโหลดสินค้าจอภาพ...</p>
          )}
        </div>
      </section>

      {/* ⌨️ Keyboard */}
      <section className="product-section">
        <div className="product-header">
          <h3 className="section-title">Keyboard</h3>
        </div>

        <div className="product-grid">
          {keyboards.length > 0 ? (
            keyboards.map((product) => (
              <div
                key={product.id}
                className="product-card keyboard-card"
                onClick={() => navigate(`/products/${product.id}`)}
                style={{ cursor: "pointer" }}
              >
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
            <p style={{ color: "#6b7280" }}>กำลังโหลดสินค้าแป้นพิมพ์...</p>
          )}
        </div>
      </section>

      {/* 🖱️ Mouse */}
      <section className="product-section">
        <div className="product-header">
          <h3 className="section-title">Mouse</h3>
        </div>

        <div className="product-grid">
          {mice.length > 0 ? (
            mice.map((product) => (
              <div
                key={product.id}
                className="product-card mouse-card"
                onClick={() => navigate(`/products/${product.id}`)}
                style={{ cursor: "pointer" }}
              >
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
            <p style={{ color: "#6b7280" }}>กำลังโหลดสินค้าเมาส์...</p>
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
