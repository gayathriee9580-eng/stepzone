const OTP = require('../models/otp');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Generate 6-digit numeric OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hash OTP
function hashOTP(otp) {
    return crypto.createHash('sha256').update(otp).digest('hex');
}

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail', // or your SMTP service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send OTP via email
async function sendEmailOTP(email, otp) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'StepZone OTP Verification',
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`
    };
    await transporter.sendMail(mailOptions);
}

// Send OTP API
// Route: POST /api/otp/send
// Access: Public
// Body: { email }
// Function:
//   - Generate OTP
//   - Hash OTP
//   - Save OTP in database
//   - Send OTP via email
// Response: OTP session ID
exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    try {
        const otpCode = generateOTP();
        const hashedOtp = hashOTP(otpCode);

        const otpEntry = new OTP({ phone: email, otp: hashedOtp }); // reuse `phone` field for email
        await otpEntry.save();

        // Send OTP via email
        await sendEmailOTP(email, otpCode);

        console.log(`OTP for ${email}: ${otpCode}`); // for testing

        res.json({ success: true, message: 'OTP sent successfully', otpId: otpEntry._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Verify OTP API
// Route: POST /api/otp/verify
// Access: Public
// Body: { otpId, otp, email }
// Function:
//   - Check OTP session
//   - Hash user input OTP
//   - Compare with stored OTP
//   - Delete OTP after verification
// Response: Verification success message
exports.verifyOtp = async (req, res) => {
    const { otpId, otp, email } = req.body;
    if (!otpId || !otp || !email) return res.status(400).json({ success: false, message: 'All fields are required' });

    try {
        const otpEntry = await OTP.findOne({ _id: otpId, phone: email });
        if (!otpEntry) return res.status(400).json({ success: false, message: 'OTP session expired or invalid' });

        const hashedInput = hashOTP(otp);
        if (hashedInput !== otpEntry.otp) return res.status(400).json({ success: false, message: 'Invalid OTP' });

        await OTP.deleteOne({ _id: otpId });

        res.json({ success: true, message: 'OTP verified successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};