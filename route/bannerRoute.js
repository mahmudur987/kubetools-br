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
router
  .route("/items/:id")
  .get(getItemById)
  .patch(updateItem)
  .delete(deleteItem);

module.exports = router;
