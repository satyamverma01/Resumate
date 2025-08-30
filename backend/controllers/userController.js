const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../jwt/token");

// Signup
const singup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
      return res.status(400).json({ errors: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashPassword });
    await newUser.save();

    if (newUser) {
      const token = await generateToken(newUser._id, res);
      return res
        .status(201)
        .json({ message: "User registered successfully", newUser, token });
    }
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ errors: "Invalid email or password" });
    }

    const token = await generateToken(user._id, res);
    res.status(200).json({ message: "User logged in successfully", user, token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in user", error });
  }
};

// Logout
const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      path: "/",
    });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out user", error });
  }
};

// Export all functions
module.exports = { singup, login, logout };
