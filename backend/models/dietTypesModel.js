const mongoose = require("mongoose");
const dietTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Ensures each diet type has a unique name
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "", // Optional description for the diet type
    },
    status: {
      type: String,
      enum: ["active", "inactive"], // Indicates if the diet type is currently in use
      default: "active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the admin who created this diet type
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the admin who last updated this diet type
      default: null,
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

const DietType = mongoose.model("DietType", dietTypeSchema);

module.exports = DietType;
