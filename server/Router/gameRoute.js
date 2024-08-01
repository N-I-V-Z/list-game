const router = require("express").Router();
const gameController = require("../Controllers/gameController")

router.post("/add-game", gameController.addGame);
  
module.exports = router;
