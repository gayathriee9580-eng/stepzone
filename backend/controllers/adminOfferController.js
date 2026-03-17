const Offer = require("../models/offer");

// Get All Offers
// Route: GET /api/offers
// Access: Admin
// Function: Fetch all offers with related product details
// Response: List of offers
exports.getOffers = async (req, res) => {

  const offers = await Offer.find().populate("productId");

  res.json({ success: true, offers });

};

// exports.getOffers = async (req,res)=>{

// const offers = await Offer.find({isActive:true});

// res.json(offers);

// };

// Create New Offer
// Route: POST /api/offers
// Access: Admin
// Body: Offer data (productId, discountPercentage / discountValue, startDate, endDate etc.)
// Function: Create and save a new offer
// Response: Success message
exports.createOffer = async (req, res) => {

  const offer = new Offer(req.body);

  await offer.save();

  res.json({ success: true });

};

// Update Existing Offer
// Route: PUT /api/offers/:id
// Access: Admin
// Params: id (Offer ID)
// Body: Updated offer fields
// Function: Update offer details
// Response: Success message
exports.updateOffer = async (req, res) => {

  await Offer.findByIdAndUpdate(req.params.id, req.body);

  res.json({ success: true });

};

// Delete Offer
// Route: DELETE /api/offers/:id
// Access: Admin
// Params: id (Offer ID)
// Function: Remove offer from database
// Response: Success message
exports.deleteOffer = async (req, res) => {

  await Offer.findByIdAndDelete(req.params.id);

  res.json({ success: true });

};