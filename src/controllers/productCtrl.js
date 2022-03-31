const {APIFeatures} = require("../lib/features");
const Product = require("../models/productModel");
const Review = require("../models/reviewModel");

const productCtrl = {
  getProducts: async (req, res) => {
    try {
      const features = new APIFeatures(
        Product.find().populate(
          "user",
          "_id username email mobileNumber image"
        ),
        req.query
      )
        .paginating()
        .sorting()
        .searching()
        .filtering();
      const result = await Promise.allSettled([
        features.query,
        Product.countDocuments(),
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
      const product = await Product.findById(req.params.id).populate(
        "user",
        "_id username email mobileNumber image"
      );
      if (!product) {
        return res.status(400).json({msg: "This Product Does Not Exists."});
      }
      const review = await Review.find({product: req.params.id});
      return res.status(200).json({product, review});
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  createProduct: async (req, res) => {
    try {
      const {
        title,
        price,
        description,
        category,
        image,
        stock,
        content,
        brand,
      } = req.body;
      const user = req.user.id;
      const errors = [];
      for (const key in req.body) {
        if (!req.body[key]) {
          errors.push(`Please Fill ${key} Field.`);
        }
      }
      if (errors.length > 0) {
        return res.status(400).json({msg: errors});
      }
      const newProduct = new Product({
        user: user,
        title: title.toLowerCase(),
        price,
        description: description.toLowerCase(),
        category,
        content: content.toLowerCase(),
        image,
        stock,
        brand,
      });
      await newProduct.save();
      return res.status(200).json(newProduct);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  updateProduct: async (req, res) => {
    try {
      const {
        title,
        price,
        description,
        category,
        image,
        stock,
        content,
        brand,
      } = req.body;
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          title: title.toLowerCase(),
          price,
          description: description.toLowerCase(),
          category,
          content: content.toLowerCase(),
          image,
          stock,
          brand,
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
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product)
        return res.status(400).json({msg: "This Product Does Not Exists."});
      return res.status(200).json({msg: "Product Delete Successful."});
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  addImage: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product)
        return res.status(400).json({msg: "Product doest not Exists."});
      await Product.findOneAndUpdate(
        {_id: req.params.id},
        {
          image: req.body.image,
        }
      );
      return res.json({msg: "Image Added."});
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
};

module.exports = productCtrl;
