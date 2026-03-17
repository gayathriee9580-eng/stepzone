const User = require("../models/User");
const Transaction = require("../models/Transaction");


// ================= GET BALANCE =================
// Route: GET /api/wallet
// Access: Authenticated User
// Function:
//   - Fetch user wallet balance
//   - Get transaction history
// Response:
//   {
//     balance: Number,
//     transactions: Array
//   }

exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const transactions = await Transaction.find({
      userId: req.user.userId
    }).sort({ createdAt: -1 });

    res.json({
      balance: user.walletBalance,
      transactions
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= ADD MONEY =================
// Route: POST /api/wallet/add
// Access: Authenticated User
// Body: { amount }
// Function:
//   - Add money to wallet balance
//   - Save transaction history
// Response:
//   {
//     message: String,
//     newBalance: Number
//   }

exports.addMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.walletBalance += Number(amount);
    await user.save();

    await Transaction.create({
      userId: req.user.userId,
      amount,
      type: "credit",
      description: "Wallet Topup"
    });

    res.json({
      message: "Money added successfully",
      newBalance: user.walletBalance
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= DEDUCT MONEY (FOR PAYMENT) =================
// Route: POST /api/wallet/deduct
// Access: Authenticated User
// Body: { amount }
// Function:
//   - Deduct wallet balance for order payment
//   - Save debit transaction
// Response:
//   {
//     message: String,
//     remainingBalance: Number
//   }

exports.deductMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.walletBalance < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    user.walletBalance -= Number(amount);
    await user.save();

    await Transaction.create({
      userId: req.user.userId,
      amount,
      type: "debit",
      description: "Order Payment"
    });

    res.json({
      message: "Payment successful",
      remainingBalance: user.walletBalance
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};