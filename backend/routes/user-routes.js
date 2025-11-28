const authMiddleware = require("../middlewares/auth-middleware");
const express = require("express");

const router = express.Router();

router.get("/welcome", authMiddleware, (req, res) => {
  res.json({
    message: `Welcome, ${req.userInfo.username}`,
  });
});

module.exports = router;
