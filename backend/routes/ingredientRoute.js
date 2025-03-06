const express = require("express");
const router = express.Router();
const Ingredient = require("../models/ingredientModel");
const Recipe = require("../models/recipeModel");

// Create a new Ingredient
router.post("/ingredients", async (req, res) => {
  try {
    const { recipe, customizeSize, subRecipe, rawIngredients } = req.body;

    // Find the recipe to get its sizes
    const recipeData = await Recipe.findById(recipe).populate("sizes");
    if (!recipeData) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Check if the ingredient already exists
    let ingredient = await Ingredient.findOne({
      recipe,
      $and: [
        { subRecipe: subRecipe || null }, // Match subRecipe if provided, or null
        { rawIngredients: rawIngredients || null }, // Include if subRecipe is explicitly null
      ],
    });

    if (ingredient) {
      // Iterate through the customizeSize array from the request
      for (const newSize of customizeSize) {
        const index = ingredient.customizeSize.findIndex(
          (size) => size.name === newSize.name
        );

        if (index !== -1) {
          // Update only the fields provided in the request for the matching size
          ingredient.customizeSize[index] = {
            ...ingredient.customizeSize[index]._doc, // Preserve existing fields
            ...newSize, // Override with new values
          };
        } else {
          // Add the new size if it doesn't exist
          ingredient.customizeSize.push(newSize);
        }
      }

      // Save the updated ingredient
      await ingredient.save();
      return res.status(200).json(ingredient);
    } else {
      // Create a new ingredient
      const newSizes = recipeData.sizes.map((size) => ({
        name: size.name,
        grams: 0,
        calorie: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      }));
      const newIngredient = new Ingredient({
        ...req.body,
        customizeSize: newSizes,
      });

      await newIngredient.save();
      return res.status(201).json(newIngredient);
    }
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
    ).populate("recipe");
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
