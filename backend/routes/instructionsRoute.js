const express = require("express");
const router = express.Router();
const Instructions = require("../models/instructionsModel");

router.post("/recipe-instructions", async (req, res) => {
  try {
    const instructions = new Instructions(req.body);
    await instructions.save();
    res.status(201).json(instructions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/recipe-instructions/:recipeId", async (req, res) => {
  try {
    const instructions = await Instructions.findOne({
      recipeId: req.params.recipeId,
    });
    res.json(instructions);
  } catch (error) {
    res.status(404).json({ error: "Instructions not found" });
  }
});

// PUT: Update existing recipe instructions by recipeId
router.put("/recipe-instructions/:recipeId", async (req, res) => {
  try {
    const updatedInstructions = await Instructions.findOneAndUpdate(
      { recipeId: req.params.recipeId },
      req.body,
      { new: true, runValidators: true } // `new: true` returns the updated document
    );

    if (!updatedInstructions) {
      return res.status(404).json({ error: "Instructions not found" });
    }

    res.json(updatedInstructions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
