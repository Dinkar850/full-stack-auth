require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDB = require("./database/db");
const authRoutes = require("./routes/auth-routes");
const userRoutes = require("./routes/user-routes");
const adminRoutes = require("./routes/admin-routes");

const app = express();

//auto req.body filling
app.use(express.json());

//allowing cors
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//using cookie-parser for filling in req.cookies
app.use(cookieParser());

//database connection
connectToDB();

//configuring routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening to port ${PORT}`);
});
