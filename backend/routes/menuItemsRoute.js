const express = require("express");
const router = express.Router();
const MenuItems = require("../models/menuItemsModel"); // Import the MenuItems model

// Create a Menu Item
router.post("/menu-items", async (req, res) => {
  try {
    const menuItem = new MenuItems(req.body);
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Menu Items
router.get("/menu-items", async (req, res) => {
  try {
    const menuItems = await MenuItems.find()
      .populate("menu") // Populate Menu reference
      .populate("items.breakfast.dishId items.breakfast.createdBy")
      .populate("createdBy");
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Menu Items by Date and Menu ID
router.get("/menu-items/:menuId/:date", async (req, res) => {
  const { menuId, date } = req.params;
  try {
    const menuItems = await MenuItems.findOne({
      menu: menuId,
      date: new Date(date),
    })
      .populate("menu")
      .populate("items.breakfast.dishId items.breakfast.createdBy")
      .populate("createdBy");
    if (!menuItems)
      return res.status(404).json({ error: "Menu Item not found" });
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a Menu Item
router.put("/menu-items/:id", async (req, res) => {
  try {
    const menuItem = await MenuItems.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!menuItem)
      return res.status(404).json({ error: "Menu Item not found" });
    res.status(200).json(menuItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a Menu Item
router.delete("/menu-items/:id", async (req, res) => {
  try {
    const menuItem = await MenuItems.findByIdAndDelete(req.params.id);
    if (!menuItem)
      return res.status(404).json({ error: "Menu Item not found" });
    res.status(200).json({ message: "Menu Item deleted successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
