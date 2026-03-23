const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/User");

// Get Dashboard Metrics
// Route: GET /api/admin/dashboard/metrics
// Access: Admin
// Function:
//   - Returns overall system statistics
//   - Includes total users, products, orders, revenue
// Response:
// {
//   totalUsers,
//   totalProducts,
//   totalOrders,
//   totalRevenue,
//   pendingOrders,
//   deliveredOrders
// }
exports.getDashboardMetrics = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments();

    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const revenueData = await Order.aggregate([
      {
        $match: { paymentStatus: "Paid" }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    const pendingOrders = await Order.countDocuments({ status: "Pending" });

    const deliveredOrders = await Order.countDocuments({ status: "Delivered" });

    res.status(200).json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      deliveredOrders
    });

  } catch (error) {
    console.error("Dashboard Metrics Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// Get Recent Orders
// Route: GET /api/admin/dashboard/recent-orders
// Access: Admin
// Function:
//   - Fetch latest 5 orders
//   - Includes user info and ordered products
// Response: Array of recent orders
exports.getRecentOrders = async (req, res) => {
  try {
const orders = await Order.find()
  .select("totalAmount status createdAt items user")
  .sort({ createdAt: -1 })
  .limit(5)
  .populate("items.product", "name category")
  .populate("user", "name email");

    res.status(200).json(orders);

  } catch (error) {
    console.error("Recent Orders Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Inventory Alerts
// Route: GET /api/admin/dashboard/inventory-alerts
// Access: Admin
// Function:
//   - Detect products with low stock
//   - Stock <= 5 → alert
// Response:
// [
//   {
//     productName,
//     size,
//     stock,
//     level
//   }
// ]
exports.getInventoryAlerts = async (req, res) => {
  try {
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } }).limit(10);
    const alerts = lowStockProducts.map(p => ({
      productName: p.name,
      size: p.size || "-",
      stock: p.stock,
      level: p.stock <= 2 ? "Low Stock" : "Reorder Soon"
    }));
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Category Distribution
// Route: GET /api/admin/dashboard/category-distribution
// Access: Admin
// Function:
//   - Calculates percentage of products per category
//   - Used for pie charts in dashboard
// Response:
// [
//   {
//     categoryName,
//     percentage,
//     color
//   }
// ]
exports.getCategoryDistribution = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    const total = categories.reduce((acc, c) => acc + c.count, 0);

    // Assign colors for frontend display
    const colors = { Women: "#ea4335", Kids: "#fbbc04" };

    const distribution = categories.map(c => ({
      categoryName: c._id,
      percentage: Math.round((c.count / total) * 100),
      color: colors[c._id] || "#888"
    }));

    res.json(distribution);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Monthly Revenue (Last 6 Months)
// Route: GET /api/admin/dashboard/monthly-revenue
// Access: Admin
// Function:
//   - Calculate revenue for last 6 months
//   - Includes only paid orders
// Response:
// [
//   {
//     month,
//     revenue
//   }
// ]
exports.getMonthlyRevenue = async (req, res) => {
  try {
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return d;
    }).reverse();

    const revenueData = await Promise.all(months.map(async (m) => {
      const start = new Date(m.getFullYear(), m.getMonth(), 1);
      const end = new Date(m.getFullYear(), m.getMonth() + 1, 0);
      const revenueAgg = await Order.aggregate([
{ 
  $match: { 
    createdAt: { $gte: start, $lte: end },
    paymentStatus: "Paid"
  } 
},
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]);
      return {
        month: start.toLocaleString("default", { month: "short" }),
        revenue: revenueAgg[0]?.total || 0
      };
    }));

    res.json(revenueData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Order Status Statistics
// Route: GET /api/admin/dashboard/order-status
// Access: Admin
// Function:
//   - Calculate order status percentages
//   - Used for dashboard charts
// Response:
// {
//   completed,
//   processing,
//   returned,
//   cancelled
// }
exports.getOrderStatusStats = async (req, res) => {
  try {
    const total = await Order.countDocuments();

    const completed = await Order.countDocuments({ status: "Completed" });
    const processing = await Order.countDocuments({ status: "Processing" });
    const returned = await Order.countDocuments({ status: "Returned" });
    const cancelled = await Order.countDocuments({ status: "Cancelled" });

    res.json({
      completed: total ? Math.round((completed / total) * 100) : 0,
      processing: total ? Math.round((processing / total) * 100) : 0,
      returned: total ? Math.round((returned / total) * 100) : 0,
      cancelled: total ? Math.round((cancelled / total) * 100) : 0
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to load order status stats" });
  }
};
