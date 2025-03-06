const mongoose = require("mongoose");

const menuItemsSchema = new mongoose.Schema(
  {
    menu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu", // Reference to the Menu collection
      required: true,
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
    date: {
      type: Date,
      required: true, // Date of the specific menu
    },
    items: [
      {
        dishId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Recipe",
          required: true,
        }, // Reference to the dish ID
        name: { type: String, required: true }, // Name of the dish
        type: { type: String, required: true }, // Name of the dish
        selectedBy: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the User who selected this item
          },
        ],
        isDefault: { type: Boolean, default: false }, // Whether this dish is the default option
        isInclude: { type: Boolean, default: false }, // Whether this dish is included
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the user who created this item
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

const MenuItems = mongoose.model("MenuItems", menuItemsSchema);

module.exports = MenuItems;
