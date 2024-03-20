// models/item.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bannerSchema = new Schema({
  index: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  linkText: { type: String, required: true },
});

const Item = mongoose.model("banner", bannerSchema);

module.exports = Item;
