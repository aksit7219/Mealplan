const mongoose = require("mongoose");

// Ingredient Schema
const IngredientSchema = new mongoose.Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    required: true,
    default: "66c03948cc71db43afec7dfc",
  },
  grams: { type: Number, default: 100 },
  rawIngredients: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RawIngredient",
    default: null, // Allows for ingredients that are not sub-recipes
  },
  subRecipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    default: null, // Allows for ingredients that are not sub-recipes
  },
});

// Models
const Ingredient = mongoose.model("Ingredient", IngredientSchema);
module.exports = Ingredient;
