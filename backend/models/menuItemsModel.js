const mongoose = require("mongoose");

const menuItemsSchema = new mongoose.Schema(
  {
    menu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu", // Reference to the Menu collection
      required: true,
    },
    date: {
      type: Date,
      required: true, // Date of the specific menu
    },
    items: {
      breakfast: [
        {
          dishId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe",
            required: true,
          }, // Reference to the dish ID
          name: { type: String, required: true }, // Name of the dish
          isDefault: { type: Boolean, default: false }, // Whether this dish is the default option
          isInclude: { type: Boolean, default: false }, // Whether this dish is included
          createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the user who created this item
        },
      ],
      amsnack: [
        {
          dishId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe",
            required: true,
          },
          name: { type: String, required: true },
          isDefault: { type: Boolean, default: false },
          isInclude: { type: Boolean, default: false },
          createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
      ],
      snack: [
        {
          dishId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe",
            required: true,
          },
          name: { type: String, required: true },
          isDefault: { type: Boolean, default: false },
          isInclude: { type: Boolean, default: false },
          createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
      ],
      lunch: [
        {
          dishId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe",
            required: true,
          },
          name: { type: String, required: true },
          isDefault: { type: Boolean, default: false },
          isInclude: { type: Boolean, default: false },
          createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
      ],
      lunchside: [
        {
          dishId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe",
            required: true,
          },
          name: { type: String, required: true },
          isDefault: { type: Boolean, default: false },
          isInclude: { type: Boolean, default: false },
          createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
      ],
      pmsnack: [
        {
          dishId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe",
            required: true,
          },
          name: { type: String, required: true },
          isDefault: { type: Boolean, default: false },
          isInclude: { type: Boolean, default: false },
          createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
      ],
      dinner: [
        {
          dishId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe",
            required: true,
          },
          name: { type: String, required: true },
          isDefault: { type: Boolean, default: false },
          isInclude: { type: Boolean, default: false },
          createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
      ],
      dinnerside: [
        {
          dishId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe",
            required: true,
          },
          name: { type: String, required: true },
          isDefault: { type: Boolean, default: false },
          isInclude: { type: Boolean, default: false },
          createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
      ],
      side: [
        {
          dishId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe",
            required: true,
          },
          name: { type: String, required: true },
          isDefault: { type: Boolean, default: false },
          isInclude: { type: Boolean, default: false },
          createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
      ],
      drink: [
        {
          dishId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Recipe",
            required: true,
          },
          name: { type: String, required: true },
          isDefault: { type: Boolean, default: false },
          isInclude: { type: Boolean, default: false },
          createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        },
      ],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User who created the menu
      required: true,
    },
  },
  { timestamps: true }
);

const MenuItems = mongoose.model("MenuItems", menuItemsSchema);

module.exports = MenuItems;
