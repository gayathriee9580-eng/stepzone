const User = require("../models/User");
const bcrypt = require("bcryptjs");


// Get User Profile
// Route: GET /api/user/profile
// Access: Authenticated User
// Function: Fetch logged-in user details (excluding password)
// Response: User object
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// Update User Profile
// Route: PUT /api/user/profile
// Access: Authenticated User
// Body: { name, phone, gender, dob }
// Function: Update user profile details
// Response: Updated user data
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, gender, dob } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, phone, gender, dob },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated", user });

  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// Change User Password
// Route: PUT /api/user/change-password
// Access: Authenticated User
// Body: { currentPassword, newPassword }
// Function:
//   - Verify current password
//   - Hash new password
//   - Save updated password
// Response: Success message
exports.changePassword = async (req, res) => {
  try {

    console.log("Token decoded:", req.user);

    const { currentPassword, newPassword } = req.body;

    console.log("Entered password:", JSON.stringify(currentPassword));

    const user = await User.findById(req.user.userId);

    if (!user) {
      console.log("User not found in DB");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Stored hashed password:", user.password);

    const isMatch = await bcrypt.compare(currentPassword.trim(), user.password);

    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword.trim(), salt);
    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Password change failed" });
  }
};