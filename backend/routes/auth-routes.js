const express = require("express");
const {
  loginUser,
  registerUser,
  getUserInfo,
} = require("../controllers/auth-controllers");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getUserInfo);

module.exports = router;
