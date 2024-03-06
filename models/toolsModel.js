const mongoose = require("mongoose");

const tool = new mongoose.Schema({
  name: String,
  description: String,
  link: String,
  githubStars: Number,
  publishDate: { type: Date, default: new Date() },
});
const toolSchema = new mongoose.Schema({
  category: {
    name: { type: String, required: true },
  },
  tools: [tool],
  publishDate: { type: Date, default: new Date() },
});
const Tool = mongoose.model("Tool", toolSchema);

module.exports = Tool;
