const User = require("../models/userModel");

const checkValidUserOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.user.id,
    });
    if (String(user._id) === req.params.id || user.role === 1) {
      next();
    } else {
      return res.status(400).json({
        msg: "Only Owner of Account and Admin can access this Resource.",
      });
    }
  } catch (err) {
    return res.status(500).json({msg: err.message});
  }
};

module.exports = checkValidUserOrAdmin;
