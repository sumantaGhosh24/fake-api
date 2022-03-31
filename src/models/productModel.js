const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    image: {
      type: Array,
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
  },
  {timestamps: true}
);

productSchema.index({
  title: "text",
  description: "text",
  content: "text",
  brand: "text",
  price: "text",
});

const Product = mongoose.model("Product", productSchema);

Product.createIndexes({
  title: "text",
  description: "text",
  content: "text",
  brand: "text",
  price: "text",
});

module.exports = Product;
