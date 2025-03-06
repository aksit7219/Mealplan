const mongoose = require("mongoose");

const menuOverrideSchema = new mongoose.Schema(
  {
    menu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: true,
    },
    date: {
      type: Date,
      required: true, // Date of the specific menu
    },
    bundles: [
      {
        bundleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Bundle",
        },
        isCustomized: {
          type: Boolean,
          default: false, // Initially, no custom menu
        },
      },
    ],
    items: [
      {
        dishId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Recipe",
          required: true,
        },
        name: { type: String, required: true },
        type: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
        isInclude: { type: Boolean, default: false },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const MenuOverride = mongoose.model("MenuOverride", menuOverrideSchema);

module.exports = MenuOverride;
