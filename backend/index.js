const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const docsRoutes = require("./routes/documentRoutes")
const userRoutes = require("./routes/userRoutes")
const cookieParser = require("cookie-parser");

require("dotenv").config();
const connectDB = require("./config/db");

const app = express();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
//connect to db
connectDB();

app.use("/user", userRoutes)
app.use("/docs",docsRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
