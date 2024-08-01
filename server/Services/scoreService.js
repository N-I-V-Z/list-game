const GameModel = require("../Models/GameModel");
const ScoreModel = require("../Models/ScoreModel");
const UserModel = require("../Models/UserModel");

const getScoreByName = async (username, game) => {
  try {
    const response = await ScoreModel.findOne({ username, game });
    return { err: response ? 0 : 2, data: response ?? null };
  } catch (error) {
    return { err: 1, mes: error.message }; // Trả về lỗi nếu có
  }
};

const addScore = async (username, game, score) => {
  try {
    // kiểm tra user có tồn tại không
    const userExists = await UserModel.exists({ username });
    if (!userExists) {
      return { err: 1, mes: "User does not exist" };
    }

    // kiểm tra game có tồn tại không
    const gameExists = await GameModel.exists({ game });
    if (!gameExists) {
      return { err: 1, mes: "Game does not exist" };
    }
    const response = await ScoreModel.create({
      username,
      game,
      score,
    });

    return { err: response ? 0 : 1, data: response ?? null };
  } catch (error) {
    return { err: 1, mes: error.message };
  }
};

const updateScore = async (username, game, score) => {
  try {
    const response = await ScoreModel.updateOne(
      { username, game }, // Điều kiện tìm kiếm
      { $set: { score } } // giá trị update
    );

    return { err: response.modifiedCount > 0 ? 0 : 1, data: response };
  } catch (error) {
    return { err: 1, mes: error.message }; // Trả về lỗi nếu có
  }
};

const getTop10ScoreByGame = async (game) => {
  try {
    const response = await ScoreModel.find({ game }) // Tìm tất cả tài liệu với game cụ thể
      .sort({ score: -1 }) // Sắp xếp theo score giảm dần
      .limit(10); // Giới hạn kết quả trả về là 10

    return { err: response ? 0 : 1, data: response ?? null };
  } catch (error) {
    return { err: 1, mes: error.message };
  }
};

module.exports = {
  getScoreByName,
  addScore,
  updateScore,
  getTop10ScoreByGame,
};
