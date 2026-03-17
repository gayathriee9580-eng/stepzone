const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  console.log("HEADERS:", req.headers);

  const token = req.headers.authorization?.split(" ")[1];
  console.log("TOKEN:", token);

  if (!token) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  try {
    console.log("VERIFY JWT SECRET:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED:", decoded);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    req.admin = decoded;
    console.log("Decoded JWT:", decoded);
    next();

  } catch (error) {
    console.log("JWT ERROR:", error.message);
    return res.status(401).json({ message: "Token invalid" });
  }
};

module.exports = adminMiddleware;