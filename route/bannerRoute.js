// routes/itemRoutes.js
const express = require("express");
const router = express.Router();
const {
  getItems,
  createItem,
  deleteItem,
  getItemById,
  updateItem,
} = require("../controller/bannerController");

// Routes

router.route("/").get(getItems).post(createItem);

router.get("/items/:id", getItemById);
router.put("/items/:id", updateItem);
router.delete("/items/:id", deleteItem);

module.exports = router;
