const router = require("express").Router();
const scoreController = require("../Controllers/scoreController");
const {
  authorizeRoles,
  authenticateToken,
} = require("../Middleware/authMiddleware");

router.post(
  "/add-score-highest",
  authenticateToken,
  authorizeRoles(2),
  scoreController.addScoreHighest
);

router.post(
  "/add-score",
  authenticateToken,
  authorizeRoles(2),
  scoreController.addScore
);

router.post("/get-top-10-score-by-game", scoreController.getTop10ScoreByGame);

module.exports = router;
