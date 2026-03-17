const Order = require("../models/order");
const Product = require("../models/Product");
const User = require("../models/User");

// GET all orders (optionally filter by date)
exports.getSales = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    const filter = {};
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const orders = await Order.find(filter)
      .populate("user", "name")        // get customer name
      .populate("items.product", "title price") // get product details
      .sort({ createdAt: -1 });

    // summary metrics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const completedOrders = orders.filter(o => o.status === "Completed").length;
    const pendingOrders = orders.filter(o => o.status === "Pending").length;

    res.json({ orders, totalOrders, totalRevenue, completedOrders, pendingOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getSalesData = async (req, res) => {

    const orders = await Order.find();

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    const completedOrders = orders.filter(o => o.status === "Completed").length;

    const pendingOrders = orders.filter(o => o.status === "Pending").length;

    res.json({
        totalOrders,
        totalRevenue,
        completedOrders,
        pendingOrders,
        orders
    });

};


exports.getTopProducts = async (req, res) => {
  try {

    const topProducts = await Order.aggregate([

      { $match: { status: "Confirmed" } },

      { $unwind: "$items" },

      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" },
          revenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] }
          }
        }
      },

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo"
        }
      },

      { $unwind: "$productInfo" },

      {
        $project: {
          name: "$productInfo.name",
          totalSold: 1,
          revenue: 1
        }
      },

      { $sort: { totalSold: -1 } },

      { $limit: 5 }

    ]);

    res.json(topProducts);

  } catch (error) {
    console.error("Top products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};