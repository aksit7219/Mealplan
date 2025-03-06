const mongoose = require("mongoose");

const mealTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Ensures each size has a unique name
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "", // Optional description for the size
    },
    forPlanBundle: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"], // Controls availability of the size
      default: "active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the admin who created the size
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the admin who last updated the size
      default: null,
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

const MealType = mongoose.model("MealType", mealTypeSchema);

module.exports = MealType;
