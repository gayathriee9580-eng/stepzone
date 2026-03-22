const Review = require("../models/review");
const Product = require("../models/product");
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
      .populate("user", "name")
      .populate("product", "name images")
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
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

    const allowedStatuses = ["Pending", "Approved", "Rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, message: "Status updated", review });
  } catch (error) {
    console.error("Update review status error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
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

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};