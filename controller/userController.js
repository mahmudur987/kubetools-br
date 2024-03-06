const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwt_secret =
  "f8b6e4857fa015369fe4512a2d05f73fd297f79884936e93a62e27c36df4e1ec771e04359972304d56438e572b93737d34bb8ba05e80b0cd7ef6b80eb9a4dd2b";

const generateAccessToken = (user) => {
  return jwt.sign({ email: user.email }, jwt_secret, { expiresIn: "1d" });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ email: user.email }, jwt_secret, { expiresIn: "30d" });
};

exports.registerUser = async (req, res) => {
  const user = req.body;
  const { name, email, password } = user;
  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.send({ status: "this email already registers" });
    }

    User.create({
      name,
      email,
      password: encryptedPassword,
    });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return res.send({ status: "ok", accessToken, refreshToken });
  } catch (error) {
    res.send({ status: "error happend" });
    console.error(error);
  }
};

exports.logInUser = async (req, res) => {
  const { name, password } = req.body;
  console.log(name);
  const user = await User.findOne({ name });
  if (!user) {
    return res.send({ status: "User Not found" });
  }
  const paswordvalid = await bcrypt.compare(password, user.password);
  if (paswordvalid) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return res.send({ status: "ok", accessToken, refreshToken });
  }
  res.send({ status: "your password not correct" });
};

exports.getuserData = async (req, res) => {
  const { email } = req.user;
  try {
    const user = await User.findOne({ email });
    res.send({ status: "ok", data: user });
  } catch (error) {
    res.send({ status: "error", message: "some Error happen" });
  }
};
