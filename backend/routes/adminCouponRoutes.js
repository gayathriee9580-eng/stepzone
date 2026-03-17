const express = require("express");
const router = express.Router();

const {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  applyCoupon
} = require("../controllers/adminCouponController");

/**
 * @swagger
 * /api/admin/coupons:
 *   get:
 *     summary: Get all coupons
 *     tags:
 *       - Admin APIs
 *     responses:
 *       200:
 *         description: Coupons fetched successfully
 */

router.get("/", getCoupons);
router.post("/", createCoupon);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);
router.post("/apply", applyCoupon);


module.exports = router;