const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  discountPercentage: {
    type: Number,
    required: true
  },
   discountValue: { type: Number }, 

  type: {
    type: String,
    enum: ["product", "category"],
    required:true

  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    default:null

  },

  category: {
    type: String,
    default:""

  },

  expiryDate:{
  type:Date,
  required:true
   },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Offer", offerSchema);