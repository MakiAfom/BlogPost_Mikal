const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  avatar: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
