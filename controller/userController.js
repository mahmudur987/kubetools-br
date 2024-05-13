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
  const { name, email, password, role } = user;
  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.send({ status: "This email already registered", data: null });
    }

    User.create({
      name,
      email,
      password: encryptedPassword,
      role,
    });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return res.send({
      status: "User Created Successfully",
      accessToken,
      refreshToken,
      data: null,
    });
  } catch (error) {
    res.send({ status: "error happened", data: null });
    console.error(error);
  }
};

exports.logInUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.send({ status: "User Not found" });
  }
  const passwordValid = await bcrypt.compare(password, user.password);
  if (passwordValid) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return res.send({ status: "ok", accessToken, refreshToken });
  }
  res.send({ status: "your password is not correct" });
};

exports.getUserData = async (req, res) => {
  const { email } = req.user;
  try {
    const user = await User.findOne({ email });
    res.send({ status: "ok", data: user });
  } catch (error) {
    res.send({ status: "error", message: "some Error happen" });
  }
};
exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.send({ status: "ok", data: users });
  } catch (error) {
    res.send({ status: "error", message: "some Error happen" });
  }
};
exports.updateUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (password) {
    const encryptedPassword = await bcrypt.hash(password, 10);

    try {
      const updatedItem = await User.findByIdAndUpdate(req.params.id, {
        name,
        email,
        password: encryptedPassword,
      });
      res.json({ status: "User updated successfully", data: updatedItem });
    } catch (err) {
      res.status(400).json({ status: err.message });
    }
  } else {
    try {
      const updatedItem = await User.findByIdAndUpdate(req.params.id, {
        name,
        email,
      });
      res.json({ status: "User updated successfully", data: updatedItem });
    } catch (err) {
      res.status(400).json({ status: err.message });
    }
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    res.json({ status: "User delete successfully", data: result });
  } catch (err) {
    res.status(400).json({ status: err.message });
  }
};
