import express from "express";
import { authJWT } from "../../middlewares/auth.middleware.js";

import paymentRoutes from "./paymentRoutes.js";
import shippingRoutes from "./shippingRoutes.js";
import refundRoutes from "./refundRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
import wishlistRoutes from "./wishlistRoutes.js";
import addressRouter from "./address.Router.js";
import userRouter from "./user.Router.js";
import cartRouter from "./cart.Router.js"; // ✅ ใช้ชื่อนี้ให้ตรงกับชื่อไฟล์จริง
import orderRoutes from "./orderRoutes.js";
import couponRoutes from "./couponRoutes.js";
import newApi from "./newApi.Router.js"

const router = express.Router();

router.use(authJWT);

router.use("/payment", paymentRoutes);
router.use("/shipping", shippingRoutes);
router.use("/refund", refundRoutes);
router.use("/notification", notificationRoutes);
router.use("/reviews", reviewRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/address", addressRouter);
router.use("/user", userRouter);
router.use("/cart", cartRouter); // ✅ ต้องมีบรรทัดนี้
router.use("/order", orderRoutes);
router.use("/coupon", couponRoutes);
router.use("/newapi", newApi);

export default router;
