const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

const orderCtrl = {
  getOrders: async (req, res) => {
    try {
      const orders = await Order.find()
        .populate("user", "_id username email mobileNumber image")
        .populate("orderItems.product");
      res.json(orders);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  getOrder: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate("user", "_id username email mobileNumber image")
        .populate("orderItems.product");
      if (!order)
        return res.status(400).json({msg: "This Order doest not Exists."});
      res.json(order);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  createOrder: async (req, res) => {
    try {
      const {
        user,
        orderItems,
        shippingAddress,
        paymentType,
        orderStatus,
        paymentResult,
      } = req.body;
      let totalPrices = [];
      let quantitys = [];
      for (let i = 0; i < orderItems.length; i++) {
        const price = await Product.findById(orderItems[i].product).select(
          "price -_id"
        );
        quantitys.push(orderItems[i].quantity);
        totalPrices.push(price.price);
      }
      let price = 0;
      let taxPrice;
      let shippingPrice;
      let totalPrice;
      for (let i = 0; i < totalPrices.length; i++) {
        let num = Number(totalPrices[i]) * Number(quantitys[i]);
        price += num;
        taxPrice = (18 / 100) * price;
        shippingPrice = (15 / 100) * price;
        totalPrice = price + taxPrice + shippingPrice;
      }
      console.log(
        `price : ${price}, tax price: ${taxPrice}, shipping price : ${shippingPrice}, total price : ${totalPrice}`
      );
      const cart = [];
      await User.findByIdAndUpdate(req.user.id, {cart: cart}, {new: true});
      const newOrder = new Order({
        user,
        orderItems,
        shippingAddress,
        paymentType,
        orderStatus,
        paymentResult,
        price,
        taxPrice,
        shippingPrice,
        totalPrice,
      });
      await newOrder.save();
      res.json({msg: "Order Added"});
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  updateOrder: async (req, res) => {
    try {
      const {orderStatus, isPaid, isDeliverd} = req.body;
      let paidAt = Date.now();
      let deliverAt = Date.now();
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        {orderStatus, isPaid, paidAt, isDeliverd, deliverAt},
        {new: true}
      );
      if (!order) return res.status(400).json({msg: "Order doest not Exists."});
      return res.status(400).json(order);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  deleteOrder: async (req, res) => {
    try {
      await Order.findByIdAndDelete(req.params.id);
      res.json({msg: "Order Deleted."});
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  getUserOrder: async (req, res) => {
    try {
      const order = await Order.find({user: req.user.id})
        .populate("user", "_id username email mobileNumber image")
        .populate("orderItems.product");
      if (!order)
        return res.status(400).json({msg: "This Order doest not Exists."});
      res.json(order);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
};

module.exports = orderCtrl;
