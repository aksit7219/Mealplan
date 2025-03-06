const express = require("express");
const router = express.Router();
const PurchasedPlans = require("../models/purchasedPlansModel"); // Import the PurchasedPlan model

// Create a Purchased Plan
router.post("/purchased-plans", async (req, res) => {
  try {
    const activeSubscription = await PurchasedPlans.findOne({
      user: req.body.user,
      status: "active",
    });
    if (activeSubscription) {
      return res
        .status(400)
        .json({ message: "You already have an active plan." });
    }
    const purchasedPlan = new PurchasedPlans(req.body);
    await purchasedPlan.save();
    res.status(201).json(purchasedPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Purchased Plans
router.get("/purchased-plans", async (req, res) => {
  try {
    const purchasedPlans = await PurchasedPlans.find()
      .populate("user", "firstName lastName email")
      .populate("plans", "name")
      .populate("bundles", "name");
    res.status(200).json(purchasedPlans);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Purchased Plan by ID
router.get("/purchased-plans/:id", async (req, res) => {
  try {
    const purchasedPlan = await PurchasedPlans.findById(req.params.id)
      .populate("user", "firstName lastName email")
      .populate("plans", "name")
      .populate("bundles", "name");
    if (!purchasedPlan)
      return res.status(404).json({ error: "Purchased Plan not found" });
    res.status(200).json(purchasedPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a Purchased Plan
router.put("/purchased-plans/:id", async (req, res) => {
  try {
    const purchasedPlan = await PurchasedPlans.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!purchasedPlan)
      return res.status(404).json({ error: "Purchased Plan not found" });
    res.status(200).json(purchasedPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a Purchased Plan
router.delete("/purchased-plans/:id", async (req, res) => {
  try {
    const purchasedPlan = await PurchasedPlans.findByIdAndDelete(req.params.id);
    if (!purchasedPlan)
      return res.status(404).json({ error: "Purchased Plan not found" });
    res.status(200).json({ message: "Purchased Plan deleted successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Active Plans for a Specific User
router.get("/purchased-plans/user/:userId", async (req, res) => {
  try {
    const activePlans = await PurchasedPlans.find({
      user: req.params.userId,
      status: "active",
    })
      .populate("user", "firstName lastName email")
      .populate("plans", "name")
      .populate("bundles", "name");
    res.status(200).json(activePlans);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Status of a Purchased Plan
router.patch("/purchased-plans/:id/status", async (req, res) => {
  const { status } = req.body; // e.g., { status: "pause" }
  try {
    const purchasedPlan = await PurchasedPlans.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!purchasedPlan)
      return res.status(404).json({ error: "Purchased Plan not found" });
    res.status(200).json(purchasedPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Payment Status for a Purchased Plan
router.get("/purchased-plans/:id/payment-status", async (req, res) => {
  try {
    const purchasedPlan = await PurchasedPlans.findById(req.params.id);
    if (!purchasedPlan)
      return res.status(404).json({ error: "Purchased Plan not found" });
    res.status(200).json({ paymentStatus: purchasedPlan.paymentStatus });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Get Purchased Plans by Status
router.get("/purchased-plans/status/:status", async (req, res) => {
  const { status } = req.params;
  try {
    const plans = await PurchasedPlans.find({ status }).populate(
      "user",
      "name"
    );
    res.status(200).json(plans);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Purchased Plans Between Date Ranges
router.get("/purchased-plans/date-range", async (req, res) => {
  const { startDate, endDate } = req.query; // Pass dates as query parameters
  try {
    const plans = await PurchasedPlans.find({
      startDate: { $gte: new Date(startDate) },
      endDate: { $lte: new Date(endDate) },
    }).populate("user", "name");
    res.status(200).json(plans);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Total Revenue by Status
router.get("/purchased-plans/revenue/:status", async (req, res) => {
  const { status } = req.params;
  try {
    const plans = await PurchasedPlans.aggregate([
      { $match: { status } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);
    res.status(200).json(plans.length ? plans[0] : { totalRevenue: 0 });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update Payment Details
router.patch("/purchased-plans/:id/payment-details", async (req, res) => {
  const { paymentMethod, transactionId, paymentStatus } = req.body;
  try {
    const plan = await PurchasedPlans.findByIdAndUpdate(
      req.params.id,
      { paymentMethod, transactionId, paymentStatus },
      { new: true }
    );
    if (!plan)
      return res.status(404).json({ error: "Purchased Plan not found" });
    res.status(200).json(plan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Plans with Cool Bag Deposit
router.get("/purchased-plans/coolbag/deposit", async (req, res) => {
  try {
    const plans = await PurchasedPlans.find({ "coolBag.deposit": { $gt: 0 } });
    res.status(200).json(plans);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Extend Duration of a Purchased Plan
router.patch("/purchased-plans/:id/extend", async (req, res) => {
  const { extraDays } = req.body;
  try {
    const plan = await PurchasedPlans.findById(req.params.id);
    if (!plan)
      return res.status(404).json({ error: "Purchased Plan not found" });

    plan.endDate = new Date(
      plan.endDate.getTime() + extraDays * 24 * 60 * 60 * 1000
    );
    plan.totalDays += extraDays;
    await plan.save();

    res.status(200).json(plan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Count of Purchased Plans by Status
router.get("/purchased-plans/status-count", async (req, res) => {
  try {
    const counts = await PurchasedPlans.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    res.status(200).json(counts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Freeze or Pause a Purchased Plan
router.patch("/purchased-plans/:id/freeze-pause", async (req, res) => {
  const { status } = req.body; // e.g., { status: "freeze" }
  if (!["freeze", "pause"].includes(status))
    return res.status(400).json({ error: "Invalid status" });

  try {
    const plan = await PurchasedPlans.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!plan)
      return res.status(404).json({ error: "Purchased Plan not found" });
    res.status(200).json(plan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Search Purchased Plans by User Name or Email
router.get("/purchased-plans/search", async (req, res) => {
  const { query } = req.query; // Pass the search query as a query parameter
  try {
    const plans = await PurchasedPlans.find()
      .populate({
        path: "user",
        match: {
          $or: [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        },
      })
      .populate("plans", "name");

    const filteredPlans = plans.filter((plan) => plan.user !== null);
    res.status(200).json(filteredPlans);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Purchased Plans by MealPlan or Bundle
router.get("/purchased-plans/by-plan-or-bundle", async (req, res) => {
  const { mealPlanId, bundleId } = req.query; // Pass mealPlanId or bundleId as query params
  try {
    const plans = await PurchasedPlans.find({
      $or: [{ plans: mealPlanId }, { bundles: bundleId }],
    }).populate("user", "name");
    res.status(200).json(plans);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
