const express = require("express");
const upload = require("../upload");
const postImage = require("../controller/imageController");
const Router = express.Router();

Router.post("/", upload.single("image"), postImage);

module.exports = { Router };
