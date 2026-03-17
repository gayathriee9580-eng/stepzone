const express = require("express");
const router = express.Router();
const adminReviewsController = require("../controllers/adminReviewsController");

/**
 * @swagger
 * /api/admin/reviews:
 *   get:
 *     summary: Get product reviews
 *     tags:
 *       - Admin APIs
 *     responses:
 *       200:
 *         description: Reviews fetched successfully
 */

router.get("/", adminReviewsController.getReviews);
router.put("/:id/status", adminReviewsController.updateReviewStatus);
router.delete("/:id", adminReviewsController.deleteReview);

module.exports = router;