import { Outlet, Link } from "react-router-dom";
import { ShoppingCart, Search } from "lucide-react";
import "./UserLayout.css"; // จะใส่ CSS แยกไฟล์ก็ได้

const UserLayout = () => {
  return (
    <div className="user-layout">
      {/* 🧭 Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="logo">
            MossPC
          </Link>

          {/* Search */}
          <div className="search-bar">
            <input type="text" placeholder="ค้นหาสินค้า..." />
            <Search className="search-icon" size={20} />
          </div>

          {/* Menu */}
          <div className="menu">
            <Link to="/">หน้าแรก</Link>
            <Link to="/products">สินค้า</Link>
            <Link to="/promotions">โปรโมชั่น</Link>
            <Link to="/contact">ติดต่อเรา</Link>
            <Link to="/cart" className="cart-link">
              <ShoppingCart className="mr-1" /> ตะกร้า
            </Link>
          </div>
        </div>
      </nav>

      {/* 🔽 แสดงเนื้อหาหน้าอื่น ๆ */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
