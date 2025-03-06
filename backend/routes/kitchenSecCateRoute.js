const express = require("express");
const router = express.Router();
const KitchenSectionCategorie = require("../models/kitchenSectionCategorieModel");

router.post("/kitchen-category", async (req, res) => {
  try {
    const { name, description, createdBy } = req.body;

    // Create a new Kitchen Section Category
    const newCategory = new KitchenSectionCategorie({
      name,
      description,
      createdBy,
    });

    const savedCategory = await newCategory.save();
    res.status(201).json({
      message: "Kitchen section category created successfully",
      data: savedCategory,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error (for unique constraints)
      res.status(400).json({ message: "Category name must be unique" });
    } else {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  }
});

router.get("/kitchen-category", async (req, res) => {
  try {
    const categories = await KitchenSectionCategorie.find()
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");
    res
      .status(200)
      .json({ message: "Categories retrieved successfully", data: categories });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.get("/kitchen-category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const category = await KitchenSectionCategorie.findById(id)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res
      .status(200)
      .json({ message: "Category retrieved successfully", data: category });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.put("/kitchen-category/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, updatedBy } = req.body;

    // Find the category and update it
    const updatedCategory = await KitchenSectionCategorie.findByIdAndUpdate(
      id,
      { name, description, status, updatedBy, updatedAt: new Date() },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error (for unique constraints)
      res.status(400).json({ message: "Category name must be unique" });
    } else {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  }
});

router.delete("/kitchen-category/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await KitchenSectionCategorie.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
