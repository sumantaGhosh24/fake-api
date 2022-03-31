const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: Object,
      default:
        "https://res.cloudinary.com/dzqgzsnoc/image/upload/v1648527265/fakeapi/vcu0dunmmyxjrdqjuxvy.jpg",
    },
    dob: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    cart: {
      type: Array,
      product: {type: mongoose.Schema.Types.ObjectId, ref: "Product"},
      quantity: {type: Number},
    },
    status: {
      type: String,
      default: "active",
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  {timestamp: true}
);

userSchema.index({firstName: "text", lastName: "text", username: "text"});

const User = mongoose.model("User", userSchema);

User.createIndexes({firstName: "text", lastName: "text", username: "text"});

module.exports = User;
