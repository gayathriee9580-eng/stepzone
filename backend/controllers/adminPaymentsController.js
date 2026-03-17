// controllers/adminPaymentsController.js
const Order = require("../models/order");

// Get All Payments
// Route: GET /api/admin/payments
// Access: Admin
// Function:
//   - Fetch all orders (payments) from database
//   - Populate user details (name, email)
//   - Sort by latest payments first
// Response: List of payment/order records
exports.getPayments = async (req, res) => {
  try {
    const payments = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 }); 

    res.json({ success: true, payments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};