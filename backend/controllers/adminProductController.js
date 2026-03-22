const Product = require("../models/product");


// 1️⃣ Get All Products
// Route: GET /api/products
// Access: Public
// Function: Fetch all products from database
// Response: Array of product objects
exports.getAllProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
};


// 2️⃣ Add Product
// Route: POST /api/products
// Access: Admin
// Body: { name, price, image, category, brand, color, stock }
// Function: Create a new product in database
// Response: Created product object
// backend/controllers/adminProductController.js
exports.addProduct = async (req, res) => {
  try {

    const { name, category } = req.body;

    const price = Math.max(0, Number(req.body.price));
    const images = req.files.map(file => file.filename);
    const stock = Math.max(0, Number(req.body.stock));

    const product = new Product({
      name,
      category,
      price,
      stock,
      images
    });

    await product.save();

    res.status(201).json({
      message: "Product added successfully",
      product
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 3️⃣ Update Product
// Route: PUT /api/products/:id
// Access: Admin
// Params: id (product ID)
// Body: Product fields to update
// Function: Update existing product details
// Response: Updated product object
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};


// Delete Product
// Route: DELETE /api/products/:id
// Access: Admin
// Params: id (product ID)
// Function: Remove product from database
// Response: Success message
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};


// Update Product Stock
// Route: PUT /api/products/:id/stock
// Access: Admin
// Params: id (product ID)
// Body: { stock }
// Function: Update available product stock quantity
// Response: Updated product object
exports.updateStock = async (req, res) => {
  try {
    const { stock } = req.body;

    const product = await Product.findById(req.params.id);
    product.stock = stock;
    await product.save();

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: "Stock update failed" });
  }
};