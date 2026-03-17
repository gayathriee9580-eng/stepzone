const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      quantity: {
        type: Number,
        default: 1
      },
      price: {          // original price when added to cart
        type: Number,
        required: true
      },      
      discountedPrice: { // price after applying offer at that time
        type: Number,
        required: true
      }
    }
  ]
});

module.exports = mongoose.model("Cart", cartSchema);