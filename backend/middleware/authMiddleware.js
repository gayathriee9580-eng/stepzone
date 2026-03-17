const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; // use lowercase 'headers'

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId }; // ensure userId exists for controllers
    console.log("Decoded user:", req.user);
    next();
  } catch (err) {
    console.error("JWT error:", err);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;