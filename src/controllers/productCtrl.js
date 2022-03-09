const {APIFeatures} = require("../lib/features");
const Products = require("../models/productModels");

const productCtrl = {
  getProducts: async (req, res) => {
    try {
      const features = new APIFeatures(Products.find(), req.query)
        .paginating()
        .sorting()
        .searching()
        .filtering();
      const result = await Promise.allSettled([
        features.query,
        Products.countDocuments(),
      ]);
      const products = result[0].status === "fulfilled" ? result[0].value : [];
      const count = result[1].status === "fulfilled" ? result[1].value : 0;
      return res.status(200).json({products, count});
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  getProduct: async (req, res) => {
    try {
      const product = await Products.findById(req.params.id);
      if (!product) {
        return res.status(400).json({msg: "This Product Does Not Exists."});
      }
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  createProduct: async (req, res) => {
    try {
      const {title, price, description, category, image} = req.body;
      const newProduct = new Products({
        title,
        price,
        description,
        category,
        image,
      });
      await newProduct.save();
      return res.status(200).json(newProduct);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  updateProduct: async (req, res) => {
    try {
      const {title, price, description, category, image} = req.body;
      const product = await Products.findByIdAndUpdate(
        req.params.id,
        {
          title,
          price,
          description,
          category,
          image,
        },
        {new: true}
      );
      if (!product)
        return res.status(400).json({msg: "This Product Does Not Exists."});
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const product = await Products.findByIdAndDelete(req.params.id);
      if (!product)
        return res.status(400).json({msg: "This Product Does Not Exists."});
      return res.status(200).json({msg: "Product Delete Successful."});
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
};

module.exports = productCtrl;
