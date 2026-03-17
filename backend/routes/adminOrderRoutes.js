const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  cancelOrder
} = require("../controllers/adminOrdersController");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders (Admin)
 *     description: Admin can view all orders
 *     tags:
 *       - Admin Orders
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 */


router.get("/orders", adminMiddleware, getAllOrders);
router.get("/orders/:id", adminMiddleware, getSingleOrder);
router.patch("/orders/:id/status", adminMiddleware, updateOrderStatus);
router.patch("/orders/:id/cancel", adminMiddleware, cancelOrder);

module.exports = router;