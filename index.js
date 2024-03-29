const express = require("express");
const app = express();
const port = process.env.Port || 5000;
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoute = require("./route/userRoute");
const bannerRoute = require("./route/bannerRoute");
const imageRoute = require("./route/ImageRoute");
const Tool = require("./models/toolsModel");
const Email = require("./models/emailModel");

// middlewere
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({ extended: false }));
const uri =
  "mongodb+srv://dbuser1:EoOuSreaLonoEGYH@cluster0.1r7hwr5.mongodb.net/kubetools?retryWrites=true&w=majority";

// mongodb connected
mongoose
  .connect(uri, {
    useNewUrlParser: true,
  })
  .then(() => console.log("connected to database"))
  .catch((e) => console.error(e));

// user route
app.use("/user", userRoute);
app.use("/banner", bannerRoute);
app.use("/image", imageRoute.Router);
// tools routes

// email handle

app.post("/email", async (req, res) => {
  const data = req.body;

  try {
    const result = await Email.create(data);

    res.json({ message: "success", data: result });
  } catch (error) {
    res.status(500).json({ message: "error.message", data: error });
  }
});
app.get("/email", async (req, res) => {
  try {
    const result = await Email.find();

    res.json({ message: "success", data: result });
  } catch (error) {
    res.status(500).json({ message: "error.message", data: error });
  }
});
app.delete("/email/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Email.findByIdAndDelete(id);

    res.json({ message: "success", data: result });
  } catch (error) {
    res.status(500).json({ message: "error.message", data: error });
  }
});

// getCategory
app.get("/categories", async (req, res) => {
  try {
    const tools = await Tool.find().sort({ index: 1 });
    const categories = tools.map((x) => {
      return { category: x.category.name, _id: x._id, index: x.index };
    });
    res.json({ message: "success", data: categories });
  } catch (error) {
    res.status(500).json({ message: "error.message", data: error });
  }
});
// delete all categories

app.delete("/deletecategory/:categoryId", async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Delete the category
    const deletedCategory = await Tool.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete all tools associated with the category
    await Tool.deleteMany({ "category._id": categoryId });

    res.json({ message: "Category and associated tools deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Error deleting category", error: error });
  }
});

// get single toolbar
app.get("/tools/:id", async (req, res) => {
  try {
    const tools = await Tool.findById(req.params.id);
    res.json({ message: "success", data: tools });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
// get all tools with all category
app.get("/tools", async (req, res) => {
  try {
    const tools = await Tool.find().populate("category", "name");
    res.json({ message: "success", data: tools });
  } catch (error) {
    res.status(500).json({ message: "error.message", data: error });
  }
});

// post  tools category
app.post("/tool", async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const result = await Tool.create(data);
    res.send({ message: "post successfully", data: result });
  } catch (error) {
    res.send({ message: "post successfully", data: error });
  }
});
// post tools
app.post("/addnewtool/:id", async (req, res) => {
  const categoryId = req.params.id;
  const newTool = req.body;

  console.log(categoryId, newTool);
  try {
    const result = await Tool.findOneAndUpdate(
      { _id: categoryId },
      { $push: { tools: newTool } },
      { new: true }
    );

    console.log("Tool updated successfully:", result);
    res.send({ message: "post successfully", data: result });
  } catch (error) {
    console.error("Error updating tool:", error);
    res.status(500).send({ message: "Error Happen", data: error });
  }
});

// update a tool

app.patch("/updateCategory/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  const { name, index } = req.body;

  try {
    let result;
    if (name !== undefined && index !== undefined) {
      result = await Tool.findOneAndUpdate(
        { _id: categoryId },
        { $set: { "category.name": name, index: index } },
        { new: true }
      );
    } else if (name !== undefined) {
      result = await Tool.findOneAndUpdate(
        { _id: categoryId },
        { $set: { "category.name": name } },
        { new: true }
      );
    } else if (index !== undefined) {
      result = await Tool.findOneAndUpdate(
        { _id: categoryId },
        { $set: { index: index } },
        { new: true }
      );
    }

    if (result) {
      res.send({ message: "Tool updated successfully", data: result });
    } else {
      res.status(404).send({ message: "Category or tool not found" });
    }
  } catch (error) {
    console.error("Error updating tool:", error);
    res.status(500).send({ message: "Error updating tool", error: error });
  }
});

app.patch("/updatetool/:categoryId/:toolId", async (req, res) => {
  const { categoryId, toolId } = req.params;
  const updatedTool = req.body;
  try {
    const result = await Tool.findOneAndUpdate(
      { _id: categoryId, "tools._id": toolId },
      { $set: { "tools.$": updatedTool } },
      { new: true }
    );
    if (result) {
      console.log("Tool updated successfully:", result);
      res.send({ message: "Tool updated successfully", data: result });
    } else {
      console.log("Category or tool not found");
      res.status(404).send({ message: "Category or tool not found" });
    }
  } catch (error) {
    console.error("Error updating tool:", error);
    res.status(500).send({ message: "Error updating tool", error: error });
  }
});

// delete a tool
app.delete("/deletetool/:categoryId/:toolId", async (req, res) => {
  const { categoryId, toolId } = req.params;

  try {
    const result = await Tool.findOneAndUpdate(
      { _id: categoryId },
      { $pull: { tools: { _id: toolId } } },
      { new: true }
    );

    if (result) {
      console.log("Tool deleted successfully:", result);
      res.send({ message: "Tool deleted successfully", data: result });
    } else {
      console.log("Category not found");
      res.status(404).send({ message: "Category not found" });
    }
  } catch (error) {
    console.error("Error deleting tool:", error);
    res.status(500).send({ message: "Error deleting tool", error: error });
  }
});
// update all tool
app.patch("/updateTool", async (req, res) => {
  try {
    // Fetch all documents from the collection
    const tools = await Tool.find();

    let i = 1;
    for (const tool of tools) {
      tool.index = i;
      i = i + 1;
      await tool.save(); // Save each document individually
    }

    res.status(200).json({ message: "Tool indexes updated successfully." });
  } catch (error) {
    console.error("Error updating tool indexes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// post all tools
app.post("/tools", async (req, res) => {
  try {
    const data = req.body;
    const result = await Tool.insertMany(data);
    res.send({ message: "post successfully", data: result });
  } catch (error) {
    res.send({ message: "Error Happen", data: error });
  }
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
