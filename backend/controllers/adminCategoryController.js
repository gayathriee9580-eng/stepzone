const Category = require("../models/Category");
const Product = require("../models/product");

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
        const count = await Product.countDocuments({
          category: { $regex: `^${cat.name}$`, $options: "i" }
        });

        return {
          ...cat,
          productCount: count
        };
      })
    );

    res.json(categoriesWithCount);
  } catch (err) {
    console.error("getCategories error:", err);
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

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const normalizedName = name.trim().toLowerCase();

    const existing = await Category.findOne({
      name: { $regex: `^${normalizedName}$`, $options: "i" }
    });

    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({
      name: normalizedName,
      isActive: true
    });

    await category.save();

    res.status(201).json(category);
  } catch (err) {
    console.error("addCategory error:", err);
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
    const { name, isActive } = req.body;

    const oldCategory = await Category.findById(req.params.id);
    if (!oldCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updateData = {};
    if (name) updateData.name = name.trim().toLowerCase();
    if (typeof isActive === "boolean") updateData.isActive = isActive;

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    // If category name changed, update products too
    if (name && oldCategory.name !== updateData.name) {
      await Product.updateMany(
        { category: oldCategory.name },
        { category: updateData.name }
      );
    }

    res.json(updated);
  } catch (err) {
    console.error("updateCategory error:", err);
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
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await Product.updateMany(
      { category: category.name },
      { $unset: { category: "" } }
    );

    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("deleteCategory error:", err);
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

    if (!categoryId) {
      return res.status(400).json({ message: "Category is required" });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // remove current category from products that already belong to it
    await Product.updateMany(
      { category: category.name },
      { $unset: { category: "" } }
    );

    // assign selected products to this category
    await Product.updateMany(
      { _id: { $in: productIds || [] } },
      { category: category.name }
    );

    res.json({ message: "Products assigned successfully" });
  } catch (err) {
    console.error("assignProducts error:", err);
    res.status(500).json({ message: "Assignment failed" });
  }
};