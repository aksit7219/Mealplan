const express = require("express");
const DietType = require("../models/dietTypesModel"); // Adjust path as necessary
const router = express.Router();

// 1. Create a new diet type
router.post("/diet-types", async (req, res) => {
  try {
    const { name, description, createdBy } = req.body;
    const newDietType = new DietType({
      name,
      description,

      createdBy,
    });

    const savedDietType = await newDietType.save();
    res.status(201).json(savedDietType);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get all diet types
router.get("/diet-types", async (req, res) => {
  try {
    const dietTypes = await DietType.find();
    res.status(200).json({ data: dietTypes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get a specific diet type by ID
router.get("/diet-types/:id", async (req, res) => {
  try {
    const dietType = await DietType.findById(req.params.id);
    if (!dietType)
      return res.status(404).json({ message: "Diet type not found" });

    res.status(200).json(dietType);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Update a diet type by ID
router.put("/diet-types/:id", async (req, res) => {
  try {
    const { name, description, updatedBy } = req.body;
    const updatedDietType = await DietType.findByIdAndUpdate(
      req.params.id,
      { name, description, updatedBy },
      { new: true, runValidators: true }
    );

    if (!updatedDietType)
      return res.status(404).json({ message: "Diet type not found" });

    res.status(200).json(updatedDietType);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Delete a diet type by ID
router.delete("/diet-types/:id", async (req, res) => {
  try {
    const deletedDietType = await DietType.findByIdAndDelete(req.params.id);

    if (!deletedDietType)
      return res.status(404).json({ message: "Diet type not found" });

    res.status(200).json({ message: "Diet type deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
