require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

  const accessToken = jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "10m",
    }
  );
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

module.exports = { registerUser, loginUser, getUserInfo };
