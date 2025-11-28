require("dotenv").config();
const express = require("express");
const connectToDB = require("./database/db");
const authRoutes = require("./routes/auth-routes");
const userRoutes = require("./routes/user-routes");
const adminRoutes = require("./routes/admin-routes");
const cors = require("cors");

const app = express();

app.use(express.json());

//allowing cors
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

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
