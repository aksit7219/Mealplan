const mongoose = require("mongoose");

const purchasedPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plans: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MealPlan",
      required: true,
    },
    bundles: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlanBundles",
      required: true,
    },
    calorieRange: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    totalDays: {
      type: Number,
    },
    totalAmount: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled", "freeze", "pause"],
      default: "active",
    },
    coolBag: {
      hasReceived: {
        type: Boolean,
        default: false,
      },
      deposit: {
        type: Number,
        default: 0,
      },
      quantity: {
        type: Number,
        default: 0,
      },
      remarks: { type: String },
    },
    // Payment details
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: String,
    transactionId: String,
  },
  { timestamps: true }
);

const PurchasedPlans = mongoose.model("PurchasedPlan", purchasedPlanSchema);

module.exports = PurchasedPlans;
