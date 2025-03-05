const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const cloudinary = require("../cloudinary");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Create and send token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and send token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



const userDetailsController = async (req, res) => {
  try {
    // console.log("userId", req.user._id); // Changed from req._id to req.user._id
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new Error("User not found");
    }

    res.status(200).json({
      data: user,
      error: false,
      success: true,
      message: "User details retrieved successfully"
    });

    // console.log("user", user);

  } catch (err) {
    res.status(400).json({
      message: err.message || "Error retrieving user details",
      error: true,
      success: false
    });
  }
}


const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found", error: true });
    }

    // Update user details
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // If a file is uploaded, process it
    if (req.file) {
      cloudinary.uploader.upload_stream(
        { folder: "user_profiles", resource_type: "auto" },
        async (error, cloudinaryResult) => {
          if (error) {
            return res.status(500).json({ message: "Cloudinary upload failed", error: true });
          }
          user.profileImage = cloudinaryResult.secure_url; // Store Cloudinary URL
          await user.save();
          res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            data: user,
          });
        }
      ).end(req.file.buffer); // Pass file buffer to Cloudinary
    } else {
      await user.save();
      res.status(200).json({
        message: "Profile updated successfully",
        success: true,
        data: user,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: true });
  }
};


module.exports = {signup, login, userDetailsController, updateUserProfile}