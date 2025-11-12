import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./ReceiptInvoice.module.css";
import UserSidebar from "./UserSidebar";
import { FaPrint, FaArrowLeft } from "react-icons/fa"; // ✅ เพิ่มไอคอน

const ReceiptInvoice = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  // Mock order
  const mockOrders = [
    {
      id: "59",
      date: "2025-11-10",
      buyer: {
        name: "นายกรนพ ศรีสวัสดิ์",
        address: "123 ถนนงามวงศ์วาน แขวงงามวงศ์วาน เขตนนทบุรี กรุงเทพมหานคร 10230",
        phone: "0812322222",
        taxId: "1092300098712",
      },
      items: [
        { name: "ASUS TUF Gaming F15", qty: 1, price: 29900 },
        { name: "Logitech G Pro Mouse", qty: 1, price: 6000 },
      ],
    },
  ];

  useEffect(() => {
    const found = mockOrders.find((o) => o.id === orderId);
    setOrder(found);
  }, [orderId]);

  if (!order)
    return (
      <div className={styles.invoicePage}>
        <UserSidebar />
        <div className={styles.invoiceContainer}>
          <h2>ไม่พบคำสั่งซื้อเลขที่ {orderId}</h2>
          <button onClick={() => navigate("/user/orders")} className={styles.backBtn}>
            กลับไปหน้าคำสั่งซื้อ
          </button>
        </div>
      </div>
    );

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const vat = subtotal * 0.07;
  const total = subtotal + vat;

  return (
    <div className={styles.invoicePage}>
      <UserSidebar />

      <div className={styles.invoiceContainer}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoArea}>
            <h1 style={{ color: "red"}}>LOGO</h1>
          </div>

          <div className={styles.titleArea}>
            <h2>ใบเสร็จรับเงิน / ใบกำกับภาษี</h2>
            <p>
              วันที่ <span>{order.date}</span> &nbsp; | &nbsp; เลขที่{" "}
              <span>{order.id}</span>
            </p>

            {/* ✅ ปุ่มพิมพ์ใบเสร็จ */}
            <button className={styles.printBtn} onClick={() => window.print()}>
              <FaPrint /> พิมพ์ใบเสร็จ
            </button>
          </div>
        </div>

        {/* Seller Info */}
        <div className={styles.infoSection}>
          <p>
            <strong>ชื่อผู้ขาย :</strong> บริษัท Moss Tech Solution จำกัด
          </p>
          <p>
            <strong>ที่อยู่ :</strong> 88 ถนนลาดพร้าว เขตจตุจักร กรุงเทพมหานคร 10900
          </p>
          <p>
            <strong>เลขประจำตัวผู้เสียภาษี :</strong> 1234567890123 &nbsp; | &nbsp;{" "}
            <strong>โทรศัพท์ :</strong> 0999999999
          </p>
        </div>

        {/* Buyer Info */}
        <div className={styles.infoSection}>
          <p>
            <strong>ชื่อผู้ซื้อ :</strong> {order.buyer.name}
          </p>
          <p>
            <strong>ที่อยู่ :</strong> {order.buyer.address}
          </p>
          <p>
            <strong>เลขประจำตัวผู้เสียภาษี :</strong> {order.buyer.taxId} &nbsp; | &nbsp;{" "}
            <strong>โทรศัพท์ :</strong> {order.buyer.phone}
          </p>
        </div>

        {/* Items Table */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>รายการ</th>
              <th>จำนวน</th>
              <th>หน่วยละ</th>
              <th>จำนวนเงิน</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>{item.price.toLocaleString()}</td>
                <td>{(item.price * item.qty).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className={styles.summary}>
          <p>
            <span>มูลค่ารวมก่อนเสียภาษี</span>
            <span>{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </p>
          <p>
            <span>ภาษีมูลค่าเพิ่ม (VAT 7%)</span>
            <span>{vat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </p>
          <p className={styles.total}>
            <span>ยอดรวม</span>
            <span>{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </p>
        </div>

        <div className={styles.footer}>
          <p>ขอบคุณที่ใช้บริการ 🙏</p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptInvoice;
