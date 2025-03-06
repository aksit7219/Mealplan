const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    dob: {
      type: Date,
    },
    allergies: {
      type: [String],
    },
    dislikes: {
      type: [String],
    },
    address: {
      floor: { type: String },
      building: { type: String },
      apartment: { type: String },
      area: { type: String },
      city: { type: String },
      district: { type: String },
      deliveryNote: { type: String },
      deliveryTimings: { type: String },
      building: { type: String },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["customer", "admin", "superadmin", "restaurant"],
      default: "customer",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
