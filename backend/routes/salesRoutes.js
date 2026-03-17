const express = require("express");
const router = express.Router();
const { getSales, getTopProducts } = require("../controllers/salesController");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", getSales);
router.get("/top-products", adminMiddleware, getTopProducts);

module.exports = router;