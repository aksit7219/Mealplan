// Required modules
const express = require("express");
const router = express.Router();
const MealType = require("../models/mealTypeModel"); // Adjust path as needed

router.post("/mealtypes", async (req, res) => {
  try {
    const { name, description, status, createdBy } = req.body;

    // Create new MealType
    const mealType = new MealType({
      name,
      description,
      status,
      createdBy,
    });

    await mealType.save();
    res
      .status(201)
      .json({ message: "Meal type created successfully", data: mealType });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Meal type name must be unique" });
    } else {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
});

router.get("/mealtypes", async (req, res) => {
  try {
    const mealTypes = await MealType.find()
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");
    res.status(200).json({ data: mealTypes });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.get("/mealtypes-for-planbundle", async (req, res) => {
  try {
    const mealTypes = await MealType.find({ forPlanBundle: true })
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");
    res.status(200).json({ data: mealTypes });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/mealtypes/:id", async (req, res) => {
  try {
    const mealType = await MealType.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");
    if (!mealType)
      return res.status(404).json({ message: "Meal type not found" });
    res.status(200).json({ data: mealType });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/mealtypes/:id", async (req, res) => {
  try {
    const { name, description, status, forPlanBundle, updatedBy } = req.body;
    const updatedMealType = await MealType.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        status,
        forPlanBundle,
        updatedBy,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );
    if (!updatedMealType)
      return res.status(404).json({ message: "Meal type not found" });
    res.status(200).json({
      message: "Meal type updated successfully",
      data: updatedMealType,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "Meal type name must be unique" });
    } else {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
});

router.delete("/mealtypes/:id", async (req, res) => {
  try {
    const mealType = await MealType.findByIdAndDelete(req.params.id);
    if (!mealType)
      return res.status(404).json({ message: "Meal type not found" });
    res.status(200).json({ message: "Meal type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Export the router
module.exports = router;
