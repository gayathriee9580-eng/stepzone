const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

// Generate JWT token for admin
// Params: admin id
// Function: create authentication token with admin role
// Response: JWT token valid for 1 day

const generateToken = (id) => {
  return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });
};

// Admin Login
// Route: POST /api/admin/login
// Access: Public
// Body: { email, password }
// Function:
//   - Verify admin email
//   - Compare password
//   - Generate JWT token
// Response: Token + admin details
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("EMAIL:", email);

    const admin = await Admin.findOne({ email });
    console.log("ADMIN FOUND:", admin);

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({
      message: "Admin login successful",
      token: generateToken(admin._id),
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.log("LOGIN ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};