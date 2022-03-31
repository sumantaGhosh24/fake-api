const router = require("express").Router();

const productCtrl = require("../controllers/productCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router.get("/products", productCtrl.getProducts);

router.post("/product", auth, authAdmin, productCtrl.createProduct);

router
  .route("/product/:id")
  .get(productCtrl.getProduct)
  .put(auth, authAdmin, productCtrl.updateProduct)
  .delete(auth, authAdmin, productCtrl.deleteProduct)
  .patch(auth, authAdmin, productCtrl.addImage);

module.exports = router;
