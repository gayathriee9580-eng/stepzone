
const express = require("express");
const router = express.Router();


const offerRoutes = require("./adminOfferRoutes");
const adminCouponRoutes =  require("./adminCouponRoutes");
const adminDashboardRoutes = require('./adminDashboardRoutes');
const adminProductRoutes = require("./adminProductRoutes");
const adminCategoryRoutes = require("./adminCategoryRoutes");
const adminAuthRoutes = require("./adminAuthRoutes");
const adminOrderRoutes = require("./adminOrderRoutes");
const adminPaymentsRoutes = require("./adminPaymentsRoutes");
const adminReports = require("./adminReports");
const adminReviews = require("./adminReviews");
const salesRoutes = require("./salesRoutes");
const adminUserRoutes = require("./adminUserRoutes");
const adminSettingsRoutes = require("./adminSettingsRoutes");
/* ---------- ADMIN ROUTES ---------- */
router.use("/admin", adminDashboardRoutes)
        .use("/admin",adminProductRoutes)
        .use("/admin",adminCategoryRoutes)
        .use("/admin",adminAuthRoutes)
        .use("/admin",adminOrderRoutes)
        .use("/admin/payments",adminPaymentsRoutes)
        .use("/admin",adminReports)
        .use("/admin/reviews",adminReviews)
        .use("/admin/sales", salesRoutes)
        .use("/admin", adminUserRoutes)
        .use("/admin/settings",adminSettingsRoutes)

router.use("/admin/offers", offerRoutes);
router.use("/admin/coupons", adminCouponRoutes);

/* ---------- USER ROUTES ---------- */
router.use("/users", require("./userRoutes"));
router.use("/products", require("./productRoutes"));
router.use("/orders", require("./orderRoutes"));
router.use("/cart", require("./cartRoutes"));
router.use("/wishlist", require("./wishlistRoutes"));
router.use("/wallet", require("./walletRoutes"));
router.use("/address", require("./addressRoutes"));
router.use("/auth", require("./authRoutes"));
router.use("/offers", require("./offerRoutes"));
router.use("/coupons", require("./adminCouponRoutes"));

/* ---------- OTHER ---------- */
router.use("/", require("./otpRoutes"));

module.exports = router;

