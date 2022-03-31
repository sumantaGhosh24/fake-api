const router = require("express").Router();

const orderCtrl = require("../controllers/orderCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const checkValidUserOrAdmin = require("../middleware/checkValidUserOrAdmin");

router.get("/orders", auth, checkValidUserOrAdmin, orderCtrl.getOrders);

router.post("/order", auth, orderCtrl.createOrder);

router
  .route("/order/:id")
  .get(auth, checkValidUserOrAdmin, orderCtrl.getOrder)
  .put(auth, checkValidUserOrAdmin, orderCtrl.updateOrder)
  .delete(auth, checkValidUserOrAdmin, orderCtrl.deleteOrder);

router.get("/order", auth, checkValidUserOrAdmin, orderCtrl.getUserOrder);

module.exports = router;
