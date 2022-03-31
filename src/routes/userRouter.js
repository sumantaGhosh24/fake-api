const router = require("express").Router();

const userCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");
const checkValidUserOrAdmin = require("../middleware/checkValidUserOrAdmin");

router.get("/users", auth, authAdmin, userCtrl.getUsers);

router.get("/user/:id", auth, checkValidUserOrAdmin, userCtrl.getUser);

router.put("/user/:id", auth, checkValidUserOrAdmin, userCtrl.updateUser);

router.delete("/user/:id", auth, checkValidUserOrAdmin, userCtrl.deleteUser);

router.post("/register", userCtrl.register);

// register verification route

router.post("/login", userCtrl.login);

// login two step authentication route

router.get("/logout", userCtrl.logout);

router.get("/refresh_token", userCtrl.refresh_token);

// reset password route

router.get("/getcart", auth, userCtrl.getCart);

router.patch("/addcart", auth, userCtrl.addCart);

module.exports = router;
