import { useParams } from "react-router-dom";
import styles from "./ProductDetail.module.css";

const ProductDetail = () => {
  const { id } = useParams(); // ดึง id จาก URL เช่น /products/1

  // ✅ mock ข้อมูลสินค้าตัวอย่าง (ทีหลังดึงจาก DB ได้)
  const product = {
    id,
    name: "Intel Core i9-13900K",
    price: 25900,
    img: "https://placehold.co/400x300?text=Intel+Core+i9",
    description:
      "CPU รุ่นท็อปจาก Intel ที่มาพร้อมประสิทธิภาพสูงสุดสำหรับเกมเมอร์และนักสร้างคอนเทนต์",
  };

  return (
    <div className={styles.detailContainer}>
      <div className={styles.imageSection}>
        <img src={product.img} alt={product.name} />
      </div>

      <div className={styles.infoSection}>
        <h2>{product.name}</h2>
        <p className={styles.price}>฿{product.price.toLocaleString()}</p>
        <p className={styles.description}>{product.description}</p>
        <button className={styles.addCartBtn}>หยิบใส่ตะกร้า</button>
      </div>
    </div>
  );
};

export default ProductDetail;
