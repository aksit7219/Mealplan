const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    mealplans: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MealPlan", // Reference to the MealPlan collection
      },
    ],
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["draft", "active", "inactive", "archived"], // You can define other statuses if needed
      default: "active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User who created the menu
      required: false,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt timestamps

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
