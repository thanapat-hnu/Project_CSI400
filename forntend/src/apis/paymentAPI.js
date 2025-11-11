// ✅ ./apis/paymentAPI.js
import api from "./axios";

export const createPayment = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.post("/protech/payment", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("✅ Payment created:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Payment API error:", err.response?.data || err.message);
    throw err;
  }
};
