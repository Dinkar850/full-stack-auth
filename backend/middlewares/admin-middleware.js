const adminMiddleware = (req, res, next) => {
  if (req.userInfo.role !== "admin") {
    return res.status(403).json({
      success: false,
      type: "invalid_role",
      message: "Only admin access allowed",
    });
  }
  next();
};

module.exports = adminMiddleware;
