const Offer = require("../models/offer");

// Get All Offers
// Route: GET /api/offers
// Access: Public / User
// Function:
//   - Fetch all offers from database
//   - Populate product details linked with offer
// Response:
//   - Array of offers with product information
exports.getOffers = async (req, res) => {
  try {
    const offers = await Offer.find().populate("productId");
    res.json(offers); 
  } catch (err) {
    console.error("Error fetching offers:", err);
    res.status(500).json({ error: "Failed to fetch offers" });
  }
};