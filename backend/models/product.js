const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String, required: true }],  // change from "image" to "images"
  category: { type: String, enum: ["women", "kids"], required: true },
  brand: { type: String },
  color: { type: String },
  stock: {
  type: Number,
  required: true,
  default: 0
},
});

module.exports = mongoose.model("Product", productSchema);

