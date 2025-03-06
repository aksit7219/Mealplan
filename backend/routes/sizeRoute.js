const express = require("express");
const Sizes = require("../models/sizesModel");
const router = express.Router();

router.post("/sizes", async (req, res) => {
  const { name, description, status, createdBy } = req.body;

  try {
    const newSize = new Sizes({
      name,
      description,
      status,
      createdBy, // Assuming `req.user` contains authenticated user details
    });

    await newSize.save();
    res
      .status(201)
      .json({ message: "Size created successfully", size: newSize });
  } catch (error) {
    res.status(500).json({ message: error, error });
  }
});

router.put("/sizes/:id", async (req, res) => {
  const { name, description, status } = req.body;

  try {
    const updatedSize = await Sizes.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        status,
        updatedBy: req.user._id, // Set the admin making the update
      },
      { new: true } // Return the updated document
    );

    if (!updatedSize) {
      return res.status(404).json({ message: "Size not found" });
    }

    res
      .status(200)
      .json({ message: "Size updated successfully", size: updatedSize });
  } catch (error) {
    res.status(500).json({ message: "Error updating size", error });
  }
});

router.get("/sizes", async (req, res) => {
  try {
    const sizes = await Sizes.find();
    res.status(200).json({ data: sizes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching sizes", error });
  }
});

router.delete("/sizes/:id", async (req, res) => {
  try {
    const deletedSize = await Sizes.findByIdAndDelete(req.params.id);

    if (!deletedSize) {
      return res.status(404).json({ message: "Size not found" });
    }

    res.status(200).json({ message: "Size deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting size", error });
  }
});
module.exports = router;
