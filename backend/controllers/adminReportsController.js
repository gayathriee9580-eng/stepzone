const Order = require("../models/order");
const Product = require("../models/Product");
const Category = require("../models/Category");
const dayjs = require("dayjs");

// Helper to calculate growth %
function calcGrowth(current, previous) {
  if (!previous) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

// Get Admin Reports
// Route: GET /api/admin/reports
// Access: Admin
// Function:
//   - Generate analytics data for admin dashboard
//   - Calculate revenue, orders, sales charts, category sales etc.
// Response: JSON object containing all dashboard analytics
exports.getReports = async (req, res) => {
      console.log("Reports API called");
  try {
    // 1️⃣ Summary
    const totalRevenueAgg = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.totalRevenue || 0;

    const totalOrders = await Order.countDocuments();

    const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

    // 2️⃣ Monthly Sales
    const monthlyOrders = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

// DAILY SALES
const dailyAgg = await Order.aggregate([
  { $match: { paymentStatus: "Paid" } },
  {
    $group: {
      _id: {
        day: { $dayOfMonth: "$createdAt" },
        month: { $month: "$createdAt" }
      },
      revenue: { $sum: "$totalAmount" }
    }
  },
  { $sort: { "_id.month": 1, "_id.day": 1 } }
]);

const dailySales = dailyAgg.map(d => ({
  label: `${d._id.day}/${d._id.month}`,
  revenue: d.revenue
}));


// WEEKLY SALES
const weeklyAgg = await Order.aggregate([
  { $match: { paymentStatus: "Paid" } },
  {
    $group: {
      _id: { week: { $week: "$createdAt" } },
      revenue: { $sum: "$totalAmount" }
    }
  },
  { $sort: { "_id.week": 1 } }
]);

const weeklySales = weeklyAgg.map(w => ({
  label: `Week ${w._id.week}`,
  revenue: w.revenue
}));


// MONTHLY SALES
const monthlyAgg = await Order.aggregate([
  { $match: { paymentStatus: "Paid" } },
  {
    $group: {
      _id: { month: { $month: "$createdAt" } },
      revenue: { $sum: "$totalAmount" }
    }
  },
  { $sort: { "_id.month": 1 } }
]);

const monthNames = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const monthlySales = monthlyAgg.map(m => ({
  label: monthNames[m._id.month - 1],
  revenue: m.revenue
}));

    // 3️⃣ Category Sales
    const products = await Product.find();
    const categorySales = {};

    for (let cat of products.map(p => p.category)) categorySales[cat] = 0;

    const orders = await Order.find().populate("items.product");

orders.forEach(order => {
  order.items.forEach(item => {

    if (!item.product) return; // important safety check

    const cat = item.product.category;

    if (!categorySales[cat]) {
      categorySales[cat] = 0;
    }

    categorySales[cat] += item.quantity;
  });
});

    const categorySalesArray = Object.keys(categorySales).map(cat => ({
      name: cat,
      sold: categorySales[cat],
    }));

    // 4️⃣ Payment Distribution
    const paymentAgg = await Order.aggregate([
      { $group: { _id: "$paymentMethod", count: { $sum: 1 } } },
    ]);

    const totalPayments = paymentAgg.reduce((acc, p) => acc + p.count, 0);

    const colors = ["#e092d1", "#b0dfff", "#adb5bd"];
    const paymentDistribution = paymentAgg.map((p, i) => ({
      name: p._id,
      percentage: Math.round((p.count / totalPayments) * 100),
      color: colors[i] || "#ccc",
    }));

    // 5️⃣ Top-Selling Products
    const productSales = {};

    orders.forEach(order => {
      order.items.forEach(item => {
if (!item.product) return;
const id = item.product._id.toString();   
    if (!productSales[id]) productSales[id] = { name: item.product.name, category: item.product.category, sold: 0, revenue: 0, price: item.product.price };
        productSales[id].sold += item.quantity;
        productSales[id].revenue += item.quantity * item.product.price;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    // 6️⃣ Monthly Performance Table
    const monthlyPerformance = monthlyOrders.map((m, i, arr) => {
      const prevRevenue = arr[i - 1] ? arr[i - 1].revenue : 0;
      return {
        month: monthNames[m._id.month - 1] + " " + m._id.year,
        orders: m.orders,
        revenue: m.revenue,
        growth: calcGrowth(m.revenue, prevRevenue),
      };
    });

    res.json({
      success: true,
      summary: { totalRevenue, totalOrders, monthlySales: monthlyOrders[monthlyOrders.length - 1]?.revenue || 0, avgOrderValue },
      dailySales,
      weeklySales,
      monthlySales,
      categorySales: categorySalesArray,
      paymentDistribution,
      topProducts,
      monthlyPerformance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};