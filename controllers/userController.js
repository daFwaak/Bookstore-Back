import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// User Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRET,
      { expiresIn: "7d" }  // ✅ Token expires in 7 days
    );

    return res.status(200).json({
      message: "Login successful",
      data: {
        token,
        userId: user._id,
        role: user.role
      }
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
};

// User Registration
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);  // ✅ Use async hashing

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });

    return res.status(201).json({ message: "Registered successfully", userId: newUser._id });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
};

// Get User by ID
export const getUser = async (req, res) => {
  const { id } = req.params;
  
  try {
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid user ID" });

    const user = await User.findById(id).select("-password");  // ✅ Exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
};

// Update User
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;

  try {
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid user ID" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username || user.username;
    user.email = email || user.email;
    await user.save();

    return res.status(200).json({ message: "Successfully updated", user });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
  }
};
