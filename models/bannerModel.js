// models/item.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bannerSchema = new Schema({
  index: Number,
  image: { type: String, require: true },
  description: { type: String, require: true },
});

const Item = mongoose.model("banner", bannerSchema);

module.exports = Item;
