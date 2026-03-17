
const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get wishlist items
 *     tags:
 *       - User APIs
 *     responses:
 *       200:
 *         description: Wishlist fetched successfully
 */

router.post("/", authMiddleware, wishlistController.toggleWishlist);
router.get("/", authMiddleware, wishlistController.getWishlist);

module.exports = router;
