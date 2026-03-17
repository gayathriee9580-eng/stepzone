require('dotenv').config();
const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test email
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: 'recipient@gmail.com', // replace with your own email to test
  subject: 'Test OTP Email',
  text: 'Hello! This is a test email from your backend.',
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.log('Error:', err);
  } else {
    console.log('Email sent:', info.response);
  }
});