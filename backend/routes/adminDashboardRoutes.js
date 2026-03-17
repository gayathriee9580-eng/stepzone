const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getDashboardMetrics,
  getRecentOrders,
  getInventoryAlerts,
  getCategoryDistribution,
  getMonthlyRevenue,
  getOrderStatusStats,
} = require("../controllers/adminDashboardController");


/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Admin dashboard data like sales, orders, users
 *     tags:
 *       - Admin APIs
 *     responses:
 *       200:
 *         description: Dashboard data fetched successfully
 */


// Example protected routes
router.get("/dashboard-metrics", adminMiddleware, getDashboardMetrics);
router.get("/order-status-stats", adminMiddleware, getOrderStatusStats);
router.get("/recent-orders", adminMiddleware, getRecentOrders);
router.get("/inventory-alerts", adminMiddleware, getInventoryAlerts);
router.get("/category-distribution", adminMiddleware, getCategoryDistribution);
router.get("/monthly-revenue", adminMiddleware, getMonthlyRevenue);

module.exports = router;