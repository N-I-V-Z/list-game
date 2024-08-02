const { response } = require("express");
const scoreService = require("../Services/scoreService");

const addScoreHighest = async (req, res) => {
  try {
    const { username, game, score } = req.body;
    const getScore = await scoreService.getScoreByName(username, game);

    // nếu người chơi chưa có điểm thì thêm mới
    if (getScore.err === 2) {
      const response = await scoreService.addScore(
        username,
        game,
        score
      );
      res.status(response.err === 0 ? 200 : 500).send("Add success");
    } // nếu đã có điểm cũ mà điểm mới lớn hơn thì update lại
    else if (getScore.err === 0 && score > getScore.data.score) {
      const response = await scoreService.updateScore(username, game, score);
      res.status(response.err === 0 ? 200 : 500).send("Update success");
    } // nếu điểm mới nhỏ hơn thì không thay đổi
    else res.status(200).send("No change");
  } catch (error) {
    console.log("Internal Server Error: ", error);
    res.status(500).send({ err: 1, mes: error.message });
  }
};

const addScore = async (req, res) => {
  try {
    const { username, game, score } = req.body;
    const getScore = await scoreService.getScoreByName(username, game);

    if (getScore.err === 2) {
      const response = await scoreService.addScore(
        username,
        game,
        score
      );
      res.status(response.err === 0 ? 200 : 500).send("Add success");
    } else {
      const response = await scoreService.updateScore(
        username,
        game,
        getScore.data.score + score
      );
      res.status(response.err === 0 ? 200 : 500).send("Update success");
    }
  } catch (error) {
    console.log("Internal Server Error: ", error);
    res.status(500).send({ err: 1, mes: error.message });
  }
};

const getTop10ScoreByGame = async (req, res) => {
  try {
    const { game } = req.body;
    const response = await scoreService.getTop10ScoreByGame(game);
    res.status(200).send(response);
  } catch (error) {
    console.log("Internal Server Error: ", error);
    res.status(500).send({ err: 1, mes: error.message });
  }
};

module.exports = {
  addScoreHighest,
  getTop10ScoreByGame,
  addScore,
};
