const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");



const {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  updateStock
} = require("../controllers/adminProductController");
const authMiddleware = require("../middleware/adminMiddleware");

/**
 * @swagger
 * /api/admin/products:
 *   get:
 *     summary: Get all products for admin
 *     tags:
 *       - Admin APIs
 *     responses:
 *       200:
 *         description: Admin products fetched
 */

router.get("/products", authMiddleware, getAllProducts);

router.post("/products", authMiddleware, upload.array("images", 5), addProduct);

router.put("/products/:id", authMiddleware, updateProduct);
router.delete("/products/:id", authMiddleware, deleteProduct);
router.patch("/products/:id/stock", authMiddleware, updateStock);

module.exports = router;