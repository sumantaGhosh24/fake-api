const router = require("express").Router();

const reviewCtrl = require("../controllers/reviewCtrl");
const auth = require("../middleware/auth");
const checkValidUserOrAdmin = require("../middleware/checkValidUserOrAdmin");

router.get("/reviews/:product", reviewCtrl.getReviews);

router.post("/review/:product", auth, reviewCtrl.createReview);

router.get("/review/:id", reviewCtrl.getReview);

router.put("/review/:id", auth, checkValidUserOrAdmin, reviewCtrl.updateReview);

router.delete(
  "/review/:id",
  auth,
  checkValidUserOrAdmin,
  reviewCtrl.deleteReview
);

module.exports = router;
