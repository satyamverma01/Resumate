const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authorize = async (req, res, next) => {
  let token = req.cookies.jwt;

  // Check Authorization header if cookie is not present
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.userId);
  } catch (error) {
    console.error("Authorization error:", error);
    return res.status(401).json({ message: "Unauthorized access" });
  }
  next();
};

module.exports = authorize;
