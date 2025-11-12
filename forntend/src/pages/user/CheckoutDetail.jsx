import { useState, useContext, useEffect } from "react";
import styles from "./CheckoutDetail.module.css";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import api from "../../apis/axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { applyCoupon, redeemCoupon } from "../../apis/couponAPI";
import { createPayment } from "../../apis/paymentAPI";

const CheckoutDetail = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useContext(CartContext);

  const [shippingMethod, setShippingMethod] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showMyCoupons, setShowMyCoupons] = useState(false);
  const [myCoupons, setMyCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  /* ──────────────── โหลดคูปอง ──────────────── */
  useEffect(() => {
    const fetchMyCoupons = async () => {
      if (!showMyCoupons) return;
      setLoadingCoupons(true);
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/protech/coupon/saved", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyCoupons(res.data.coupons || []);
      } catch (err) {
        console.error("❌ โหลดคูปองของฉันล้มเหลว:", err);
      } finally {
        setLoadingCoupons(false);
      }
    };
    fetchMyCoupons();
  }, [showMyCoupons]);

  /* ──────────────── โหลดที่อยู่ ──────────────── */
  useEffect(() => {

    const fetchAddress = async () => {
      try {
        const res = await api.get("/protech/address");
        const addrList = res.data.addresses || [];
        setAddresses(addrList);
        if (addrList.length > 0)
          setSelectedAddressId(addrList[addrList.length - 1].id);
      } catch (err) {
        console.error("❌ โหลดข้อมูลที่อยู่ล้มเหลว:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAddress();
  }, []);

  /* ──────────────── คำนวณยอดรวม ──────────────── */
  // ✅ คิด VAT 7% เพิ่มจากราคาสินค้า (ไม่รวมภาษี)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vat = subtotal * (7 / 107);
  const beforeVat = subtotal - vat;
  const total = subtotal;

  useEffect(() => {
    setFinalTotal(total - discount);
  }, [total, discount]);



  /* ──────────────── ใช้คูปอง ──────────────── */
  const handleApplyCoupon = async () => {
    if (!coupon.trim()) {
      setCouponMsg("❗ กรุณากรอกรหัสคูปอง");
      return;
    }

    try {
      const res = await applyCoupon(coupon, total);
      setDiscount(res.discount_amount);
      localStorage.setItem("appliedCouponId", res.coupon_id);
      setCouponMsg(`✅ ${res.message} ลดไป ${res.discount_amount.toFixed(2)} บาท`);
    } catch (err) {
      console.error("Coupon error:", err);
      setDiscount(0);
      setCouponMsg(err.response?.data?.message || "❌ ไม่สามารถใช้คูปองได้");
    }
  };

  /* ──────────────── ยืนยันคำสั่งซื้อ ──────────────── */
  const handleConfirm = async () => {
    const token = localStorage.getItem("token");

    const u = await api.get("/protech/cart")
    const user_id = u.data.userId;

    const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
    if (!selectedAddress) return alert("❗ กรุณาเลือกที่อยู่จัดส่ง");
    if (!paymentMethod) return alert("❗ กรุณาเลือกช่องทางชำระเงิน");

    try {
      // 🟢 Step 1: สร้างคำสั่งซื้อ
      const orderRes = await api.post(
        "/protech/order",
        {
          user_id,
          items: cart.map((i) => ({
            product_id: i.product_id,
            quantity: i.quantity,
            price: i.price,
          })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const order = orderRes.data.order;
      console.log("✅ สร้างคำสั่งซื้อ:", order);

      // 🟢 Step 2: ชำระเงิน
      await createPayment({
        order_id: order.id,
        amount: order.total_amount,
        method: paymentMethod,
        status: "success",
      });

      // 🟢 Step 3: Redeem Coupon (ถ้ามี)
      if (discount > 0 && coupon.trim()) {
        await redeemCoupon(localStorage.getItem("appliedCouponId"), order.id);
      }

      // 🟢 Step 4: ล้างตะกร้า
      await api.delete("/protech/cart/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ สั่งซื้อและชำระเงินเรียบร้อยแล้ว!");
      navigate("/user/orders");
      window.location.reload();
    } catch (err) {
      console.error("❌ Checkout Error:", err);
      alert(err.response?.data?.message || "เกิดข้อผิดพลาดในการชำระเงิน");
    }
  };

  /* ──────────────── ลบที่อยู่ ──────────────── */
  const handleDelete = async (id) => {
    if (!window.confirm("คุณต้องการลบที่อยู่นี้หรือไม่?")) return;
    try {
      await api.delete(`/protech/address/${id}`);
      setAddresses(addresses.filter((addr) => addr.id !== id));
      if (selectedAddressId === id) setSelectedAddressId(null);
    } catch (err) {
      console.error("ลบที่อยู่ล้มเหลว:", err);
      alert("❌ ไม่สามารถลบที่อยู่ได้");
    }
  };

  /* ──────────────── UI ──────────────── */
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
          {/* SECTION 1: ที่อยู่ */}
          <div className={styles.section}>
            <h3>01 ข้อมูลติดต่อและใบกำกับภาษี</h3>
            {loading ? (
              <p>⏳ กำลังโหลดที่อยู่...</p>
            ) : addresses.length === 0 ? (
              <p>❌ ยังไม่มีที่อยู่ในระบบ</p>
            ) : (
              <div className={styles.addressList}>
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`${styles.addressCard} ${selectedAddressId === addr.id ? styles.addressSelected : ""
                      }`}
                    onClick={() => setSelectedAddressId(addr.id)}
                  >
                    <div className={styles.addressLeft}>
                      <div className={styles.addrLabel}>สำหรับจัดส่ง</div>
                      <div className={styles.addrText}>
                        {addr.address_line}, {addr.city}, {addr.province}{" "}
                        {addr.postal_code}
                      </div>
                    </div>
                    <div className={styles.addressRight}>
                      <div className={styles.addrPhone}>{addr.phone}</div>
                      <div className={styles.addrActions}>
                        <FaEdit
                          className={styles.editIcon}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/profile/address/edit/${addr.id}?from=checkout`);
                          }}
                        />
                        <FaTrash
                          className={styles.deleteIcon}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(addr.id);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              className={styles.btnOutline}
              onClick={() => navigate("/profile/address/create?from=checkout")}
            >
              + เพิ่มที่อยู่
            </button>
            <label className={styles.checkbox}>
              <input type="checkbox" /> ออกใบกำกับภาษี
            </label>
          </div>

          {/* SECTION 2: การจัดส่ง */}
          <div className={styles.section}>
            <h3>02 รูปแบบการจัดส่ง</h3>
            <div className={styles.shipping}>
              <button
                className={`${styles.shippingBtn} ${shippingMethod === "normal" ? styles.activeShip : ""
                  }`}
                onClick={() => setShippingMethod("normal")}
              >
                จัดส่งปกติ
              </button>
              <button
                className={`${styles.shippingBtn} ${shippingMethod === "pickup" ? styles.activeShip : ""
                  }`}
                onClick={() => setShippingMethod("pickup")}
              >
                รับของที่สาขา
              </button>
            </div>
          </div>

          {/* SECTION 3: ช่องทางชำระเงิน */}
          <div className={styles.section}>
            <h3>03 ช่องทางชำระเงิน</h3>
            <div className={styles.paymentList}>
              {[
                "โอนผ่านบัญชี",
                "อินเทอร์เน็ตแบงก์",
                "ทรูวอลเล็ต",
                "พร้อมเพย์",
                "โอนผ่าน Pay",
              ].map((method) => (
                <label key={method} className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
          </div>

          <button className={styles.backBtn} onClick={() => navigate("/cart")}>
            กลับไปแก้ไขคำสั่งซื้อ
          </button>
        </div>

        {/* ✅ RIGHT: Order Summary */}
        <div className={styles.checkoutRight}>
          <h3>คำสั่งซื้อของคุณ</h3>
          <div className={styles.orderSummary}>
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className={styles.orderItemCompact}>
                  <img
                    src={
                      item.image_url
                        ? `http://localhost:3000${item.image_url}`
                        : "https://dummyimage.com/100x100/e5e7eb/9ca3af.png&text=No+Image"
                    }
                    alt={item.name}
                    className={styles.orderImage}
                  />
                  <div className={styles.orderInfo}>
                    <p className={styles.itemName}>
                      {item.name.length > 25
                        ? item.name.slice(0, 25) + "..."
                        : item.name}
                    </p>
                    <p className={styles.itemQty}>x{item.quantity}</p>
                  </div>
                  <div className={styles.priceGroup}>
                    <p className={styles.itemPrice}>
                      ฿{Number(item.price).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.emptyCart}>ไม่มีสินค้าในตะกร้า</p>
            )}

            {/* 🆕 เพิ่มส่วนก่อนยอดรวม */}
            <div className={styles.summaryLine}>
              <span>ค่าจัดส่ง:</span>
              <span>฿0.00</span>
            </div>
            <div className={styles.summaryLine}>
              <span>ส่วนลดทั้งหมด:</span>
              <span>
                ฿
                {discount > 0
                  ? discount.toLocaleString(undefined, { minimumFractionDigits: 2 })
                  : "0.00"}
              </span>
            </div>
            <div className={styles.summaryLine}>
              <span>ส่วนลด:</span>
              <span>฿0.00</span>
            </div>

            <hr />
            <div className={styles.summaryLine}>
              <span>ราคาก่อนภาษี:</span>
              <span>
                ฿
                {beforeVat.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className={styles.summaryLine}>
              <span>ภาษี VAT 7%:</span>
              <span>
                ฿
                {vat.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            {discount > 0 && (
              <div className={styles.summaryLine}>
                <span>ส่วนลดจากคูปอง:</span>
                <span>
                  -฿
                  {discount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            )}

            <hr />
            <div className={styles.summaryTotalBox}>
              <div>
                <strong>ยอดรวม</strong>
                <p className={styles.vatNote}>ยอดรวม (รวมภาษีมูลค่าเพิ่ม)</p>
              </div>
              <span className={styles.summaryTotalPrice}>
                ฿
                {finalTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            {/* 🟦 ช่องใส่คูปอง */}
            <div className={styles.couponBox}>
              <input
                type="text"
                placeholder="ใส่โค้ดส่วนลด"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
              />
              <button onClick={handleApplyCoupon}>ใช้โค้ดส่วนลด</button>
            </div>

            {/* 🟢 ปุ่มแสดงคูปองของฉัน */}
            <button
              className={styles.myCouponBtn}
              onClick={() => setShowMyCoupons(true)}
            >
              🎟️ แสดงคูปองของฉัน
            </button>

            {/* Modal แสดงคูปองของฉัน */}
            {showMyCoupons && (
              <div
                className={styles.modalOverlay}
                onClick={() => setShowMyCoupons(false)}
              >
                <div
                  className={styles.modalContent}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2>🎟️ คูปองของฉัน</h2>
                  {loadingCoupons ? (
                    <p>⏳ กำลังโหลด...</p>
                  ) : myCoupons.length === 0 ? (
                    <p>❌ ยังไม่มีคูปองที่เก็บไว้</p>
                  ) : (
                    <div className={styles.couponList}>
                      {myCoupons.map((coupon) => (
                        <div
                          key={coupon.id}
                          className={styles.couponCard}
                          onClick={() => {
                            setCoupon(coupon.code);
                            setShowMyCoupons(false);
                          }}
                        >
                          <h4>{coupon.code}</h4>
                          <p>
                            ส่วนลด{" "}
                            {coupon.type === "percent"
                              ? `${coupon.value}%`
                              : `${Number(coupon.value).toFixed(2)} บาท`}
                          </p>
                          <p>
                            ขั้นต่ำ {coupon.min_order_amount || 0} บาท | หมดอายุ{" "}
                            {coupon.expire_date
                              ? new Date(coupon.expire_date).toLocaleDateString("th-TH")
                              : "-"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    className={styles.closeBtn}
                    onClick={() => setShowMyCoupons(false)}
                  >
                    ปิด
                  </button>
                </div>
              </div>
            )}

            {couponMsg && (
              <p
                style={{
                  color: couponMsg.includes("✅") ? "green" : "red",
                  marginTop: "0.5rem",
                  fontSize: "0.9rem",
                }}
              >
                {couponMsg}
              </p>
            )}

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
