const express = require("express");
const CusineType = require("../models/cusineTypeModel"); // Ensure the path to the model is correct

const router = express.Router();

router.post("/cuisine-types", async (req, res) => {
  try {
    const { name, description, status, createdBy } = req.body;

    // Create a new CusineType document
    const newCuisineType = new CusineType({
      name,
      description,
      status,
      createdBy,
    });

    const savedCuisineType = await newCuisineType.save();

    res.status(201).json({
      message: "Cuisine type created successfully",
      data: savedCuisineType,
    });
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(400)
        .json({ message: "Cuisine type with this name already exists" });
    } else {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
});

router.get("/cuisine-types", async (req, res) => {
  try {
    const cuisineTypes = await CusineType.find();
    res.status(200).json({
      message: "Cuisine types retrieved successfully",
      data: cuisineTypes,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/cuisine-types/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cuisineType = await CusineType.findById(id);

    if (!cuisineType) {
      return res.status(404).json({ message: "Cuisine type not found" });
    }

    res.status(200).json({
      message: "Cuisine type retrieved successfully",
      data: cuisineType,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/cuisine-types/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, updatedBy } = req.body;

    const updatedCuisineType = await CusineType.findByIdAndUpdate(
      id,
      { name, description, status, updatedBy },
      { new: true, runValidators: true }
    );

    if (!updatedCuisineType) {
      return res.status(404).json({ message: "Cuisine type not found" });
    }

    res.status(200).json({
      message: "Cuisine type updated successfully",
      data: updatedCuisineType,
    });
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(400)
        .json({ message: "Cuisine type with this name already exists" });
    } else {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
});

router.delete("/cuisine-types/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCuisineType = await CusineType.findByIdAndDelete(id);

    if (!deletedCuisineType) {
      return res.status(404).json({ message: "Cuisine type not found" });
    }

    res.status(200).json({
      message: "Cuisine type deleted successfully",
      data: deletedCuisineType,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
