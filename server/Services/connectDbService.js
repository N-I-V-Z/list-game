const mongoose = require("mongoose");

async function connectDb() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/list_game");
    console.log("Connect database success");
  } catch (error) {
    console.log("Connect database fail: ", error);
  }
}

module.exports = connectDb;