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
const verifySite = require("../middleware/verifySite");
// Routes
router.route("/").get(verifySite, getItems).post(verifySite, createItem);
router
  .route("/items/:id")
  .get(verifySite, getItemById)
  .patch(verifySite, updateItem)
  .delete(verifySite, deleteItem);

module.exports = router;
