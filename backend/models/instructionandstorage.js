// MongoDB Schema (models/Recipe.js)
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
  },
  preparationTime: {
    prep: String,
    cook: String,
    total: String,
  },
  cookingMethod: {
    primary: String,
    alternative: String,
    equipment: [String],
  },
  steps: [instructionStepSchema],
  criticalSteps: [
    {
      stepNumber: Number,
      warning: String,
      reason: String,
    },
  ],
  storage: {
    immediate: storageInstructionSchema,
    shortTerm: storageInstructionSchema,
    longTerm: storageInstructionSchema,
    reheating: {
      method: [String],
      instructions: {
        microwave: String,
        oven: String,
      },
    },
  },
});

// Backend API Route (routes/recipeInstructions.js)
const express = require("express");
const router = express.Router();
const RecipeInstructions = mongoose.model(
  "RecipeInstructions",
  recipeInstructionsSchema
);

router.post("/api/recipe-instructions", async (req, res) => {
  try {
    const instructions = new RecipeInstructions(req.body);
    await instructions.save();
    res.status(201).json(instructions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/api/recipe-instructions/:recipeId", async (req, res) => {
  try {
    const instructions = await RecipeInstructions.findOne({
      recipeId: req.params.recipeId,
    });
    res.json(instructions);
  } catch (error) {
    res.status(404).json({ error: "Instructions not found" });
  }
});

export default RecipeInstructions;
