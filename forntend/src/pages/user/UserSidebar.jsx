import { NavLink, useLocation } from "react-router-dom";
import styles from "./UserSidebar.module.css";
import {
  FaShoppingBag,
  FaHeart,
  FaUser,
  FaMapMarkerAlt,
  FaFileInvoice,
  FaCreditCard,
  FaGift,
} from "react-icons/fa";

const UserSidebar = () => {
  const location = useLocation(); // ดึง path ปัจจุบัน

  // ฟังก์ชันช่วยตรวจสอบ active แบบกำหนดเอง
  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.menuTitle}>รายการ</h3>
      <ul>
        <li>
          <NavLink
            to="/user/orders"
            className={`${styles.link} ${isActivePath("/user/orders") ? styles.active : ""
              }`}
          >
            <FaShoppingBag className={styles.icon} />
            คำสั่งซื้อ
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/profile/wishlist"
            className={`${styles.link} ${isActivePath("/profile/wishlist") ? styles.active : ""
              }`}
          >
            <FaHeart className={styles.icon} />
            สินค้าที่ถูกใจ
          </NavLink>
        </li>
      </ul>

      <h3 className={styles.menuTitle}>บัญชี</h3>
      <ul>
        <li>
          <NavLink
            to="/profile"
            end  // ✅ ทำให้ active เฉพาะ /profile เท่านั้น
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}
          >
            <FaUser className={styles.icon} />
            ข้อมูลส่วนตัว
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/profile/mycoupons"
            className={`${styles.link} ${isActivePath("/profile/mycoupons") ? styles.active : ""
              }`}
          >
            <FaGift className={styles.icon} />
            คูปองของฉัน
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/profile/address"
            className={`${styles.link} ${isActivePath("/profile/address") ? styles.active : ""
              }`}
          >
            <FaMapMarkerAlt className={styles.icon} />
            ที่อยู่สำหรับจัดส่ง
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/user/invoice-address"
            className={`${styles.link} ${isActivePath("/user/invoice-address") ? styles.active : ""
              }`}
          >
            <FaFileInvoice className={styles.icon} />
            ที่อยู่สำหรับออกใบกำกับภาษี
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/user/payment"
            className={`${styles.link} ${isActivePath("/user/payment") ? styles.active : ""
              }`}
          >
            <FaCreditCard className={styles.icon} />
            ช่องทางชำระเงิน
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default UserSidebar;
