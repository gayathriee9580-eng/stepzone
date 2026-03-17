const express = require("express");
const router = express.Router();
const {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  assignProducts
} = require("../controllers/adminCategoryController");
const authMiddleware = require("../middleware/adminMiddleware");

/**
 * @swagger
 * /api/admin/categories:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Admin APIs
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 */

router.get("/categories", authMiddleware, getCategories);
router.post("/categories", authMiddleware, addCategory);
router.post("/categories/assign-products", authMiddleware, assignProducts);
router.put("/categories/:id", authMiddleware, updateCategory);
router.delete("/categories/:id", authMiddleware, deleteCategory);

module.exports = router;