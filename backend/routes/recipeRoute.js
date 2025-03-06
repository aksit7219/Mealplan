const express = require("express");
const router = express.Router();
const Recipe = require("../models/recipeModel");

// Create a new recipe
router.post("/recipes", async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all recipes
router.get("/recipes", async (req, res) => {
  try {
    const { type,limit } = req.query; // Extract type from query parameters
    let filter = {};

    if (type) {
      if (type.startsWith("!")) {
        // If type starts with '!', use $ne to exclude that type
        filter = { type: { $ne: type.substring(1) } };
      } else {
        // Otherwise, filter by the exact type
        filter = { type };
      }
    }

    const recipes = await Recipe.find(filter).populate("restaurant").limit(limit?limit:0);
    res.status(200).json(recipes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a recipe by ID
router.get("/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("restaurant");
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a recipe
router.put("/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a recipe
router.delete("/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(200).json({ message: "Recipe deleted successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
