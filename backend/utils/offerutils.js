const Offer = require("../models/offer");

async function getApplicableOffer(product) {
  const today = new Date();

  // Product-specific offer
  let offer = await Offer.findOne({
    type: "product",
    productId: product._id,
    isActive: true,
    expiryDate: { $gte: today }
  });

  if (offer) return offer;

  // Category-specific offer
  offer = await Offer.findOne({
    type: "category",
    category: product.category,
    isActive: true,
    expiryDate: { $gte: today }
  });

  return offer || null;
}

module.exports = { getApplicableOffer };