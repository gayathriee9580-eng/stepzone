const express = require("express");
const router = express.Router();

const {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer
} = require("../controllers/adminOfferController");
/**
 * @swagger
 * /api/admin/offers:
 *   get:
 *     summary: Get all offers
 *     tags:
 *       - Admin APIs
 *     responses:
 *       200:
 *         description: Offers fetched successfully
 */

router.get("/", getOffers);
router.post("/", createOffer);
router.put("/:id", updateOffer);
router.delete("/:id", deleteOffer);

module.exports = router;