// routes/adminPayments.js
const express = require("express");
const router = express.Router();
const {getPayments} = require("../controllers/adminPaymentsController");
const adminMiddleware= require("../middleware/adminMiddleware");

/**
 * @swagger
 * /api/admin/payments:
 *   get:
 *     summary: Get payment details
 *     tags:
 *       - Admin APIs
 *     responses:
 *       200:
 *         description: Payments fetched successfully
 */

router.get("/", adminMiddleware,getPayments);

module.exports = router;