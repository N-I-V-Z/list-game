const gameService = require('../Services/gameService')

const addGame = async (req, res) => {
  try {
    const { game } = req.body;
    const response = await gameService.addGame(game);
    res.status(response.err === 0 ? 200 : 400).send(response);
  } catch (error) {
    console.log("Internal Server Error: ", error);
    res.status(500).send({ err: 1, mes: error.message });
  }
};

module.exports = {
  addGame,
};
