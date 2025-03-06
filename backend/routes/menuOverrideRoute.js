const express = require("express");
const router = express.Router();
const MenuOverride = require("../models/menuOverrideModel"); // Import the MenuOverride model
const Menu = require("../models/menuModel"); // Import the MenuItems model
const moment = require("moment");

// Create a Menu Override
router.post("/menu-overrides", async (req, res) => {
  try {
    const menuOverride = new MenuOverride(req.body);
    await menuOverride.save();
    res.status(201).json(menuOverride);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Menu Overrides
router.get("/menu-overrides", async (req, res) => {
  try {
    const menuOverrides = await MenuOverride.find();
    res.status(200).json(menuOverrides);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Menu Overrides by Menu ID
router.get("/menu-overrides/:menuId", async (req, res) => {
  const { menuId } = req.params;

  try {
    const menuOverrides = await MenuOverride.find({ menu: menuId });
    res.status(200).json(menuOverrides);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Menu Overrides by Menu ID and Bundle ID
router.get("/menu-overrides/:menuId/:bundleId", async (req, res) => {
  const { menuId, bundleId } = req.params;

  try {
    const menuOverride = await MenuOverride.findOne({
      menu: menuId,
      bundle: bundleId,
    });
    if (!menuOverride)
      return res.status(404).json({ error: "Menu Override not found" });
    res.status(200).json(menuOverride);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a Menu Override
router.put("/menu-overrides/:id", async (req, res) => {
  console.log("----------data come in right ");
  try {
    const menuOverride = await MenuOverride.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!menuOverride)
      return res.status(404).json({ error: "Menu Override not found" });
    res.status(200).json(menuOverride);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a Menu Override
router.delete("/menu-overrides/:id", async (req, res) => {
  try {
    const menuOverride = await MenuOverride.findByIdAndDelete(req.params.id);
    if (!menuOverride)
      return res.status(404).json({ error: "Menu Override not found" });
    res.status(200).json({ message: "Menu Override deleted successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Weekly Menu Overrides
router.get("/menu-overrides-weekly/:menuId", async (req, res) => {
  const { menuId } = req.params;

  const getISOWeekDates = () => {
    const currentWeekStart = moment().startOf("isoWeek").toDate();
    const currentWeekEnd = moment().endOf("isoWeek").toDate();
    return { start: currentWeekStart, end: currentWeekEnd };
  };

  const { start, end } = getISOWeekDates();

  try {
    const menuOverrides = await MenuOverride.find({
      menu: menuId,
      date: {
        $gte: start,
        $lte: end,
      },
    });

    res.status(200).json(menuOverrides);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Menu Items for a Week
router.get(
  "/menu-override-by-mealplan/:mealplanId/:bundleId",
  async (req, res) => {
    const { mealplanId, bundleId } = req.params;
    const menu = await Menu.find({ mealplans: mealplanId }).populate(
      "createdBy"
    );
    // console.log("--", menu);
    function getISOWeekDates2(
      isoWeekNum = moment().isoWeek(),
      year = new Date().getFullYear()
    ) {
      let d = moment(
        String(year).padStart(4, "0") +
          "W" +
          String(isoWeekNum).padStart(2, "0")
      );
      for (var dates = [], i = 0; i < 7; i++) {
        dates.push(d.toISOString());
        d.add(1, "day");
      }
      return dates;
    }
    const startOfDay = new Date(getISOWeekDates2().at(0));
    const endOfDay = new Date(
      getISOWeekDates2()[getISOWeekDates2().length - 1]
    );
    // Set the time to end of day (23:59:59.999)
    endOfDay.setHours(23, 59, 59, 999);
    // console.log(endOfDay, getISOWeekDates2());

    const menuItems = await MenuOverride.find({
      menu: menu[0]?._id,
      bundles: {
        $elemMatch: { bundleId: bundleId, isCustomized: true }, // Match bundleId and isCustomized
      },
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
  }
);

module.exports = router;
