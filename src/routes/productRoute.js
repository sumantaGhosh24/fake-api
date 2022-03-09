const router = require("express").Router();

const productCtrl = require("../controllers/productCtrl");
const {checkProductData} = require("../middleware/validate");

router.get("/products", productCtrl.getProducts);

router.get("/product/:id", productCtrl.getProduct);

router.post("/product", checkProductData, productCtrl.createProduct);

router.put("/product/:id", checkProductData, productCtrl.updateProduct);

router.delete("/product/:id", productCtrl.deleteProduct);

module.exports = router;
