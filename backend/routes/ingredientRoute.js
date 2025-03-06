const express = require("express");
const router = express.Router();
const Ingredient = require("../models/ingredientModel");

// Create a new Ingredient
router.post("/ingredients", async (req, res) => {
  try {
    const ingredient = new Ingredient(req.body);
    await ingredient.save();
    res.status(201).json(ingredient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all Ingredients
router.get("/ingredients", async (req, res) => {
  try {
    const { recipe } = req.query;

    const filter = recipe ? { recipe } : {}; // Build the filter object based on type
    const ingredients = await Ingredient.find(filter).populate(
      "recipe subRecipe rawIngredients"
    );
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get an Ingredient by ID
router.get("/ingredients/:id", async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id).populate(
      "recipe"
    );
    if (!ingredient) {
      return res.status(404).json({ error: "Ingredient not found" });
    }
    res.status(200).json(ingredient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an Ingredient
router.put("/ingredients/:id", async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("recipe info.type");
    if (!ingredient) {
      return res.status(404).json({ error: "Ingredient not found" });
    }
    res.status(200).json(ingredient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an Ingredient
router.delete("/ingredients/:id", async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ error: "Ingredient not found" });
    }
    res.status(200).json({ message: "Ingredient deleted successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Ingredients by Recipe ID
router.get("/ingredients/recipe/:recipeId", async (req, res) => {
  try {
    const ingredients = await Ingredient.find({
      recipe: req.params.recipeId,
    }).populate("recipe info.type");
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
