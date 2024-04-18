const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, unique: true },
  password: { type: String, require: true },
  role: { type: String, require: true },
  joinDate: { type: Date, default: new Date() },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
