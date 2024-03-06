const jwt = require("jsonwebtoken");
const jwt_secret =
  "f8b6e4857fa015369fe4512a2d05f73fd297f79884936e93a62e27c36df4e1ec771e04359972304d56438e572b93737d34bb8ba05e80b0cd7ef6b80eb9a4dd2b";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  jwt.verify(token, jwt_secret, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Your Time is expire please logIn again" });
    }

    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
