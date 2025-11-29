require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenGenerator");

const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Username or email or password or role missing in request",
      });
    }
    //checking if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists with this username / email, try with a different one",
      });
    }

    //generating password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //creating new user
    const newlyCreatedUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    if (!newlyCreatedUser) {
      return res.status(400).json({
        success: false,
        message: "Could not register user",
      });
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newlyCreatedUser,
    });
  } catch (e) {
    console.error("Error registering user", e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username or password missing in request",
    });
  }
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({
      success: false,
      message:
        "No user exists with the provided username, try with a different one",
    });
  }

  const isPasswordMatching = await bcrypt.compare(password, user.password);
  if (!isPasswordMatching) {
    return res.status(400).json({
      success: false,
      message: "Incorrect password, try again",
    });
  }

  const refreshToken = generateRefreshToken(user._id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  console.log("set cookie", refreshToken);
  console.log("hello?");

  const accessToken = generateAccessToken(user._id);

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    accessToken,
  });
};

const getUserInfo = async (req, res) => {
  const user = req.userInfo;
  res.status(200).json({
    username: user.username,
    email: user.email,
    role: user.role,
  });
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);
    const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
    if (!payload) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }
    const accessToken = generateAccessToken(payload.userId);
    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (e) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

module.exports = { registerUser, loginUser, getUserInfo, refreshToken };
