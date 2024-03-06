const mongoose = require("mongoose");

const userScehma = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  joinDate: { type: Date, default: new Date() },
});

const User = mongoose.model("User", userScehma);

module.exports = User;
