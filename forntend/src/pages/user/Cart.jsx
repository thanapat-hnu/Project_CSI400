// import { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { CartContext } from "../../context/CartContext";
// import styles from "./Cart.module.css";

// const Cart = () => {
//   const { cart, setCart, addToCart, removeCartItem, clearCart, loading } = useContext(CartContext);
//   const navigate = useNavigate();

//   const [total, setTotal] = useState(0);

//   useEffect(() => {
//     const calcTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
//     setTotal(calcTotal);
//   }, [cart]);

//   if (loading) return <p>⏳ กำลังโหลดข้อมูลตะกร้า...</p>;

//   return (
//     <div className={styles.cartWrapper}>
//       <div className={styles.cartContainer}>
//         {/* 🧭 Step Indicator */}
//         <div className={styles.stepIndicator}>
//           <div className={`${styles.step} ${styles.active}`}>1. ตะกร้าสินค้า</div>
//           <div className={styles.stepLine}></div>
//           <div className={styles.step}>2. รายละเอียด</div>
//           <div className={styles.stepLine}></div>
//           <div className={styles.step}>3. ชำระเงิน</div>
//         </div>

//         {/* 🛒 เนื้อหาหลัก */}
//         <div className={styles.cartMain}>
//           {/* 🔹 ส่วนซ้าย - รายการสินค้า */}
//           <div className={styles.cartLeft}>
//             {cart.length === 0 ? (
//               <p className={styles.emptyCart}>ยังไม่มีสินค้าในตะกร้า</p>
//             ) : (
//               <div className={styles.cartItems}>
//                 {cart.map((item) => (
//                   <div key={item.id} className={styles.cartCard}>
//                     <div className={styles.cartInfo}>
//                       <img
//                         src={
//                           item.images?.[0]?.url
//                             ? `http://localhost:3000${item.images[0].url}`
//                             : "https://dummyimage.com/100x100/e5e7eb/9ca3af.png&text=No+Image"
//                         }
//                         alt={item.name}
//                         className={styles.cartImage}
//                       />

//                       <div className={styles.cartDetails}>
//                         <div className={styles.cartHeader}>
//                           <h3 className={styles.cartName}>{item.name}</h3>
//                           <p className={styles.cartPrice}>
//                             ฿{Number(item.price).toLocaleString(undefined, {
//                               minimumFractionDigits: 2,
//                             })}
//                           </p>
//                         </div>

//                         <div className={styles.cartControls}>
//                           <button
//                             className={styles.qtyBtn}
//                             onClick={() => {
//                               if (item.quantity > 1) {
//                                 addToCart(item, item.quantity - 1); // 🔄 อัปเดต backend
//                               }
//                             }}
//                           >
//                             −
//                           </button>

//                           <input
//                             type="number"
//                             min="1"
//                             value={item.quantity}
//                             readOnly
//                             className={styles.qtyInput}
//                           />

//                           <button
//                             className={styles.qtyBtn}
//                             onClick={() => addToCart(item, item.quantity + 1)} // ✅ เพิ่มจำนวนใน backend
//                           >
//                             +
//                           </button>

//                           <button
//                             className={styles.removeBtnInline}
//                             onClick={() => removeCartItem(item.product_id)} // ✅ ลบใน backend
//                           >
//                             ลบ
//                           </button>
//                         </div>

//                         <p className={styles.cartTotal}>
//                           รวม: ฿{(item.price * item.quantity).toLocaleString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* 🔹 ส่วนขวา - สรุปรวม */}
//           <div className={styles.cartSummaryBox}>
//             <h3>ยอดรวมทั้งหมด</h3>

//             <div className={styles.summaryLine}>
//               <span>ค่าจัดส่ง:</span>
//               <span>฿0.00</span>
//             </div>

//             <div className={styles.summaryLine}>
//               <span>ราคาก่อนภาษี:</span>
//               <span>
//                 ฿{(total * 0.937).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//               </span>
//             </div>

//             <div className={styles.summaryLine}>
//               <span>ภาษี VAT 7%:</span>
//               <span>
//                 ฿{(total * 0.07).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//               </span>
//             </div>

//             <div className={styles.summaryLine}>
//               <span>ส่วนลดทั้งหมด:</span>
//               <span>฿0.00</span>
//             </div>

//             <div className={styles.summaryLine}>
//               <span>ส่วนลด:</span>
//               <span>฿0.00</span>
//             </div>

//             <hr />

//             <div className={styles.summaryTotal}>
//               <div>
//                 <strong>ยอดรวม</strong>
//                 <p className={styles.vatNote}>ยอดรวม (รวมภาษีมูลค่าเพิ่ม)</p>
//               </div>
//               <span className={styles.summaryTotalPrice}>
//                 ฿{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
//               </span>
//             </div>

//             <button
//               className={styles.checkoutBtnFull}
//               onClick={() => navigate("/checkout/detail")}
//             >
//               ดำเนินการต่อ
//             </button>

//             <div className={styles.extraInfo}>
//               <div>🚚 ส่งฟรีทั่วไทย<br />ช้อปครบ 5,000 บาทขึ้นไป</div>
//               <div>💳 ผ่อนสูงสุด 10 เดือน<br />ผ่อนได้เลย เพียงแค่มีบัตรเครดิต</div>
//               <div>🎁 รับของที่ร้านลด 1000.-<br />เฉพาะคอมพิวเตอร์ประกอบ</div>
//               <div>🔁 เปลี่ยนคืนง่ายภายใน 7 วัน<br /><small>*เงื่อนไขเป็นไปตามบริษัทกำหนด</small></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import styles from "./Cart.module.css";

