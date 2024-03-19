// controllers/itemController.js
const Item = require("../models/bannerModel");
const expressHandeller = require("express-async-handler");
exports.getItems = async (req, res) => {
  try {
    const result = await Item.find();
    return res.send({ message: "success", data: result });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.createItem = expressHandeller(async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  // const item = new Item(data);

  try {
    // const result = await item.save();
    const result = "result";
    return res.json({ message: "success", data: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item == null) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
