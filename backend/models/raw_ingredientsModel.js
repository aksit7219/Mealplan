const mongoose = require("mongoose");

// Ingredient Schema
const RawIngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calorie: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carb: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
});

// Models
const RawIngredient = mongoose.model("RawIngredient", RawIngredientSchema);
module.exports = RawIngredient;
