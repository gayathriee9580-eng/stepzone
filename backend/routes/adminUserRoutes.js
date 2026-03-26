const express = require("express");

const router = express.Router();

const {
  getUsers,
  toggleUserBlock,
  deleteUser
} = require("../controllers/adminUserController");

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin)
 *     description: Admin can view all users
 *     tags:
 *       - Admin APIs
 *     responses:
 *       200:
 *         description: Users fetched successfully
 */

router.get("/users", getUsers);
router.put("/users/:id/block", toggleUserBlock);
router.delete("/users/:id", deleteUser);


module.exports = router;