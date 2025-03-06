const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },
  cuisine: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  dietType: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  validity: {
    type: String,
  },
  tags: {
    type: [String],
  },
  image: {
    type: [String],
  },
  sizes: {
    type: [String],
    required: true,
  },
  mealType: {
    Breakfast: {
      type: Boolean,
      default: false,
    },
    Lunch: {
      type: Boolean,
      default: false,
    },
    Dinner: {
      type: Boolean,
      default: false,
    },
  },
  servingDetails: {
    description: { type: String },
    yield: { type: Number },
    numberOfServings: { type: Number },
    totalGrams: { type: Number },
    gramsPerServing: { type: Number },
  },
  instructions: {
    type: [String],
    required: true,
  },
  ingredients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ingredient",
    },
  ],
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
});

const Recipe = mongoose.model("Recipe", RecipeSchema);
module.exports = Recipe;
