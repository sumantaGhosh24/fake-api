const Category = require("../models/categoryModel");
const Product = require("../models/productModel");

function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }
  for (let cat of category) {
    categoryList.push({
      _id: cat._id,
      name: cat.name,
      parentId: cat.parentId,
      image: cat.image,
      createdBy: cat.createdBy,
      children: createCategories(categories, cat._id),
    });
  }
  return categoryList;
}

const categoryCtrl = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find().populate(
        "createdBy",
        "_id username email mobileNumber image"
      );
      const categoryList = createCategories(categories);
      res.json({categoryList});
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  createCategory: async (req, res) => {
    try {
      const {name, image, parentId} = req.body;
      const createdBy = req.user.id;
      const category = await Category.findOne({name});
      if (category)
        return res.status(400).json({msg: "This Category Already Created."});
      const newCategory = new Category({
        name: name.toLowerCase(),
        image,
        parentId,
        createdBy,
      });
      await newCategory.save();
      res.json({msg: "Category Created."});
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const products = await Product.findOne({category: req.params.id});
      if (products)
        return res.status(400).json({
          msg: "Please Delete All Product of this Category First.",
        });
      const cat = await Category.find({parentId: req.params.id});
      if (cat.length === 1)
        return res
          .status(400)
          .json({msg: "Please Delete all sub Category of this Category."});
      await Category.findByIdAndDelete(req.params.id);
      res.json({msg: "Category Deleted."});
    } catch (err) {
      return res.status(500).json({msg: err.message});
    }
  },
  updateCategory: async (req, res) => {
    try {
      const {name, image, parentId} = req.body;
      const cat = {name, image};
      if (parentId !== "") {
        cat.parentId = parentId;
      }
      const category = await Category.findByIdAndUpdate(req.params.id, cat, {
        new: true,
      });
      if (!category)
        return res.status(400).json({msg: "This Category Does Not Exists."});
      return res.status(200).json(category);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
};

module.exports = categoryCtrl;
