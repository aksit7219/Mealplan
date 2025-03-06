const mongoose = require("mongoose");

const instructionStepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  instruction: { type: String, required: true },
  duration: String,
  tip: String,
});

const storageInstructionSchema = new mongoose.Schema({
  method: String,
  duration: String,
  container: String,
  instructions: String,
});

const recipeInstructionsSchema = new mongoose.Schema({
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    required: true,
    unique: true,
  },
  cookingMethod: {
    primary: String,
    alternative: String,
    equipment: [String],
  },
  steps: [instructionStepSchema],
  storage: {
    immediate: storageInstructionSchema,
    shortTerm: storageInstructionSchema,
    longTerm: storageInstructionSchema,
  },
});

const Ingredient = mongoose.model("Instructions", recipeInstructionsSchema);
module.exports = Ingredient;
