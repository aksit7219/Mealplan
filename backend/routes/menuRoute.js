const express = require("express");
const router = express.Router();
const Menu = require("../models/menuModel"); // Import the Menu model

// Create a new Menu
router.post("/menu", async (req, res) => {
  try {
    const menu = new Menu(req.body);
    await menu.save();
    res.status(201).json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all Menus
router.get("/menu", async (req, res) => {
  try {
    const menus = await Menu.find().populate("mealplans").populate("createdBy");
    res.status(200).json(menus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a Menu by ID
router.get("/menu/:id", async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id)
      .populate("mealplans")
      .populate("createdBy");
    if (!menu) return res.status(404).json({ error: "Menu not found" });
    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a Menu by ID
router.put("/menu/:id", async (req, res) => {
  try {
    const menu = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated menu
      runValidators: true, // Ensure validations are run
    });
    if (!menu) return res.status(404).json({ error: "Menu not found" });
    res.status(200).json(menu);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a Menu by ID
router.delete("/menu/:id", async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) return res.status(404).json({ error: "Menu not found" });
    res.status(200).json({ message: "Menu deleted successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
