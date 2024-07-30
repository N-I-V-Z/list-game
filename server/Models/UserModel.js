const mongoose = require('mongoose');

// thì mongoDb là một dạng NoSQL nên sẽ không lưu trữ các dữ liệu dạng Table, 1 DB sẽ có các Collection (tương tự như Table), 1 Collection sẽ có các Document (row)

// Tạo UserSchema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    role: {
        type: Number
    }
});

// UserModel tương tự như 1 class
const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;