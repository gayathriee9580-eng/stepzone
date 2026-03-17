const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role:{
    type:String,
    default:"user"
  },
   isBlocked:{
    type:Boolean,
    default:false
  },
  walletBalance: {
  type: Number,
  default: 0
},
 phone: String,
  gender: String,
  dob: Date,
  },
  
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
