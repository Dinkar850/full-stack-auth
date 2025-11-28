const express = require("express");
const adminMiddleware = require("../middlewares/admin-middleware");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

router.get("/welcome", authMiddleware, adminMiddleware, (req, res) => {
  res.json({
    message: `Welcome admin, ${req.userInfo.username}, you have all rights to do anything you want in this page, IF YOU CAN`,
  });
});

module.exports = router;
