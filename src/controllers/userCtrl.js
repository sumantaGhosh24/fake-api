const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const Order = require("../models/orderModel");
const {APIFeatures} = require("../lib/features");

const userCtrl = {
  getUsers: async (req, res) => {
    try {
      const features = new APIFeatures(
        User.find().populate("cart.product"),
        req.query
      )
        .paginating()
        .sorting()
        .searching()
        .filtering();
      const result = await Promise.allSettled([
        features.query,
        User.countDocuments(),
      ]);
      const users = result[0].status === "fulfilled" ? result[0].value : [];
      const count = result[1].status === "fulfilled" ? result[1].value : 0;
      res.json({users, count});
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  getUser: async (req, res) => {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("cart.product");
    if (!user) return res.status(400).json({msg: "User does not Exists."});
    const order = await Order.find({user: req.params.id});
    res.json({user, order});
  },
  updateUser: async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        username,
        email,
        mobileNumber,
        image,
        dob,
        gender,
        address,
      } = req.body;
      const errors = [];
      for (const key in req.body) {
        if (!req.body[key]) {
          errors.push(`Please Fill ${key} Field.`);
        }
      }
      if (errors.length > 0) {
        return res.status(400).json({msg: errors});
      }
      if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        return res.status(400).json({msg: "Please Enter a Valid Email."});
      }
      if (!mobileNumber.match(/^\d{10}$/)) {
        return res
          .status(400)
          .json({msg: "Please Enter a Valid Mobile Number."});
      }
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          firstName: firstName.toLowerCase(),
          lastName: lastName.toLowerCase(),
          username: username.toLowerCase(),
          email,
          mobileNumber,
          image,
          dob,
          gender,
          address,
        },
        {new: true}
      );
      if (!user) return res.status(400).json({msg: "User doest not Exists."});
      res.json(user);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user)
        return res.status(400).json({msg: "This User doest not Exists."});
      res.json({msg: "Product Deleted."});
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  register: async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        username,
        email,
        mobileNumber,
        password,
        cf_password,
        image,
        dob,
        gender,
        address,
      } = req.body;
      const errors = [];
      for (const key in req.body) {
        if (!req.body[key]) {
          errors.push(`Please Fill ${key} Field.`);
        }
      }
      if (errors.length > 0) {
        return res.status(400).json({msg: errors});
      }
      if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        return res.status(400).json({msg: "Please Enter a Valid Email."});
      }
      if (!mobileNumber.match(/^\d{10}$/)) {
        return res
          .status(400)
          .json({msg: "Please Enter a Valid Mobile Number."});
      }
      const userEmail = await User.findOne({email});
      if (userEmail) {
        return res.status(400).json({msg: "This Email Already Register."});
      }
      const userMobileNumber = await User.findOne({mobileNumber});
      if (userMobileNumber) {
        return res
          .status(400)
          .json({msg: "This Mobile Number Already Register."});
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({msg: "Password Length must be 6 Character Long."});
      }
      if (password !== cf_password) {
        return res
          .status(400)
          .json({msg: "Password and Confirm Password not Match."});
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new User({
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
        username: username.toLowerCase(),
        email,
        mobileNumber,
        password: passwordHash,
        image,
        dob,
        gender,
        address,
      });
      await newUser.save();
      const accesstoken = createAccessToken({id: newUser._id});
      const refreshtoken = createRefreshToken({id: newUser._id});
      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/api/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json({accesstoken});
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  login: async (req, res) => {
    try {
      const {email, password} = req.body;
      const user = await User.findOne({email, status: "active"});
      if (!user) return res.status(400).json({msg: "User doest not Exists."});
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({msg: "Invalid Login Credentials."});
      const accesstoken = createAccessToken({id: user._id});
      const refreshtoken = createRefreshToken({id: user._id});
      res.cookie("refreshtoken", refreshtoken, {
        httpsOnly: true,
        path: "/api/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json({accesstoken});
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  logout: (req, res) => {
    try {
      res.clearCookie("refreshtoken", {path: "/api/refresh_token"});
      res.json({msg: "Logged Out."});
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  refresh_token: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({msg: "Please Login or Register First."});
      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({msg: "Please Login or Register First."});
        const accesstoken = createAccessToken({id: user.id});
        res.json({accesstoken});
      });
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  getCart: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(400).json({msg: "User doest not Exists."});
      res.json(user.cart);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  addCart: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(400).json({msg: "User doest not Exists."});
      await User.findOneAndUpdate(
        {_id: req.user.id},
        {
          cart: req.body.cart,
        }
      );
      return res.json({msg: "Added to Cart."});
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"});
};

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"});
};

module.exports = userCtrl;
