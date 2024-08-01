const mongoose = require('mongoose');

// Tạo ScoreSchema
const ScoreSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        ref: 'User' // Tham chiếu đến collection 'User'
    },
    score: {
        type: Number,
        required: true
    },
    game: {
        type: String,
        ref: 'Game'
    }
});

// ScoreModel tương tự như 1 class
const ScoreModel = mongoose.model('Score', ScoreSchema);

module.exports = ScoreModel;