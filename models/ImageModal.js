const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = Schema({
  filename: { type: String, require: true },
  filepath: { type: String, require: true },
});

const Image = mongoose.model("Image", ImageSchema);
module.exports = Image;
