import { useState, useContext } from "react";
import styles from "./CheckoutDetail.module.css";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext"; // ✅ ดึง Context

const CheckoutDetail = () => {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext); // ✅ ใช้ข้อมูลจากตะกร้า
  const [shippingMethod, setShippingMethod] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [coupon, setCoupon] = useState("");

  // ✅ คำนวณยอดรวม
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vat = subtotal * 0.07;
  const total = subtotal + vat;

  const handleConfirm = () => {
    alert("ยืนยันคำสั่งซื้อเรียบร้อย ✅");
  };

  return (
    <div className={styles.checkoutWrapper}>
      {/* 🔴 Step Indicator */}
      <div className={styles.stepIndicator}>
        <div className={`${styles.step} ${styles.active}`}>1. ตะกร้าสินค้า</div>
        <div className={styles.stepLine}></div>
        <div className={`${styles.step} ${styles.active}`}>2. รายละเอียด</div>
        <div className={styles.stepLine}></div>
        <div className={styles.step}>3. ชำระเงิน</div>
      </div>

      <div className={styles.checkoutContainer}>
        {/* ✅ LEFT */}
        <div className={styles.checkoutLeft}>
          {/* SECTION 1 */}
          <div className={styles.section}>
            <h3>01 ข้อมูลติดต่อและใบกำกับภาษี</h3>
            <div className={styles.card}>
              <p>ที่อยู่ในการจัดส่ง</p>
              <button className={styles.btnOutline}>+ เพิ่มที่อยู่</button>
            </div>
            <label className={styles.checkbox}>
              <input type="checkbox" /> ออกใบกำกับภาษี
            </label>
          </div>

          {/* SECTION 2 */}
          <div className={styles.section}>
            <h3>02 รูปแบบการจัดส่ง</h3>
            <div className={styles.shipping}>
              <button
                className={`${styles.shippingBtn} ${
                  shippingMethod === "normal" ? styles.activeShip : ""
                }`}
                onClick={() => setShippingMethod("normal")}
              >
                จัดส่งปกติ
              </button>
              <button
                className={`${styles.shippingBtn} ${
                  shippingMethod === "pickup" ? styles.activeShip : ""
                }`}
                onClick={() => setShippingMethod("pickup")}
              >
                รับของที่สาขา
              </button>
            </div>
          </div>

          {/* SECTION 3 */}
          <div className={styles.section}>
            <h3>03 ช่องทางชำระเงิน</h3>
            <div className={styles.paymentList}>
              {["โอนผ่านบัญชี", "อินเทอร์เน็ตแบงก์", "ทรูวอลเล็ต", "พร้อมเพย์", "โอนผ่าน Pay"].map(
                (method) => (
                  <label key={method} className={styles.paymentOption}>
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>{method}</span>
                  </label>
                )
              )}
            </div>
          </div>

          <button className={styles.backBtn} onClick={() => navigate("/cart")}>
            กลับไปแก้ไขคำสั่งซื้อ
          </button>
        </div>

        {/* ✅ RIGHT */}
        <div className={styles.checkoutRight}>
          <h3>คำสั่งซื้อของคุณ</h3>

          <div className={styles.orderSummary}>
            {/* 🔹 สินค้าจากตะกร้าจริง */}
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className={styles.orderItemCompact}>
                  <img
                    src={
                      item.images?.[0]?.url
                        ? `http://localhost:3000${item.images[0].url}`
                        : "https://dummyimage.com/100x100/e5e7eb/9ca3af.png&text=No+Image"
                    }
                    alt={item.name}
                  />
                  <div className={styles.orderInfo}>
                    <p className={styles.itemName}>
                      {item.name.length > 25 ? item.name.slice(0, 25) + "..." : item.name}
                    </p>
                    <p className={styles.itemQty}>x{item.quantity}</p>
                  </div>
                  <div className={styles.priceGroup}>
                    <p className={styles.itemPrice}>
                      ฿{Number(item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.emptyCart}>ไม่มีสินค้าในตะกร้า</p>
            )}

            <hr />

            <h3 className={styles.summaryTitle}>ยอดรวมทั้งหมด</h3>
            <div className={styles.summaryLine}>
              <span>ค่าจัดส่ง:</span>
              <span>฿0.00</span>
            </div>
            <div className={styles.summaryLine}>
              <span>ราคาก่อนภาษี:</span>
              <span>
                ฿{(subtotal - vat).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className={styles.summaryLine}>
              <span>ภาษี VAT 7%:</span>
              <span>฿{vat.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={styles.summaryLine}>
              <span>ส่วนลดทั้งหมด:</span>
              <span>฿0.00</span>
            </div>
            <div className={styles.summaryLine}>
              <span>ส่วนลด:</span>
              <span>฿0.00</span>
            </div>

            <hr />

            <div className={styles.summaryTotalBox}>
              <div>
                <strong>ยอดรวม</strong>
                <p className={styles.vatNote}>ยอดรวม (รวมภาษีมูลค่าเพิ่ม)</p>
              </div>
              <span className={styles.summaryTotalPrice}>
                ฿{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className={styles.couponBox}>
              <input
                type="text"
                placeholder="ใส่โค้ดส่วนลด"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button>ใช้โค้ดส่วนลด</button>
            </div>

            <button className={styles.confirmBtn} onClick={handleConfirm}>
              ยืนยันคำสั่งซื้อ
            </button>

            <div className={styles.infoList}>
              <div>🚚 ส่งฟรีทั่วไทย เมื่อสั่งครบ 5,000 บาทขึ้นไป</div>
              <div>💳 ผ่อนชำระสูงสุด 10 เดือน</div>
              <div>🎁 รับของที่ร้านลดเพิ่ม 1000.-</div>
              <div>🔁 เปลี่ยนคืนง่ายใน 7 วัน</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDetail;
