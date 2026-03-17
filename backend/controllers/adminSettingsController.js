const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");


// GET ADMIN PROFILE
//Route: GET /api/admin/settings/profile
// Access: Admin (Authenticated)
// Function: Fetch logged-in admin details excluding password
// Response: Admin object
exports.getAdminProfile = async (req, res) => {
  try {
    console.log("Fetching admin with ID:", req.admin.id);

    const admin = await Admin.findById(req.admin.id).select("-password");

    if (!admin) {
      console.log("Admin not found in DB");
      return res.status(404).json({ message: "Admin not found" });
    }

    console.log("Admin found:", admin);
    res.json(admin);
  } catch (err) {
    console.error("GET Admin profile error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};


// UPDATE ADMIN PROFILE
// Route: PUT /api/admin/profile
// Access: Admin (Authenticated)
// Body: { name, email }
// Function: Update admin name or email
// Response: Updated admin object
exports.updateAdminProfile  = async(req,res)=>{
  try {
    const {name,email} = req.body;

    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.name = name || admin.name;
    admin.email = email || admin.email;

    await admin.save();

    res.json({ message:"Profile Updated", admin });
  } catch(err) {
    console.error("Update admin profile error:", err);

    // Handle duplicate email error
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({ message: "Email already in use" });
    }

    res.status(500).json({ message:"Server Error" });
  }
};



// CHANGE ADMIN PASSWORD
// Route: PUT /api/admin/change-password
// Access: Admin (Authenticated)
// Body: { currentPassword, newPassword }
// Function:
//   - Verify current password
//   - Hash new password
//   - Update password in database
// Response: Success message
exports.changePassword = async(req,res)=>{

try{

const {currentPassword,newPassword} = req.body;

const admin = await Admin.findById(req.admin.id);

if(!admin){
return res.status(404).json({message:"Admin not found"});
}

const isMatch = await bcrypt.compare(currentPassword,admin.password);

if(!isMatch){

return res.status(400).json({message:"Current password incorrect"});

}

const salt = await bcrypt.genSalt(10);

admin.password = await bcrypt.hash(newPassword,salt);

await admin.save();

res.json({message:"Password updated successfully"});

}catch(err){

res.status(500).json({message:"Server Error"});

}

};