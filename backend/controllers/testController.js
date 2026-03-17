// Test API controller
const testAPI = (req, res) => {
  res.json({
    success: true,
    message: "API working successfully",
    method: req.method
  });
};

// Export controller function
module.exports = { testAPI };
