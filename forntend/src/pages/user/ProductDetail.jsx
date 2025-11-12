import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../apis/axios";
import styles from "./ProductDetail.module.css";
import { CartContext } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2"; // ✅ เพิ่ม SweetAlert2

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { user } = useAuth();
  const { addToCart } = useContext(CartContext);

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
        Swal.fire({
          icon: "warning",
          title: "กรุณาเข้าสู่ระบบก่อน",
          text: "เพื่อเพิ่มสินค้าในรายการที่อยากได้ ❤️",
          confirmButtonColor: "#ef4444",
        });
        return;
      }

      if (isWishlisted) {
        await axios.delete(`/protech/wishlist/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsWishlisted(false);
        Swal.fire({
          icon: "info",
          title: "ลบออกจาก Wishlist แล้ว",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await axios.post(
          "/protech/wishlist",
          { product_id: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsWishlisted(true);
        Swal.fire({
          icon: "success",
          title: "เพิ่มใน สินค้าที่ถูกใจ สำเร็จ ❤️",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (err) {
      console.error("❌ wishlist error:", err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถอัปเดต Wishlist ได้",
      });
    }
  };

  if (!product) return <div className={styles.loading}>กำลังโหลด...</div>;

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

  // ✅ เพิ่ม SweetAlert2 ตอนเพิ่มสินค้าลงตะกร้า
  const handleAddToCart = () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเข้าสู่ระบบก่อน",
        text: "เพื่อเพิ่มสินค้าลงในตะกร้า 🛒",
        confirmButtonColor: "#ef4444",
      }).then(() => navigate("/login"));
      return;
    }

    // ✅ จำกัด quantity ไม่ต่ำกว่า 1 และไม่เกิน 5
    const finalQuantity = Math.min(5, Math.max(1, quantity));

    addToCart(product, finalQuantity);

    Swal.fire({
      icon: "success",
      title: "เพิ่มสินค้าลงตะกร้าแล้ว!",
      text: `"${product.name}" จำนวน ${finalQuantity} ชิ้น`,
      showConfirmButton: false,
      timer: 1600,
    });
  };


  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ◀ กลับ
      </button>

      <div className={styles.detailBox}>
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

        <div className={styles.infoSection}>
          <h2 className={styles.name}>{product.name}</h2>
          <p className={styles.category}>
            หมวดหมู่: {product.category?.name || "ไม่ระบุ"}
          </p>

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

          <div className={styles.quantityBox}>
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className={styles.qtyBtn}
            >
              -
            </button>
            <span className={styles.qtyNumber}>{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => Math.min(5, prev + 1))}
              className={styles.qtyBtn}
            >
              +
            </button>
          </div>

          <div className={styles.buttonRow}>
            <button className={styles.addBtn} onClick={handleAddToCart}>
              🛒 เพิ่มในตะกร้า
            </button>
            <button
              className={styles.buyBtn}
              onClick={() => {
                if (!user) {
                  Swal.fire({
                    icon: "warning",
                    title: "กรุณาเข้าสู่ระบบก่อน",
                    text: "เพื่อซื้อสินค้าหรือเพิ่มสินค้าลงตะกร้า 🛒",
                    confirmButtonColor: "#ef4444",
                  }).then(() => navigate("/login"));
                  return;
                }

                // ✅ จำกัด quantity
                const finalQuantity = Math.min(5, Math.max(1, quantity));
                addToCart(product, finalQuantity);

                Swal.fire({
                  icon: "success",
                  title: "เพิ่มสินค้าลงตะกร้าเรียบร้อย!",
                  text: `"${product.name}" จำนวน ${finalQuantity} ชิ้น`,
                  showConfirmButton: false,
                  timer: 1600,
                }).then(() => navigate("/checkout/detail"));
              }}
            >
              🛍️ ซื้อเลย
            </button>
          </div>
        </div>
      </div>

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
