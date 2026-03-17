const express = require("express");
const router = express.Router();
const { getOffers } = require("../controllers/offerController");

/**
 * @swagger
 * /api/offers:
 *   get:
 *     summary: Get available offers
 *     tags:
 *       - User APIs
 *     responses:
 *       200:
 *         description: Offers fetched successfully
 */

router.get("/", getOffers);

module.exports = router;