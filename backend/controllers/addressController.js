const Address = require("../models/address");

// Save Shipping Address
// Route: POST /api/address
// Access: Authenticated User
// Body: { fullName, lastName, address, country, state, city, pincode }
// Function:
//   - Validate required fields
//   - Save address to database
// Response: Success message with saved address
exports.saveAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fullName, lastName, address, country, state, city, pincode } = req.body;

    if (!fullName || !lastName || !address || !country || !state || !city || !pincode) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const newAddress = new Address({
      userId,
      fullName,
      lastName,
      address,
      country,
      state,
      city,
      pincode
    });

    await newAddress.save();

    res.status(201).json({
      message: "Address added successfully",
      address: newAddress
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get User Addresses
// Route: GET /api/address
// Access: Authenticated User
// Function:
//   - Fetch all addresses of logged-in user
// Response: List of addresses
exports.getAddress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const addresses = await Address.find({ userId });

    if (!addresses.length) {
      return res.status(404).json({ message: "No addresses found" });
    }

    res.status(200).json({ addresses });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};