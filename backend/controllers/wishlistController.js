const Wishlist = require("../models/Wishlist");

// Toggle Wishlist (Add / Remove product)
// Route: POST /api/wishlist/toggle
// Access: User (Authenticated)
// Body: { productId }
// Function:
//   - If product not in wishlist → add it
//   - If product already exists → remove it
// Response: Success message
exports.toggleWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;   // ✅ FIXED
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        products: [{ productId }]
      });

      await wishlist.save();
      return res.json({ message: "Added to wishlist" });
    }

    const existingIndex = wishlist.products.findIndex(
  item => item.productId && item.productId.toString() === productId
);

    if (existingIndex > -1) {
      // REMOVE
      wishlist.products.splice(existingIndex, 1);
      await wishlist.save();
      return res.json({ message: "Removed from wishlist" });
    } else {
      // ADD
      wishlist.products.push({ productId });
      await wishlist.save();
      return res.json({ message: "Added to wishlist" });
    }

  } catch (err) {
    console.error("🔥 Wishlist Toggle Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get User Wishlist
// Route: GET /api/wishlist
// Access: User (Authenticated)
// Function:
//   - Fetch wishlist products of logged-in user
// Response: List of wishlist products
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;  
    const wishlist = await Wishlist.findOne({ userId })
      .populate("products.productId"); 

    if (!wishlist) {
      return res.json({ products: [] });
    }

    res.json({
      products: wishlist.products
    });

  } catch (err) {
    console.error("Wishlist GET Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};