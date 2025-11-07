import { ShoppingCart, Search, Cpu, Monitor, HardDrive, Headphones } from "lucide-react";
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

      {/* 💻 หมวดหมู่สินค้า + 🏆 สินค้ายอดนิยม (แนวนอน) */}
      <section className="main-content">
        {/* หมวดหมู่สินค้า */}
        <div className="category-section">
          <h3 className="section-title">หมวดหมู่สินค้า</h3>
          <div className="category-grid">
            {[
              { name: "CPU", icon: Cpu },
              { name: "Mainboard", icon: HardDrive },
              { name: "Monitor", icon: Monitor },
              { name: "อุปกรณ์เสริม", icon: Headphones },
            ].map((cat, index) => (
              <div key={index} className="category-card">
                <cat.icon size={40} className="category-icon" />
                <p className="category-name">{cat.name}</p>
                <button className="category-btn">ดูเพิ่มเติม</button>
              </div>
            ))}
          </div>
        </div>

        {/* สินค้ายอดนิยม */}
        <div className="product-section">
          <h3 className="section-title">สินค้ายอดนิยม</h3>
          <div className="product-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
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