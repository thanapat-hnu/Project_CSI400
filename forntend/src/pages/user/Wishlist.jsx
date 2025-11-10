import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../apis/axios";
import UserSidebar from "./UserSidebar";
import styles from "./UserPage.module.css";
import { FaHeart, FaTrashAlt, FaEye } from "react-icons/fa";

export const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // 🧭 โหลด Wishlist เมื่อเข้าเพจ
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get("/protech/wishlist");
        console.log("📦 Wishlist Data:", res.data);
        console.log("📦 Price Type:", typeof res.data?.[0]?.product?.price);
        setWishlist(res.data || []);
      } catch (err) {
        console.error("❌ โหลด wishlist ล้มเหลว:", err);
        setErrorMsg("เกิดข้อผิดพลาดในการโหลดสินค้าที่ถูกใจ");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  // 🗑️ ฟังก์ชันลบสินค้าออกจาก Wishlist
  const handleRemove = async (product_id) => {
    if (!window.confirm("คุณต้องการลบสินค้านี้ออกจากรายการที่ถูกใจหรือไม่?")) return;

    try {
      await api.delete(`/protech/wishlist/${product_id}`);
      setWishlist((prev) => prev.filter((item) => item.product?.id !== product_id));
    } catch (err) {
      console.error("❌ ลบ wishlist ล้มเหลว:", err);
      alert("ไม่สามารถลบสินค้าได้");
    }
  };

  if (loading) return <p>⏳ กำลังโหลดข้อมูล...</p>;

  return (
    <div className={styles.container}>
      <UserSidebar />

      <div className={styles.content}>
        {/* หัวข้อ */}
        <div className={styles.header}>
          <h1>
            <FaHeart className={styles.iconHeart} /> สินค้าที่ถูกใจ
          </h1>
        </div>

        {errorMsg && <p className={styles.error}>{errorMsg}</p>}

        {wishlist.length === 0 ? (
          <div className={styles.emptyBox}>
            <FaHeart className={styles.emptyIcon} />
            <p>ยังไม่มีสินค้าที่ถูกใจในตอนนี้</p>
          </div>
        ) : (
          <div className={styles.favoriteGrid}>
            {wishlist.map((item) => {
              const product = item.product;
              const imageUrl = product?.images?.[0]?.url
                ? product.images[0].url.startsWith("http")
                  ? product.images[0].url
                  : `http://localhost:3000${product.images[0].url}`
                : "https://dummyimage.com/300x300/e5e7eb/9ca3af.png&text=No+Image";

              // ✅ แปลงราคาเป็น number ก่อน format
              const priceNumber = Number(product?.price) || 0;

              return (
                <div key={product?.id || item.id} className={styles.favoriteCard}>
                  <img
                    src={imageUrl}
                    alt={product?.name || "สินค้า"}
                    className={styles.favoriteImg}
                  />
                  <div className={styles.favoriteInfo}>
                    <h3>{product?.name}</h3>
                    <p className={styles.price}>
                      {priceNumber > 0
                        ? `${priceNumber.toLocaleString("th-TH", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })} บาท`
                        : "- บาท"}
                    </p>

                    <div className={styles.buttonGroup}>
                      <button
                        onClick={() => navigate(`/products/${product.id}`)}
                        className={styles.viewBtn}
                      >
                        <FaEye /> ดูสินค้า
                      </button>
                      <button
                        onClick={() => handleRemove(product.id)}
                        className={styles.removeBtn}
                      >
                        <FaTrashAlt /> ลบออก
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
    