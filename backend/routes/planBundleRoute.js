const express = require("express");
const router = express.Router();
const PlanBundles = require("../models/planBundlesModel"); // Ensure to import the PlanBundles model

// Create a Plan Bundle
router.post("/planbundles", async (req, res) => {
  try {
    const planBundle = new PlanBundles(req.body);
    await planBundle.save();
    res.status(201).json(planBundle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Plan Bundles
router.get("/planbundles", async (req, res) => {
  try {
    const planBundles = await PlanBundles.find().populate("mealPlan"); // Populating mealPlan reference
    res.status(200).json(planBundles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a Plan Bundle by ID
router.get("/planbundles/:id", async (req, res) => {
  try {
    const planBundle = await PlanBundles.findById(req.params.id).populate(
      "mealPlan"
    );
    if (!planBundle)
      return res.status(404).json({ error: "Plan Bundle not found" });
    res.status(200).json(planBundle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Find PlanBundles by MealPlan ID
router.get("/planbundles/mealplan/:mealPlanId", async (req, res) => {
  try {
    const mealPlanId = req.params.mealPlanId;

    // Find plan bundles associated with the given mealPlanId
    const planBundles = await PlanBundles.find({ mealPlan: mealPlanId });

    if (!planBundles || planBundles.length === 0) {
      return res
        .status(404)
        .json({ error: "No Plan Bundles found for this Meal Plan ID." });
    }

    // Return the found plan bundles
    res.status(200).json(planBundles);
  } catch (error) {
    // Handle any errors during the process
    res.status(500).json({ error: error.message });
  }
});

// Update a Plan Bundle
router.put("/planbundles/:id", async (req, res) => {
  try {
    const planBundle = await PlanBundles.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!planBundle)
      return res.status(404).json({ error: "Plan Bundle not found" });
    res.status(200).json(planBundle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a Plan Bundle
router.delete("/planbundles/:id", async (req, res) => {
  try {
    const planBundle = await PlanBundles.findByIdAndDelete(req.params.id);
    if (!planBundle)
      return res.status(404).json({ error: "Plan Bundle not found" });
    res.status(200).json({ message: "Plan Bundle deleted successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
