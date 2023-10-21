const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({
        error: "you must be logged in",
      });
    }
    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
      return res.status(401).json({
        error: "you must be logged in",
      });
    }
    const { _id } = payload;
    const user = await User.findById(_id);
    if (!user) {
      console.log("Error in requireLogin middleware");
      return res.json({
        error: err,
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
};
