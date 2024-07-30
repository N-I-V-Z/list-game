const router = require("express").Router();
const userController = require("../Controllers/userController")

router.post("/register", userController.register);

router.post("/login", userController.login);

router.post("/refresh-token", userController.refresh_token);
  
module.exports = router;
