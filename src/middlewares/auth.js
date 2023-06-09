const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId });
    if (!user) {
      throw new Error("Please authenticate.");
    }

    req.token = token;
    req.user = user;

    if (req.params.userId && req.params.userId !== user._id.toString()) {
      throw new Error("Unauthorized");
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = auth;
