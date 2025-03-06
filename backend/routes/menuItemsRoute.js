const express = require("express");
const router = express.Router();
const MenuItems = require("../models/menuItemsModel"); // Import the MenuItems model
const Menu = require("../models/menuModel"); // Import the MenuItems model

const moment = require("moment");
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
    const menuItems = await MenuItems.find();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Get All Menu Items
router.get("/menu-items/:menuId", async (req, res) => {
  const { menuId } = req.params;

  try {
    const menuItems = await MenuItems.find({ menu: menuId });
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
    });
    if (!menuItems)
      return res.status(404).json({ error: "Menu Item not found" });
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Menu Items by Date
router.get("/menu-items-by-date/:date", async (req, res) => {
  const { date } = req.params;

  try {
    // Create start and end of day dates to match only by date
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0); // Set to 00:00:00:000 (midnight)

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999); // Set to 23:59:59:999 (end of the day)

    // Query menu items where the date is within the start and end of the given day
    const menuItems = await MenuItems.find({
      date: {
        $gte: startDate, // Greater than or equal to start of the day
        $lt: endDate, // Less than the end of the day
      },
    });

    if (!menuItems || menuItems.length === 0)
      return res
        .status(404)
        .json({ error: "No menu items found for the given date" });

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

// Get Menu Items for a Week
router.get("/menu-items-weekly/:menuId", async (req, res) => {
  const { menuId } = req.params;

  function getISOWeekDates2(
    isoWeekNum = moment().isoWeek(),
    year = new Date().getFullYear()
  ) {
    let d = moment(
      String(year).padStart(4, "0") + "W" + String(isoWeekNum).padStart(2, "0")
    );
    for (var dates = [], i = 0; i < 7; i++) {
      dates.push(d.toISOString());
      d.add(1, "day");
    }
    return dates;
  }
  const startOfDay = new Date(getISOWeekDates2().at(0));
  const endOfDay = new Date(getISOWeekDates2()[getISOWeekDates2().length - 1]);
  // Set the time to end of day (23:59:59.999)
  endOfDay.setHours(23, 59, 59, 999);
  // console.log(endOfDay, getISOWeekDates2());

  const menuItems = await MenuItems.find({
    menu: menuId,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  try {
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

// Get Menu Items for a Week
router.get("/menu-items-by-mealplan/:mealplanId", async (req, res) => {
  const { mealplanId } = req.params;
  const menu = await Menu.find({ mealplans: mealplanId }).populate("createdBy");
  function getISOWeekDates2(
    isoWeekNum = moment().isoWeek(),
    year = new Date().getFullYear()
  ) {
    let d = moment(
      String(year).padStart(4, "0") + "W" + String(isoWeekNum).padStart(2, "0")
    );
    for (var dates = [], i = 0; i < 7; i++) {
      dates.push(d.toISOString());
      d.add(1, "day");
    }
    return dates;
  }
  const startOfDay = new Date(getISOWeekDates2().at(0));
  const endOfDay = new Date(getISOWeekDates2()[getISOWeekDates2().length - 1]);
  // Set the time to end of day (23:59:59.999)
  endOfDay.setHours(23, 59, 59, 999);
  // console.log(endOfDay, getISOWeekDates2());

  const menuItems = await MenuItems.find({
    menu: menu[0]?._id,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  try {
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
