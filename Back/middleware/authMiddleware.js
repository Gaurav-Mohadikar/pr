const jwt = require("jsonwebtoken");
const User = require("../model/userModel"); // Import User model

module.exports = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", ""); // Optional chaining for safety

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password"); // Fetch user from DB without password

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // Attach user object to req
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};
