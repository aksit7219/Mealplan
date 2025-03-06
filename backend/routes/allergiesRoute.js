const express = require("express");
const Allergies = require("../models/allergiesModel"); // Assuming the file is named Allergies.js
const router = express.Router();

router.post("/allergies", async (req, res) => {
  try {
    const { name, description, status, createdBy } = req.body;

    // Check for required fields
    if (!name || !createdBy) {
      return res
        .status(400)
        .json({ message: "Name and Created By are required." });
    }

    // Create a new Allergies
    const newAllergies = new Allergies({
      name,
      description,
      status,
      createdBy,
    });

    const savedAllergies = await newAllergies.save();
    res.status(201).json(savedAllergies);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Allergies with this name already exists." });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/allergies", async (req, res) => {
  try {
    const allergies = await Allergies.find();
    res.status(200).json(allergies);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/allergies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const Allergies = await Allergies.findById(id);

    if (!Allergies) {
      return res.status(404).json({ message: "Allergies not found." });
    }

    res.status(200).json(Allergies);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/allergies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, updatedBy } = req.body;

    // Update the Allergies with new fields
    const updatedAllergies = await Allergies.findByIdAndUpdate(
      id,
      { name, description, status, updatedBy },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedAllergies) {
      return res.status(404).json({ message: "Allergies not found." });
    }

    res.status(200).json(updatedAllergies);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Allergies with this name already exists." });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/allergies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAllergies = await Allergies.findByIdAndDelete(id);

    if (!deletedAllergies) {
      return res.status(404).json({ message: "Allergies not found." });
    }

    res.status(200).json({ message: "Allergies deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
