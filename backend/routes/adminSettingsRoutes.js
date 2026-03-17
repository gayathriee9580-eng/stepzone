const express = require("express");

const router = express.Router();

const {
getAdminProfile,
updateAdminProfile,
changePassword
} = require("../controllers/adminSettingsController");
const adminMiddleware = require("../middleware/adminMiddleware");

/**
 * @swagger
 * /api/admin/settings:
 *   get:
 *     summary: Get admin settings
 *     tags:
 *       - Admin APIs
 *     responses:
 *       200:
 *         description: Settings fetched successfully
 */

router.get("/profile",adminMiddleware,getAdminProfile);

router.put("/profile",adminMiddleware,updateAdminProfile);

router.put("/change-password",adminMiddleware,changePassword);

module.exports = router;