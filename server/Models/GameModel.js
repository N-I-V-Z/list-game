const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    game: {
        type: String,
        unique: true,
        required: true
    }
});

// ScoreModel tương tự như 1 class
const GameModel = mongoose.model('Game', GameSchema);

module.exports = GameModel;