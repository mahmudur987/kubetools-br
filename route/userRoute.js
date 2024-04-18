const express = require("express");
const router = express.Router();
const {
  registerUser,
  logInUser,
  getUserData,
  getAllUser,
  updateUser,
  deleteUser,
} = require("../controller/userController");
const verifyToken = require("../middleware/verifyToken");
const { useRefreshToken } = require("../middleware/refreshToken");
router.route("/register").post(registerUser);
router.route("/login-user").post(logInUser);
router.route("/userData").post(verifyToken, getUserData);
router.route("/allUser").get(getAllUser);
router.route("/updateUser/:id").patch(updateUser);
router.route("/deleteUser/:id").delete(deleteUser);
router.route("/refresh-token").post(useRefreshToken);
module.exports = router;
