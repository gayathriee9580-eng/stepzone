const Coupon = require("../models/coupon");

// Get All Coupons
// Route: GET /api/coupons
// Access: Admin
// Function: Fetch all coupons sorted by newest first
// Response: List of coupons
exports.getCoupons = async (req, res) => {

  const coupons = await Coupon.find().sort({ createdAt: -1 });

  res.json({ success: true, coupons });

};

// Create New Coupon
// Route: POST /api/coupons
// Access: Admin
// Body: Coupon details
// Function: Add a new coupon to database
// Response: Success message
exports.createCoupon = async (req, res) => {

  const coupon = new Coupon(req.body);

  await coupon.save();

  res.json({ success: true });

};

// Update Coupon
// Route: PUT /api/coupons/:id
// Access: Admin
// Params: Coupon ID
// Body: Updated coupon fields
// Function: Update existing coupon
// Response: Success message
exports.updateCoupon = async (req, res) => {

  await Coupon.findByIdAndUpdate(req.params.id, req.body);

  res.json({ success: true });

};

// Delete Coupon
// Route: DELETE /api/coupons/:id
// Access: Admin
// Params: Coupon ID
// Function: Remove coupon from database
// Response: Success message
exports.deleteCoupon = async (req, res) => {

  await Coupon.findByIdAndDelete(req.params.id);

  res.json({ success: true });

};


// Apply Coupon
// Route: POST /api/coupons/apply
// Access: User
// Body: { code, cartTotal }
// Function:
//   - Check coupon validity
//   - Check expiry date
//   - Check minimum order amount
//   - Calculate discount
// Response: Discount amount
exports.applyCoupon = async (req, res) => {

try{

const { code, cartTotal } = req.body;

const coupon = await Coupon.findOne({
code: code,
isActive: true
});

if(!coupon){
return res.json({
success:false,
message:"Invalid coupon"
});
}

const today = new Date();

if(new Date(coupon.expiryDate) < today){
return res.json({
success:false,
message:"Coupon expired"
});
}

if(cartTotal < coupon.minOrderAmount){
return res.json({
success:false,
message:`Minimum order ₹${coupon.minOrderAmount}`
});
}

let discount = 0;

if(coupon.discountType === "percentage"){
discount = (cartTotal * coupon.discountValue) / 100;
}else{
discount = coupon.discountValue;
}

res.json({
success:true,
discount:discount,
coupon:coupon.code
});

}catch(err){
console.log(err);
res.status(500).json({success:false});
}

};