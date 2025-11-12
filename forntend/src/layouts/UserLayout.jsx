import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, Search } from "lucide-react";
import { useState, useContext } from "react";
import axios from "../apis/axios";
import { useAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import "./UserLayout.css";

const UserLayout = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart } = useContext(CartContext);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length === 0) {
      setResults([]);
      return;
    }

    try {
      const res = await axios.get(`/public/product/search?q=${value}`);
      setResults(res.data);
    } catch (err) {
      console.error("❌ Error searching:", err);
    }
  };

  return (
    <div className="user-layout">
      {/* 🧭 Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <NavLink to="/" className="logo">
            Logo
          </NavLink>

          {/* 🔍 Search bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="ค้นหาสินค้า..."
              value={query}
              onChange={handleSearch}
            />
            <Search className="search-icon" size={20} />

            {results.length > 0 && (
              <div className="search-results">
                {results.map((item) => (
                  <div
                    key={item.id}
                    className="search-item"
                    onClick={() => {
                      setQuery("");
                      setResults([]);
                      navigate(`/products/${item.id}`);
                    }}
                  >
                    <img
                      src={
                        item.images?.[0]?.url
                          ? `http://localhost:3000${item.images[0].url}`
                          : "https://dummyimage.com/50x50/e5e7eb/9ca3af.png&text=No+Image"
                      }
                      alt={item.name}
                      className="search-thumb"
                    />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 🔗 Menu */}
          <div className="menu">
            <NavLink to="/" end className="nav-link">
              หน้าแรก
            </NavLink>
            <NavLink to="/products" className="nav-link">
              สินค้า
            </NavLink>
            <NavLink to="/promotions" className="nav-link">
              โปรโมชั่น
            </NavLink>
            <NavLink to="/contact" className="nav-link">
              ติดต่อเรา
            </NavLink>

            {/* 🛒 ตะกร้า */}
            <NavLink to="/cart" className="nav-link cart-link">
              <ShoppingCart className="mr-1" />
              ตะกร้า
              {cart.length > 0 && (
                <span className="cart-count">({cart.length})</span>
              )}
            </NavLink>

            {/* 👤 โปรไฟล์ / เข้าสู่ระบบ */}
            {user ? (
              <NavLink to="/profile" className="nav-link">
                โปรไฟล์
              </NavLink>
            ) : (
              <NavLink to="/login" className="nav-link">
                เข้าสู่ระบบ
              </NavLink>
            )}
          </div>
        </div>
      </nav>

      {/* 📦 เนื้อหาหลัก */}
      <main className="main-content" style={{ padding: 0 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
