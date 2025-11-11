import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../apis/axios";
import styles from "./ProductDetail.module.css";
import { CartContext } from "../../context/CartContext"; // 🧩 เพิ่มสำหรับตะกร้า
import { useAuth } from "../../context/AuthContext"; // สมมติว่ามี context

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false); // ✅ สถานะหัวใจ
  const { user } = useAuth();


  // 🧭 โหลดข้อมูลสินค้า + ตรวจสถานะหัวใจ
  const { addToCart } = useContext(CartContext); // ✅ ดึงฟังก์ชันเพิ่มสินค้าในตะกร้า

  // 🧭 โหลดข้อมูลสินค้า
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/public/product/${id}`);
        setProduct(res.data);
        setSelectedImage(
          res.data.images?.[0]?.url
            ? `http://localhost:3000${res.data.images[0].url}`
            : "https://dummyimage.com/400x300/e5e7eb/9ca3af.png&text=No+Image"
        );

        // ✅ ตรวจว่าสินค้านี้อยู่ใน Wishlist แล้วหรือไม่
        const token = localStorage.getItem("token");
        if (token) {
          const wishlistRes = await axios.get("/protech/wishlist", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const found = wishlistRes.data.some(
            (item) => item.product_id === Number(id)
          );
          setIsWishlisted(found);
        }
      } catch (err) {
        console.error("❌ Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  // ❤️ Toggle wishlist
  const handleToggleWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("กรุณาเข้าสู่ระบบก่อนเพิ่มในรายการที่อยากได้ ❤️");
        return;
      }

      if (isWishlisted) {
        await axios.delete(`/protech/wishlist/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsWishlisted(false);
      } else {
        await axios.post(
          "/protech/wishlist",
          { product_id: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsWishlisted(true);
      }
    } catch (err) {
      console.error("❌ wishlist error:", err);
    }
  };

  if (!product) return <div className={styles.loading}>กำลังโหลด...</div>;

  // ✅ รวม description และ specs
  let combinedData = {};
  try {
    const descData =
      typeof product.description === "string"
        ? JSON.parse(product.description)
        : product.description;
    if (descData && typeof descData === "object") {
      combinedData = { ...combinedData, ...descData };
    }
  } catch (e) {
    combinedData.รายละเอียดสินค้า = product.description;
  }

  try {
    const specsData =
      typeof product.specs === "string"
        ? JSON.parse(product.specs)
        : product.specs;
    if (specsData && typeof specsData === "object") {
      combinedData = { ...combinedData, ...specsData };
    }
  } catch (e) { }

  // ✅ ฟังก์ชันเพิ่มสินค้าในตะกร้า
  const handleAddToCart = () => {

    if (!user) {
      return navigate("/login")
    }

    addToCart(product, quantity);
    alert(`เพิ่ม "${product.name}" จำนวน ${quantity} ชิ้นลงตะกร้าแล้ว!`);
  };

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ◀ กลับ
      </button>

      <div className={styles.detailBox}>
        {/* 📸 รูปสินค้า */}
        <div className={styles.imageSection}>
          <img
            src={selectedImage}
            alt={product.name}
            className={styles.mainImage}
          />
          <div className={styles.thumbnailRow}>
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={`http://localhost:3000${img.url}`}
                alt={`thumb-${i}`}
                className={`${styles.thumbnail} ${selectedImage === `http://localhost:3000${img.url}`
                  ? styles.activeThumb
                  : ""
                  }`}
                onClick={() =>
                  setSelectedImage(`http://localhost:3000${img.url}`)
                }
              />
            ))}
          </div>
        </div>

        {/* 💬 ข้อมูลสินค้า */}
        <div className={styles.infoSection}>
          <h2 className={styles.name}>{product.name}</h2>
          <p className={styles.category}>
            หมวดหมู่: {product.category?.name || "ไม่ระบุ"}
          </p>

          {/* ✅ ราคา + ปุ่มหัวใจ */}
          <div className={styles.priceRow}>
            <p className={styles.price}>
              ฿
              {Number(product.price).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
            <button
              className={`${styles.heartBtn} ${isWishlisted ? styles.activeHeart : ""
                }`}
              onClick={handleToggleWishlist}
            >
              {isWishlisted ? "❤️" : "🤍"}
            </button>
          </div>


          {/* 🔢 จำนวนสินค้า */}
          <div className={styles.quantityBox}>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className={styles.qtyBtn}
            >
              -
            </button>
            <span className={styles.qtyNumber}>{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className={styles.qtyBtn}
            >
              +
            </button>
          </div>

          {/* 🛒 ปุ่มตะกร้า */}
          <div className={styles.buttonRow}>
            <button className={styles.addBtn} onClick={handleAddToCart}>
              🛒 เพิ่มในตะกร้า
            </button>
            <button
              className={styles.buyBtn}
              onClick={() => alert("🛍️ ระบบซื้อสินค้ากำลังพัฒนา")}
            >
              🛍️ ซื้อเลย
            </button>
          </div>
        </div>
      </div>

      {/* 📋 รายละเอียดสินค้า */}
      <div className={styles.specSection}>
        <h3 className={styles.specTitle}>รายละเอียดสินค้า</h3>

        {Object.keys(combinedData).length > 0 ? (
          <table className={styles.specTable}>
            <tbody>
              {Object.entries(combinedData).map(([key, value]) => (
                <tr key={key}>
                  <td className={styles.specKey}>{key}</td>
                  <td className={styles.specValue}>{String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noSpec}>ไม่มีข้อมูลรายละเอียดสินค้า</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
