const mongoose = require("mongoose");

const kitchenSecCategorieSchema = new mongoose.Schema(
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

const KitchenSectionCategorie = mongoose.model(
  "KitchenSectionCategorie",
  kitchenSecCategorieSchema
);

module.exports = KitchenSectionCategorie;
