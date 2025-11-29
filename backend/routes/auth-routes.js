const express = require("express");
const {
  loginUser,
  registerUser,
  getUserInfo,
  refreshToken,
} = require("../controllers/auth-controllers");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getUserInfo);
router.post("/refreshToken", refreshToken);

module.exports = router;
