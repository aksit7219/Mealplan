const express = require("express");
const router = express.Router();
const MealPlan = require("../models/mealplanModel"); // Ensure to import the MealPlan model

// Create a Meal Plan
router.post("/mealplans", async (req, res) => {
  try {
    const mealPlan = new MealPlan(req.body);
    await mealPlan.save();
    res.status(201).json(mealPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Meal Plans
router.get("/mealplans", async (req, res) => {
  try {
    const mealPlans = await MealPlan.find().populate("restaurant");
    res.status(200).json(mealPlans);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a Meal Plan by ID
router.get("/mealplans/:id", async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id).populate("restaurant");
    if (!mealPlan)
      return res.status(404).json({ error: "Meal Plan not found" });
    res.status(200).json(mealPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a Meal Plan
router.put("/mealplans/:id", async (req, res) => {
  try {
    const mealPlan = await MealPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!mealPlan)
      return res.status(404).json({ error: "Meal Plan not found" });
    res.status(200).json(mealPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a Meal Plan
router.delete("/mealplans/:id", async (req, res) => {
  try {
    const mealPlan = await MealPlan.findByIdAndDelete(req.params.id);
    if (!mealPlan)
      return res.status(404).json({ error: "Meal Plan not found" });
    res.status(200).json({ message: "Meal Plan deleted successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
