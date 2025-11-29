require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({
      success: false,
      message: "Access denied, no token found",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
    const user = await User.findById(decoded.userId);
    req.userInfo = user;
    next();
  } catch (e) {
    return res.status(401).json({
      success: false,
      type: "invalid_token",
      message: "Invalid or expired token",
    });
  }
}

module.exports = authMiddleware;
