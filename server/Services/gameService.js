const GameModel = require("../Models/GameModel");


const addGame = async (game) => {
  try {
    GameModel.create({
        game: game
    })
    return { err: 0 };
  } catch (error) {
    return { err: 1, mes: error.message }; // Trả về lỗi nếu có
  }
};

module.exports = {
    addGame
};
