const express = require("express");
const Dish = require("../models/dishModel");
const router = express.Router();
const upload = require("../config/multerConfig");

router.post("/adddish", async (req, res) => {
  try {
    const newDish = new Dish(req.body);

    await newDish.save();
    res.status(201).json(newDish);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/getdishes", async (req, res) => {
  try {
    const dishes = await Dish.find(); // Fetch all users
    res.send({ success: true, data: dishes });
  } catch (error) {
    res.status(500).json({ error: "erro in get dishes api " });
  }
});

router.put("/adddish/:id", async (req, res) => {
  try {
    const dish = await Dish.findById({ _id: req.params.id });
    if (!dish) {
      return res.status(404).send();
    }

    Object.keys(req.body).forEach((key) => (dish[key] = req.body[key]));
    await dish.save();
    res.send(dish);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a Meal dish
router.delete("/adddish/:id", async (req, res) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);
    if (!dish) return res.status(404).json({ error: "dish not found" });
    res.status(200).json({ message: "dish deleted successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
module.exports = router;
