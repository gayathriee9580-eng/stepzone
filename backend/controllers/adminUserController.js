const User = require("../models/User");


// GET ALL USERS
// Route: GET /api/admin/users
// Access: Admin
// Function: Fetch all registered users
// Response: Array of user objects
exports.getUsers = async (req, res) => {

  try {

    const users = await User.find().sort({ createdAt: -1 });

    res.json(users);

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: "Server error" });

  }

};



// BLOCK / UNBLOCK USER
// Route: PUT /api/admin/users/:id/block
// Access: Admin
// Params: id (User ID)
// Function: Toggle user block status
// Response: Updated user status
exports.toggleUserBlock = async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.json({ message: "User status updated", user });

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: "Server error" });

  }

};



// DELETE USER
// Route: DELETE /api/admin/users/:id
// Access: Admin
// Params: id (User ID)
// Function: Remove user from database
// Response: Confirmation message
exports.deleteUser = async (req, res) => {

  try {

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted" });

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: "Server error" });

  }

};