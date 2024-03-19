// routes/itemRoutes.js
const express = require("express");
const router = express.Router();
const {
  getItems,
  createItem,
  deleteItem,
} = require("../controller/bannerController");

// Routes
router.post("/", createItem);

router.route("/").get(getItems);

// router.get("/items/:id", itemController.getItemById);
// router.put("/items/:id", itemController.updateItem);
router.delete("/items/:id", deleteItem);

module.exports = router;
