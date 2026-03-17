const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/wallet:
 *   get:
 *     summary: Get wallet details
 *     tags:
 *       - User APIs
 *     responses:
 *       200:
 *         description: Wallet details fetched
 */

router.get("/balance", authMiddleware, walletController.getBalance);
router.post("/topup", authMiddleware, walletController.addMoney);
router.post("/deduct", authMiddleware, walletController.deductMoney);

module.exports = router;