// controllers/adminOrdersController.js
const Order = require("..//models/order");

// GET ALL ORDERS
// Route: GET /api/admin/orders
// Access: Admin
// Function:
//   - Fetch all orders in the system
//   - Populate user details (name, email)
//   - Populate product details inside order items
// Response: Array of orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")             
      .populate("items.product", "name price image images");

    res.json({ success: true, orders });          // always send an array inside orders
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// GET SINGLE ORDER
// Route: GET /api/admin/orders/:id
// Access: Admin
// Params: orderId
// Function:
//   - Fetch specific order details by ID
//   - Populate user information
// Response: Order object
exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
  .populate("user", "name email")
  .populate("items.product", "name price image images");
  
      if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE ORDER STATUS
// Route: PATCH /api/admin/orders/:id/status
// Access: Admin
// Body: { status }
// Function:
//   - Update order status (Pending, Shipped, Delivered etc.)
//   - Update last modified time
// Response: Updated order
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CANCEL ORDER / REFUND
// Route: PATCH /api/admin/orders/:id/cancel
// Access: Admin
// Function:
//   - Cancel order
//   - If payment already done → mark paymentStatus as "Refunded"
// Response: Updated order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const updateData = {
      status: "Cancelled"
    };

    if (order.paymentStatus === "Paid") {
      updateData.paymentStatus = "Refunded";
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order: updatedOrder
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};