const express = require("express");
const router = express.Router();
const Order = require("../models/order"); 
const { createOrder, getCheckoutData, updatePayment , payWithWallet , placeOrder , getOrderById , cancelFullOrder ,cancelItem , getMyOrders, createRazorpayOrder, verifyRazorpay} = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags:
 *       - User APIs
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 */

router.get("/checkout", authMiddleware, getCheckoutData);
router.get("/my-orders", authMiddleware, getMyOrders);

router.post("/create", authMiddleware, createOrder);
router.post("/update-payment", authMiddleware, updatePayment);
router.post("/create-razorpay", authMiddleware, createRazorpayOrder);
router.post("/verify-razorpay", authMiddleware, verifyRazorpay);
router.post("/pay-wallet", authMiddleware, payWithWallet);

router.post("/place", authMiddleware, placeOrder);
router.post("/cancel-full", authMiddleware, cancelFullOrder);
router.post("/cancel-item", authMiddleware, cancelItem);

// ⚠️ This must be at the bottom
router.get("/:orderId", authMiddleware, getOrderById);



module.exports = router;