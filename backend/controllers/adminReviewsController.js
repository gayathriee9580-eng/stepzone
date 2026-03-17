const Review = require("../models/review");
const Product = require("../models/Product");
const User = require("../models/User");

// GET ALL REVIEWS
// Route: GET /api/admin/reviews
// Access: Admin
// Function:
//   - Fetch all product reviews
//   - Populate user name and product title
//   - Sort reviews by latest first
// Response: List of reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name")           // fetch user name
      .populate("product", "title")       // fetch product title
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// UPDATE REVIEW STATUS
// Route: PUT /api/admin/reviews/:id
// Access: Admin
// Params: review id
// Body: { status }  (Approved / Rejected)
// Function:
//   - Update review approval status
// Response: Updated review object
exports.updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const review = await Review.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!review) return res.status(404).json({ message: "Review not found" });

    res.json({ message: "Status updated", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// DELETE REVIEW
// Route: DELETE /api/admin/reviews/:id
// Access: Admin
// Params: review id
// Function:
//   - Permanently delete a review
// Response: Success message
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    res.json({ message: "Review deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};