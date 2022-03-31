const Review = require("../models/reviewModel");

const reviewCtrl = {
  getReviews: async (req, res) => {
    try {
      const reviews = await Review.find({product: req.params.product}).populate(
        "user",
        "username email image"
      );
      if (!reviews) {
        return res.status(400).json({msg: "No Review Exists."});
      }
      return res.status(200).json(reviews);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  getReview: async (req, res) => {
    try {
      const review = await Review.findById(req.params.id).populate(
        "user",
        "username email image"
      );
      if (!review)
        return res.status(400).json({msg: "This Review doest not Exists."});
      return res.status(200).json(review);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  createReview: async (req, res) => {
    try {
      const {comment, rating} = req.body;
      const product = req.params.product;
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
      const newReview = new Review({
        product,
        user,
        comment: comment.toLowerCase(),
        rating: Number(rating),
      });
      await newReview.save();
      return res.status(200).json(newReview);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  updateReview: async (req, res) => {
    try {
      const {comment, rating} = req.body;
      const review = await Review.findByIdAndUpdate(
        req.params.id,
        {comment: comment.toLowerCase(), rating: Number(rating)},
        {new: true}
      );
      if (!review)
        return res.status(400).json({msg: "This Review doest not Exists."});
      return res.status(200).json(review);
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
  deleteReview: async (req, res) => {
    try {
      const review = await Review.findByIdAndDelete(req.params.id);
      if (!review)
        return res.status(400).json({msg: "This Review doest not Exists."});
      return res.status(200).json({msg: "Review Delete Successful."});
    } catch (error) {
      return res.status(500).json({msg: error.message});
    }
  },
};

module.exports = reviewCtrl;