const Cart = () => {
    const { cart, updateCartItem, removeCartItem, clearCart, loading } = useContext(CartContext);
    const navigate = useNavigate();
    const [total, setTotal] = useState(0);

    // 🧮 คำนวณยอดรวม
    useEffect(() => {
        const calcTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotal(calcTotal);
    }, [cart]);

    if (loading) return <p>⏳ กำลังโหลดข้อมูลตะกร้า...</p>;

    return (
        <div className={styles.cartWrapper}>
            <div className={styles.cartContainer}>
                {/* 🧭 Step Indicator */}
                <div className={styles.stepIndicator}>
                    <div className={`${styles.step} ${styles.active}`}>1. ตะกร้าสินค้า</div>
                    <div className={styles.stepLine}></div>
                    <div className={styles.step}>2. รายละเอียด</div>
                    <div className={styles.stepLine}></div>
                    <div className={styles.step}>3. ชำระเงิน</div>
                </div>

                {/* 🛒 เนื้อหาหลัก */}
                <div className={styles.cartMain}>
                    {/* 🔹 ส่วนซ้าย - รายการสินค้า */}
                    <div className={styles.cartLeft}>
                        {cart.length === 0 ? (
                            <p className={styles.emptyCart}>ยังไม่มีสินค้าในตะกร้า</p>
                        ) : (
                            <div className={styles.cartItems}>
                                {cart.map((item) => (
                                    <div key={item.product_id} className={styles.cartCard}>
                                        <div className={styles.cartInfo}>
                                            <img
                                                src={
                                                    item.image_url
                                                        ? `http://localhost:3000${item.image_url}`
                                                        : "https://dummyimage.com/100x100/e5e7eb/9ca3af.png&text=No+Image"
                                                }
                                                alt={item.name}
                                                className={styles.cartImage}
                                            />

                                            <div className={styles.cartDetails}>
                                                <div className={styles.cartHeader}>
                                                    <h3 className={styles.cartName}>{item.name}</h3>
                                                    <p className={styles.cartPrice}>
                                                        ฿{Number(item.price).toLocaleString(undefined, {
                                                            minimumFractionDigits: 2,
                                                        })}
                                                    </p>
                                                </div>

                                                <div className={styles.cartControls}>
                                                    {/* 🔽 ลดจำนวน */}
                                                    <button
                                                        className={styles.qtyBtn}
                                                        onClick={() => {
                                                            if (item.quantity > 1) {
                                                                updateCartItem(item.product_id, item.quantity - 1);
                                                            }
                                                        }}
                                                    >
                                                        −
                                                    </button>

                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        readOnly
                                                        className={styles.qtyInput}
                                                    />

                                                    {/* 🔼 เพิ่มจำนวน */}
                                                    <button
                                                        className={styles.qtyBtn}
                                                        onClick={() => updateCartItem(item.product_id, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>

                                                    {/* ❌ ลบสินค้า */}
                                                    <button
                                                        className={styles.removeBtnInline}
                                                        onClick={() => removeCartItem(item.product_id)}
                                                    >
                                                        ลบ
                                                    </button>
                                                </div>

                                                <p className={styles.cartTotal}>
                                                    รวม: ฿{(item.price * item.quantity).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 🔹 ส่วนขวา - สรุปรวม */}
                    <div className={styles.cartSummaryBox}>
                        <h3>ยอดรวมทั้งหมด</h3>

                        <div className={styles.summaryLine}>
                            <span>ค่าจัดส่ง:</span>
                            <span>฿0.00</span>
                        </div>

                        <div className={styles.summaryLine}>
                            <span>ราคาก่อนภาษี:</span>
                            <span>
                                ฿{(total * 0.937).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        <div className={styles.summaryLine}>
                            <span>ภาษี VAT 7%:</span>
                            <span>
                                ฿{(total * 0.07).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
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

                        <div className={styles.summaryTotal}>
                            <div>
                                <strong>ยอดรวม</strong>
                                <p className={styles.vatNote}>ยอดรวม (รวมภาษีมูลค่าเพิ่ม)</p>
                            </div>
                            <span className={styles.summaryTotalPrice}>
                                ฿{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        <button
                            className={styles.checkoutBtnFull}
                            onClick={() => navigate("/checkout/detail")}
                        >
                            ดำเนินการต่อ
                        </button>

                        <div className={styles.extraInfo}>
                            <div>🚚 ส่งฟรีทั่วไทย<br />ช้อปครบ 5,000 บาทขึ้นไป</div>
                            <div>💳 ผ่อนสูงสุด 10 เดือน<br />ผ่อนได้เลย เพียงแค่มีบัตรเครดิต</div>
                            <div>🎁 รับของที่ร้านลด 1000.-<br />เฉพาะคอมพิวเตอร์ประกอบ</div>
                            <div>🔁 เปลี่ยนคืนง่ายภายใน 7 วัน<br /><small>*เงื่อนไขเป็นไปตามบริษัทกำหนด</small></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
