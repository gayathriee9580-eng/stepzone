const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

items: [
{
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["Active", "Cancelled", "Returned"],
    default: "Active"
  }

},
],

shippingDetails: {
  fullName: { type: String, required: true },
  lastName: String,
  address: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
},

  subtotal: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },

  paymentMethod: {
    type: String,
    required: true,
  },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed", "Refunded" ],
    default: "Paid",
  },

  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Packed", "Shipped", "Delivered",  "Cancelled" ],
    default: "Pending",
  },

deliveryDate: { type: Date, default: () => new Date(Date.now() + 5*24*60*60*1000) },

}, { timestamps: true }); 

module.exports = mongoose.model("Order", orderSchema);