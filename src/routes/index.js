const productRouter = require("./productRouter");
const categoryRouter = require("./categoryRouter");
const userRouter = require("./userRouter");
const uploadRouter = require("./uploadRouter");
const orderRouter = require("./orderRouter");
const reviewRouter = require("./reviewRouter");

const routes = [
  productRouter,
  categoryRouter,
  userRouter,
  uploadRouter,
  orderRouter,
  reviewRouter,
];

module.exports = routes;
