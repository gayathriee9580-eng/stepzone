const Category = require("../models/Category");
const Product = require("../models/Product");

// Get All Categories
// Route: GET /api/categories
// Access: Public / Admin
// Function:
//   - Fetch all categories
//   - Count how many products belong to each category
// Response: List of categories with productCount
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().lean();

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id });
        return {
          ...cat,
          productCount: count
        };
      })
    );

    res.json(categoriesWithCount);

  } catch (err) {
    res.status(500).json({ message: "Failed to load categories" });
  }
};

// Add New Category
// Route: POST /api/categories
// Access: Admin
// Body: { name }
// Function: Create a new product category
// Response: Created category object
exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({ name });
    await category.save();

    res.status(201).json(category);

  } catch (err) {
    res.status(500).json({ message: "Failed to add category" });
  }
};

// Update Category
// Route: PUT /api/categories/:id
// Access: Admin
// Params: categoryId
// Body: updated category data
// Function: Modify category details
// Response: Updated category
exports.updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// Delete Category
// Route: DELETE /api/categories/:id
// Access: Admin
// Params: categoryId
// Function: Remove category from database
// Response: Confirmation message
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};


// Assign Products to Category
// Route: POST /api/categories/assign-products
// Access: Admin
// Body: { categoryId, productIds }
// Function:
//   - Remove category from existing products
//   - Assign selected products to category
// Response: Success message
exports.assignProducts = async (req, res) => {
  try {
    const { categoryId, productIds } = req.body;

    // Remove category from all products
    await Product.updateMany(
      { category: categoryId },
      { $unset: { category: "" } }
    );

    // Assign category to selected products
    await Product.updateMany(
      { _id: { $in: productIds } },
      { category: categoryId }
    );

    res.json({ message: "Products assigned successfully" });

  } catch (err) {
    res.status(500).json({ message: "Assignment failed" });
  }
};