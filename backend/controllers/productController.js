const Product = require("../models/product");
const mongoose = require("mongoose");
const { getApplicableOffer } = require("../utils/offerutils");

// Get product by ID with offer
// Route: GET /api/products/:id
// Access: Public

exports.getProductById = async (req, res)=> {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // ✅ Get applicable offer
    const offer = await getApplicableOffer(product);

    // ✅ Calculate discounted price
    let discountedPrice = product.price;
    if (offer) {
      if (offer.discountType === "percentage") {
        discountedPrice = product.price * (1 - offer.discountPercentage / 100);
      } else if (offer.discountType === "value") {
        discountedPrice = product.price - offer.discountValue;
      }
    }

    // ✅ Send product + offer info to frontend
    res.json({
      ...product.toObject(),
      discountedPrice,
      offer
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// Get all products
// Route: GET /api/products
// Access: Public
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// Get women category products
// Route: GET /api/products/women
// Access: Public
exports.getWomenProducts = async (req, res) => {
  try {
    const products = await Product.find({ category: "women" });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get kids footwear
// Route: GET /api/products/kids
// Access: Public
exports.getKidsFootwear = async (req, res) => {
  try {
    const products = await Product.find({ category: "kids" });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new product
// Route: POST /api/admin/products
// Access: Admin
exports.addProduct = async (req, res) => {
  try {
    const { name, price, image, category, brand, color } = req.body;
    const product = new Product({ name, price, image, category, brand, color });
    await product.save();
    res.status(201).json({ message: "Product added", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get single product
// Route: GET /api/products/:id
// Access: Public
exports.getSingleProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get similar products
// Route: GET /api/products/:id/similar
// Access: Public
exports.getSimilarProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const similarProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);

    res.json(similarProducts);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get products by category
// Route: GET /api/products/category/:category
// Access: Public
exports.getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    const products = await Product.find({
      category: { $regex: new RegExp(category, "i") }
    });

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



