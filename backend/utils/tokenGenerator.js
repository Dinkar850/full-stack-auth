require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_SECRET_KEY, {
    expiresIn: "10s",
  });
  return accessToken;
};

const generateRefreshToken = (userId) => {
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_SECRET_KEY, {
    expiresIn: "5m",
  });
  return refreshToken;
};

module.exports = { generateAccessToken, generateRefreshToken };
