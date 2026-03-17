const express = require("express");
const router = express.Router();
const { getReports } = require("../controllers/adminReportsController");
const adminMiddleware= require("../middleware/adminMiddleware");

/**
 * @swagger
 * /api/admin/reports:
 *   get:
 *     summary: Get sales report
 *     description: Admin can view sales reports
 *     tags:
 *       - Admin APIs
 *     responses:
 *       200:
 *         description: Reports fetched successfully
 */

router.get("/reports", adminMiddleware, getReports);
console.log("Admin Reports route loaded");

module.exports = router;