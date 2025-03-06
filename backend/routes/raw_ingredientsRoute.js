const express = require("express");
const router = express.Router();
const RawIngredient = require("../models/raw_ingredientsModel");

// Create a new Ingredient
router.post("/raw-ingredients", async (req, res) => {
  try {
    const raw_ingredients = new RawIngredient(req.body);
    await raw_ingredients.save();
    res.status(201).json(raw_ingredients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all Ingredients
router.get("/raw-ingredients", async (req, res) => {
  try {
    // const limit = parseInt(req.query.limit);
    // const page = parseInt(req.query.page) || 1;
    // console.log(req.query.page)
    const raw_ingredients = await RawIngredient.find();
    res.status(200).json(raw_ingredients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get an Ingredient by ID
router.get("/raw-ingredients/:id", async (req, res) => {
  try {
    const raw_ingredients = await RawIngredient.findById(req.params.id);
    if (!raw_ingredients) {
      return res.status(404).json({ error: "Ingredient not found" });
    }
    res.status(200).json(raw_ingredients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an Ingredient
router.put("/raw-ingredients/:id", async (req, res) => {
  try {
    const raw_ingredients = await RawIngredient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!raw_ingredients) {
      return res.status(404).json({ error: "Ingredient not found" });
    }
    res.status(200).json(raw_ingredients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an Ingredient
router.delete("/raw-ingredients/:id", async (req, res) => {
  try {
    const raw_ingredients = await RawIngredient.findByIdAndDelete(
      req.params.id
    );
    if (!raw_ingredients) {
      return res.status(404).json({ error: "Ingredient not found" });
    }
    res.status(200).json({ message: "Ingredient deleted successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Ingredients by Recipe ID
router.get("/raw-ingredients/recipe/:recipeId", async (req, res) => {
  try {
    const raw_ingredients = await RawIngredient.find({
      recipe: req.params.recipeId,
    });
    res.status(200).json(raw_ingredients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
