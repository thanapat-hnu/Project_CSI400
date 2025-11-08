import {
  Cpu,
  HardDrive,
  Monitor,
  Headphones,
  ShoppingCart,
  Laptop,
  Keyboard,
  Mouse,
  Box,
  Database,
  Battery,
  Fan,
} from "lucide-react";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">
      {/* 🎆 Hero Section */}
      <section className="hero-section">
        <h2>ศูนย์รวมอุปกรณ์คอมพิวเตอร์ครบวงจร</h2>
        <p>สินค้าคุณภาพ ราคาคุ้มค่า พร้อมบริการจัดส่งทั่วประเทศ</p>
        <button className="hero-btn">เริ่มช้อปเลย</button>
      </section>
      {/* 🏆 สินค้ายอดนิยม */}
      <section className="product-section">
        <div className="product-header">
          <h3 className="section-title">สินค้ายอดนิยม</h3>
          <a href="#" className="view-all">
            ดูทั้งหมด ▶
          </a>
        </div>

        <div className="product-grid">
          {[1, 2, 3, 4, 5, 6].map((p) => (
            <div key={p} className="product-card">
              <img
                src={`https://placehold.co/250x160?text=Product+${p}`}
                alt={`Product ${p}`}
                className="product-img"
              />
              <h4 className="product-name">Gaming Gear #{p}</h4>
              <p className="product-price">฿{p * 2500}</p>
              <button className="add-cart-btn">หยิบใส่ตะกร้า</button>
            </div>
          ))}
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
