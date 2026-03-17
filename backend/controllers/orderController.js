const Cart = require("../models/cart");
const Order = require("../models/order");
const User = require("../models/User");
const Product = require("../models/Product"); 

const crypto = require("crypto");
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");

const { getApplicableOffer } = require("../utils/offerutils");


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

exports.getCheckoutData = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId })
      .populate("products.product");   // ✅ FIXED

    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ message: "Cart empty" });
    }

    let subtotal = 0;

    cart.products.forEach(item => {
      subtotal += item.product.price * item.quantity;
    });

    const deliveryCharge = 5;
    const discount = 30;
    const totalAmount = subtotal + deliveryCharge - discount;

    res.json({
      items: cart.products,   // ✅ send as items (frontend expects items)
      subtotal,
      deliveryCharge,
      discount,
      totalAmount
    });

  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Create order from cart
// Route: POST /api/orders
// Access: User
exports.createOrder = async (req, res) => {
  try {
    const { shippingDetails , paymentMethod } = req.body;

      if (!shippingDetails || !shippingDetails.fullName || !shippingDetails.address) {
      return res.status(400).json({ message: "Invalid shipping details" });
    }

    const cart = await Cart.findOne({ user: req.user.userId })
      .populate("products.product");

    if (!cart || !cart.products || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let subtotal = 0;

    const orderItems = cart.products.map(item => {
      subtotal += item.product.price * item.quantity;

      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      };
    });

    const deliveryCharge = 5;
    const discount = 30;
    const totalAmount = subtotal + deliveryCharge - discount;

    const deliveryDate = new Date();
deliveryDate.setDate(deliveryDate.getDate() + 5);

    const order = await Order.create({
      user: req.user.userId,
      items: orderItems,
      shippingDetails,
      subtotal,
      deliveryCharge,
      discount,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "Wallet" ? "Paid" : "Pending" ,// optional
      deliveryDate // ✅ add this


    });

    cart.products = [];
    await cart.save();

    res.json({ message: "Order created", orderId: order._id });

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update payment details for an order
// Route: PUT /api/orders/payment
// Access: User
exports.updatePayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, paymentStatus } = req.body;

    const order = await Order.findById(orderId);

     if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentMethod = paymentMethod;
    order.paymentStatus = paymentStatus;
    order.status = "Confirmed";

    await order.save();

    res.json({ message: "Payment updated" });

  } catch (error) {
    console.error("Payment Update Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Pay order using wallet balance
// Route: POST /api/orders/wallet-payment
// Access: User
exports.payWithWallet = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    const user = await User.findById(req.user.userId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.walletBalance < order.totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient wallet balance"
      });
    }

    // Deduct balance
    user.walletBalance -= order.totalAmount;
    await user.save();

    // Update order
    order.paymentMethod = "Wallet";
    order.paymentStatus = "Paid";
    order.status = "Confirmed";
    await order.save();

    res.json({ success: true });

  } catch (error) {
    console.error("Wallet Payment Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Place order from cart with offer calculation
// Route: POST /api/orders/place
// Access: User
exports.placeOrder = async (req, res) => {
  try {

    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Get cart from DB
    const cart = await Cart.findOne({ user: userId })
      .populate("products.product");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ✅ Build order items from cart
const formattedItems = [];

let subtotal = 0;

for (const item of cart.products) {
  const product = item.product;

  // Get applicable offer
  const offer = await getApplicableOffer(product);

  let discountedPrice = product.price;

  if (offer) {
    if (offer.discountType === "percentage") {
      discountedPrice = product.price * (1 - offer.discountPercentage / 100);
    } else if (offer.discountType === "value") {
      discountedPrice = product.price - offer.discountValue;
    }
  }

  formattedItems.push({
    product: product._id,
    quantity: item.quantity,
    price: product.price,
    discountedPrice
  });

  subtotal += discountedPrice * item.quantity; // ✅ use discounted price
}

    const {
      shippingDetails,
      deliveryCharge,
      discount,
      paymentMethod
    } = req.body;

    // ✅ Calculate subtotal from DB (never trust frontend)
    subtotal = formattedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const totalAmount = subtotal + deliveryCharge - discount;

    let paymentStatus = "Pending";
    let status = "Pending";

    // ---------------- WALLET ----------------
    if (paymentMethod === "Wallet") {
      if (user.walletBalance < totalAmount) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      }

      user.walletBalance -= totalAmount;
      await user.save();

      paymentStatus = "Paid";
      status = "Confirmed";  

    }

    // ---------------- Delivery Date ----------------
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    // ✅ Create Order
    const newOrder = await Order.create({
      user: userId,
      items: formattedItems,
      shippingDetails,
      subtotal,
      deliveryCharge,
      discount,
      totalAmount,
      paymentMethod,
      paymentStatus,
      status,           
      deliveryDate
    });

    // ✅ Clear Cart AFTER order
    await Cart.findOneAndUpdate(
      { user: userId },
      { products: [] }
    );

    res.status(201).json({
      message: "Order placed successfully",
      orderId: newOrder._id
    });

  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single order details by order ID
// Route: GET /api/orders/:orderId
// Access: User
exports.getOrderById = async (req, res) => {
  try {

 const order = await Order.findOne({
  _id: req.params.orderId,
  user: req.user.userId   // 🔒 only allow own order
}).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ order });

  } catch (error) {
    console.error("Get Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// Cancel entire order
// Route: POST /api/orders/cancel
// Access: User
exports.cancelFullOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.userId
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "Order already cancelled" });
    }

    order.status = "Cancelled";
    order.paymentStatus = "Refunded";

    await order.save();

    res.json({ message: "Order cancelled successfully" });

  } catch (error) {
    console.error("Cancel Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get logged-in user's orders
// Route: GET /api/orders/my-orders
// Access: User
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

const orders = await Order.find({ user: new mongoose.Types.ObjectId(userId) })
  .populate("items.product")
  .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error("Get My Orders Error:", error); // <-- check this
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelItem = async (req, res) => {
  try {

    const { orderId, productId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const item = order.items.find(
      i => i.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // ⭐ mark item cancelled
    item.status = "Cancelled";

    await order.save();

    res.json({
      success: true,
      message: "Item cancelled successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const options = {
      amount: order.totalAmount * 100, // paise
      currency: "INR",
      receipt: order._id.toString()
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      key: process.env.RAZORPAY_KEY_ID,
      amount: options.amount,
      razorpayOrderId: razorpayOrder.id
    });

  } catch (error) {
    console.error("Razorpay Create Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.verifyRazorpay = async (req, res) => {
  try {
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    const body = razorpayOrderId + "|" + razorpayPaymentId;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const order = await Order.findById(orderId);

    order.paymentMethod = "Razorpay";
    order.paymentStatus = "Paid";
    order.status = "Confirmed";

    await order.save();

    res.json({ success: true });

  } catch (error) {
    console.error("Verify Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};