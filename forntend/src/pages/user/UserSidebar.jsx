import { NavLink } from "react-router-dom";
import styles from "./UserSidebar.module.css";
import {
  FaShoppingBag,
  FaHeart,
  FaUser,
  FaMapMarkerAlt,
  FaFileInvoice,
  FaCreditCard,
  FaGift, // ✅ เพิ่มไอคอนสำหรับคูปอง
} from "react-icons/fa";

const UserSidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.menuTitle}>รายการ</h3>
      <ul>
        <li>
          <NavLink
            to="/user/orders"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            <FaShoppingBag className={styles.icon} />
            คำสั่งซื้อ
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/profile/wishlist"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
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
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            <FaUser className={styles.icon} />
            ข้อมูลส่วนตัว
          </NavLink>
        </li>

        {/* ✅ เมนูใหม่ “คูปองของฉัน” */}
        <li>
          <NavLink
            to="/profile/mycoupons"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            <FaGift className={styles.icon} />
            คูปองของฉัน
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/profile/address"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            <FaMapMarkerAlt className={styles.icon} />
            ที่อยู่สำหรับจัดส่ง
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/user/invoice-address"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            <FaFileInvoice className={styles.icon} />
            ที่อยู่สำหรับออกใบกำกับภาษี
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/user/payment"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
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
