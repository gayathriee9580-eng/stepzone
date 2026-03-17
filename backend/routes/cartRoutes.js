const express = require("express");
const router = express.Router();
const { addToCart, getCart , removeFromCart , updateQuantity} = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user cart
 *     tags:
 *       - User APIs
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 */

router.post("/", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.delete("/:productId", authMiddleware, removeFromCart);
router.put("/update/:productId", authMiddleware, updateQuantity);

module.exports = router;