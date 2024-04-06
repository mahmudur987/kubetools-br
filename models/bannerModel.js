const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bannerSchema = new Schema({
  index: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
});

bannerSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();
    const indexToUpdate = update.$set && update.$set.index;

    // Check if the update operation involves the 'index' field
    if (indexToUpdate !== undefined) {
      // Parse the new index value to ensure it's a valid number
      const newIndex = parseFloat(indexToUpdate);
      if (isNaN(newIndex)) {
        throw new Error("Invalid index value");
      }

      // Get the old index value from the document query conditions
      const oldIndex = this._conditions.index;

      // Check if the oldIndex and newIndex are different
      if (oldIndex !== newIndex) {
        // Determine the direction of index shift
        const shiftBy = oldIndex < newIndex ? 1 : -1;

        // Update indexes of other banners based on the change
        await this.model.updateMany(
          {
            index: {
              $gte: Math.min(oldIndex, newIndex),
              $lte: Math.max(oldIndex, newIndex),
            },
          },
          { $inc: { index: shiftBy } }
        );
      }
    }
    next();
  } catch (error) {
    next(error); // Pass any errors to the next middleware or error handler
  }
});

const Item = mongoose.model("banner", bannerSchema);

module.exports = Item;
