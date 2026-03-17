const express = require("express");
const router = express.Router();
const { signup, forgotPassword, resetPassword } = require("../controllers/authController");
const {login} = require("../controllers/login.controller");
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 */



// Existing routes
router.post("/signup", signup);
router.post("/login", login);

// New routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;