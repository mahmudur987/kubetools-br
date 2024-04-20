const mongoose = require("mongoose");

const repo = new mongoose.Schema({
  name: String,
  description: String,
  link: String,
  githubStars: String,
  publishDate: { type: Date, default: new Date() },
});
const data = new mongoose.Schema({
  index: { type: Number },
  category: {
    name: { type: String, required: true },
  },
  tools: [repo],
  publishDate: { type: Date },
});

data.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();
    const indexToUpdate = update.$set && update.$set["tools.$.index"]; // Assuming index is nested within tools array

    // Check if the update operation involves the 'index' field
    if (indexToUpdate !== undefined) {
      // Parse the new index value to ensure it's a valid number
      const newIndex = parseFloat(indexToUpdate);
      if (isNaN(newIndex)) {
        throw new Error("Invalid index value");
      }

      // Get the old index value from the document query conditions
      const oldIndex = this._conditions["tools.index"];

      // Check if the oldIndex and newIndex are different
      if (oldIndex !== newIndex) {
        // Determine the direction of index shift
        const shiftBy = oldIndex < newIndex ? 1 : -1;

        // Update indexes of other tools based on the change
        await this.model.updateMany(
          {
            "tools.index": {
              $gte: Math.min(oldIndex, newIndex),
              $lte: Math.max(oldIndex, newIndex),
            },
          },
          { $inc: { "tools.$.index": shiftBy } }
        );
      }
    }
    next();
  } catch (error) {
    next(error); // Pass any errors to the next middleware or error handler
  }
});

const Tool = mongoose.model("Tool", data);

module.exports = Tool;
