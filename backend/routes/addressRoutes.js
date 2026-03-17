const express = require("express");
const router = express.Router();
const { saveAddress, getAddress } = require("../controllers/addressController");
const authMiddleware = require("../middleware/authMiddleware"); // Must attach req.user.userId


/**
 * @swagger
 * /api/address:
 *   get:
 *     summary: Get user addresses
 *     tags:
 *       - User APIs
 *     responses:
 *       200:
 *         description: Address list fetched
 */

router.post("/", authMiddleware, saveAddress);
router.get("/", authMiddleware, getAddress);

module.exports = router;