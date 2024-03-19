const expressHandeller = require("express-async-handler");
const Image = require("../models/ImageModal");

const postImage = expressHandeller(async (req, res) => {
  console.log(req.body.index);
  console.log(req.file);

  try {
    if (!req.file) {
      return res.status(500).json({ err: "nofile found" });
    }
    const imagefile = Image({
      filename: req.file.filename,
      filepath: req.file.path,
    });
    const result = await imagefile.save();

    return res.send({ message: "success", data: result });
  } catch (error) {
    console.error("error", error);
  }
});

module.exports = postImage;
